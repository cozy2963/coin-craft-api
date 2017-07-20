# Coin + Craft API

This project was created with [Swagger](https://swagger.io/docs/). See the [`swagger-node` repo](https://github.com/swagger-api/swagger-node) for a quick start guide to creating similar projects.

**Note for first-time users:**
You will need to install the swagger module.
``` bash
$ npm install -g swagger
```

## Starting the project
1. If you have not already done so, clone the project.
```bash
$ git clone https://github.com/AishaBlake/coin-craft-api.git
```
2. Run the project.
```bash
$ cd coin-craft-api
$ swagger project start
```
3. Optionally, you may use the built-in editor in your browser.
```bash
$ swagger project edit
```

## Editing the API
### In the browser
If you've chosen to use the **browser-based editor**, you'll see a split screen with the `swagger.yaml` file on the left and the Swagger Editor's interactive documentation on the right. This file is synced with the one at `api/swagger/swagger.yaml` and each will update the other while you keep the editor running. (You may need to refresh your browser window to see the changes.)

The editor will detect errors in your `swagger.yaml` file as well as allow you to test each call you define. That said, those errors are sometimes either confusing or inaccurate. When in doubt, refresh the page!

### In a text editor
Alternatively, you may find it easier to edit the file directly at `api/swagger/swagger.yaml`. The downside to this is that you won't get the automatic error detection of the browser-based editor. Use curl to test the paths you've defined. For example:
```bash
$ curl http://127.0.0.1:10010/employee?auth_id=XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

The above request should return an employee object that looks something like this:
```json
{
  "auth_id":"XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "current_balance":2889,
  "isAdmin":true,
  "name":"Aisha Blake"
}
```
## Consuming the API

### /employee
**GET:** returns an employee

Required parameter: `auth_id` (string)

200 Response:
```json
{
  "current_balance":	"number",
  "name":	"string",
  "isAdmin":	"boolean"
}
```

Error Response:
```json
{
  "message": "string"
}
```

### /expenses
**GET:** returns all of a certain employee's expenses

Required parameter: `auth_id` (string)

200 Response:
```json
{
  "approved_by": "string",
  "client_name": "string",
  "employee_auth_id": "string",
  "employee_name": "string",
  "expense_amount": "number",
  "expense_business_name": "string",
  "expense_description": "string",
  "expense_type": "string",
  "miles_amount": "number",
  "receipt_date": "string",
  "receipt_type": "string",
  "submitted_date": "string"
}
```

Error Response:
```json
{
  "message": "string"
}
```
