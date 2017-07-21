'use strict';
var util = require('util');
var admin = require('firebase-admin');

var serviceAccount = require("../../db-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://coin-craft.firebaseio.com"
});

var db = admin.database();
var employeesRef = db.ref("employees");
var expensesRef = db.ref("expenses");

module.exports = {
  getEmployee: getEmployee,
  createExpense: createExpense,
  getExpenses: getExpenses
};

function getEmployee(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var id = req.swagger.params.auth_id.value;
  var employee;

  employeesRef.orderByChild("auth_id").equalTo(id).once("value", function(snapshot) {
    var name = Object.getOwnPropertyNames(snapshot.val());
    employee = snapshot.val()[name];
    res.json(employee);
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

function getExpenses(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var id = req.swagger.params.auth_id.value;

  expensesRef.orderByChild("employee_auth_id").equalTo(id).once("value", function(snapshot) {
    var expenses = Object.getOwnPropertyNames(snapshot.val());
    var resExpenses = [];
    expenses.forEach(function(expense) {
      resExpenses.push({
        approved_by: snapshot.val()[expense].approved_by,
        client_name: snapshot.val()[expense].client_name,
        employee_auth_id: snapshot.val()[expense].employee_auth_id,
        employee_name: snapshot.val()[expense].employee_name,
        expense_amount: snapshot.val()[expense].expense_amount,
        expense_business_name: snapshot.val()[expense].expense_business_name,
        expense_description: snapshot.val()[expense].expense_description,
        expense_type: snapshot.val()[expense].expense_type,
        miles_amount: snapshot.val()[expense].miles_amount,
        receipt_date: snapshot.val()[expense].receipt_date,
        receipt_type: snapshot.val()[expense].receipt_type,
        submitted_date: snapshot.val()[expense].submitted_date
      });
    });
    res.json(resExpenses);
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

function createExpense(req, res) {

    var expense = req.swagger.params.expense.value;
    var amount;
    var employee;

    employeesRef.orderByChild("auth_id").equalTo(expense.employee_auth_id).once("value", function(snapshot) {
      var name = Object.getOwnPropertyNames(snapshot.val());
      employee = snapshot.val()[name];

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

    if(expense.receipt_type == 'mileage') {
      amount = expense.miles_amount * 0.575;
    } else {
      amount = expense.expense_amount;
    }

    var balance = Number(employee.current_balance) - Number(amount);

    var receiptDateString = `${this.selectedDate.month}/${this.selectedDate.day}/${this.selectedDate.year}`;

    if(employee.current_balance >= 0) {
      var roundedAmount = (Math.round(amount * 100) / 100).toFixed(2);

      expense.push({
        employee_name: this.employee['name'],
        employee_auth_id: this.employeeID,
        submitted_date: new Date().toLocaleDateString(),
        expense_type: this.form.value['expenseType'],
        expense_amount: Number(roundedAmount),
        receipt_type: this.form.value['receiptSubmitType'],
        receipt_date: receiptDateString,
        approved_by: this.form.value['founder'],
        expense_business_name: this.form.value['businessName'],
        miles_amount: Number((Math.round(this.form.value['milesAmount'] * 100) / 100).toFixed(2)),
        client_name: this.form.value['clientName'],
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
