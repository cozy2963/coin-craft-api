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

module.exports = {
  getEmployee: getEmployee
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
