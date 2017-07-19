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
