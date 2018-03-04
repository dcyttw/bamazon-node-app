// Node.js dependecies
var mysql = require("mysql");
var inquirer = require("inquirer");
var AsciiTable = require('ascii-table');
var query = "";
// Connection Strings
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // MySQL Database user's name
    user: "dennis",
    // MySQL Database user's password
    password: "3420Main!",
    // MySQL Database's schema to connect to
    database: "bamazon"
});
// Connect to MySQL Database
connection.connect(function(err) {
    if (err) throw err;
    console.log("Database connected as ID " + connection.threadId + "\n");
    supervisorUI();
});

function supervisorUI() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Product Sales by Department",
            "Add New Department",
            "Exit"
        ]
    }).then(function(answer) {
        switch (answer.action) {
            case "View Product Sales by Department":
                listProductSales();
                break;
            case "Add New Department":
                addDepartment();
                break;
            case "Exit":
                connection.end();
                break;
            }
    });
}
function listProductSales() {
    query = "SELECT department_id, d.department_name, over_head_costs, SUM(product_sales) AS product_sales, SUM(product_sales) - over_head_costs AS total_profit FROM products AS p, departments AS d WHERE p.department_name = d.department_name GROUP BY p.department_name, department_id ORDER BY department_id";
    connection.query(query, function(err, res) {
        var table = new AsciiTable();
        table.setHeading("department_id", "department_name", "product_sales", "over_head_costs", "total_profit");
        for (var i = 0; i < res.length; i++) {
            var departmentID = res[i].department_id;
            var departmentName = res[i].department_name;
            var overheadCosts = res[i].over_head_costs;
            var productSales = res[i].product_sales;
            var totalProfit = res[i].total_profit;
            table.addRow(departmentID, departmentName, overheadCosts, productSales, totalProfit);
        }
        console.log(table.toString());
        supervisorUI();
    });
}
function addDepartment() {
    inquirer.prompt([{
        name: "departmentName",
        type: "input",
        message: "Please type the department name:"
    },{
        name: "overheadCosts",
        type: "input",
        message: "Please type the overhead costs:"
    }]).then(function(answer){
        query = "INSERT INTO departments (department_name, over_head_costs) VALUES ('" + answer.departmentName + "', " + parseFloat(answer.overheadCosts) + ")";
        connection.query(query, function(err,res){
            if (err) throw err;
            console.log("New department added.");
            supervisorUI();
        });
    });
}