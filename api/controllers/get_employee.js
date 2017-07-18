'use strict';
var util = require('util');
var admin = require('firebase-admin');

var serviceAccount = require("../../db-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://coin-craft.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("employees");
var expensesRef = db.ref("expenses");

module.exports = {
  getEmployee: getEmployee,
  createExpense: createExpense
};

function getEmployee(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var id = req.swagger.params.auth_id.value;
  var employee;

  ref.orderByChild("auth_id").equalTo(id).once("value", function(snapshot) {
    var name = Object.getOwnPropertyNames(snapshot.val());
    employee = snapshot.val()[name];
    res.json(employee);
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

function createExpense(req, res) {
  var newExpense = req.swagger.params.expense.value;
  var amount;
  if(newExpense.receiptSubmitType === 'mileage') {
    amount = newExpense. * 0.575;
  } else {
    amount = this.form.value['expenseAmount'];
  }

  let balance = Number(this.employee['current_balance']) - Number(this.form.value['expenseAmount']) ;

  let receiptDateString = `${this.selectedDate.month}/${this.selectedDate.day}/${this.selectedDate.year}`;

  if(balance >= 0) {
    let roundedAmount = (Math.round(amount * 100) / 100).toFixed(2);
    this.expenses.push({
      employee_name: this.employee['name'],
      employee_auth_id: this.employeeID,
      submitted: new Date().toLocaleDateString(),
      submitted_month: new Date().getUTCMonth(),
      expense_type: this.form.value['expenseType'],
      amount: roundedAmount,
      receipt: "N/A",
      receipt_type: this.form.value['receiptSubmitType'],
      receipt_date: receiptDateString,
      approver: this.form.value['founder'],
      business_name: this.form.value['businessName'],
      miles_amount: (Math.round(this.form.value['milesAmount'] * 100) / 100).toFixed(2),
      client: this.form.value['clientName'],
      expense_description: this.form.value['expenseDescription']
    }).then(_ => {
      if (this.form.value['expenseType'] !== "notCoinCraft") {
        this.employees.update(this.employeeKey, {current_balance: balance}).then(_ => {
          this.saveSuccess = true;
          this.saveFail = false;
          this.form.reset();
        }).catch(error => {
          this.failMessage = "Something went wrong when trying to update your balance: " + error;
          this.saveSuccess = false;
          this.saveFail = true;
        });
      } else {
        this.saveSuccess = true;
        this.saveFail = false;
        this.form.reset();
      }
    }).catch(error => {
      this.failMessage = "Something went wrong when trying to submit an expense: " + error;
      this.saveSuccess = false;
      this.saveFail = true;
    });
  } else {
    this.failMessage = "You don't have enough in your C+C for this. Current balance: $" + this.employee['current_balance'] ;
    this.saveSuccess = false;
    this.saveFail = true;
  }
}
