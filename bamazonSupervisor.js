// Node.js dependecies
var mysql = require("mysql");
var inquirer = require("inquirer");
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
// Connect to database
connection.connect(function(err) {
    if (err) throw err;
    //console.log("Connected as ID " + connection.threadId);
    supervisorInterface();
});

function supervisorUI() {
	  inquirer
      .prompt({
          name: "action",
          type: "list",
          message: "What would you like to do?",
          choices: [
              "View Product Sales by Department",
              "Add New Department",
              "Exit"
          ]
      })
      .then(function(answer) {
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
    var query = "SELECT department_id, d.department_name, SUM(p.product_sales) AS product_sales, over_head_costs, product_sales - over_head_costs AS total_profit FROM departments AS d INNER JOIN products AS p ON d.department_name = p.department_name GROUP BY d.department_name";
	  connection.query(query, function(err, res) {
        console.log("| department_id | department_name | product_sales | over_head_costs | total_profit |");
        for (var i = 0; i < res.length; i++) {
            var id = res[i].department_id;
            var diff = 13-id.length
            for (var j = 0; j<diff; j++)
            {
                id += " ";
            }
            var name = res[i].department_name;
            diff = 15-name.length;
            for (var j = 0; j<diff; j++)
            {
                name += " ";
            }
            var sales = res[i].product_sales.toString();
            diff = 13-sales.length;
            for (var j = 0; j<diff; j++)
            {
                sales += " ";
            }
            var costs = res[i].over_head_costs.toString();
            diff = 15-costs.length;
            for (var j = 0; j<diff; j++)
            {
                costs += " ";
            }
            var profit = res[i].total_profit.toString();
            diff = 12-profit.length;
            for (var j = 0; j<diff; j++)
            {
                profit += " ";
            }
            console.log(`| ${id} | ${name} | ${sales} | ${costs} | ${profit} |`);
        }
        supervisorUI();
    });
}

function addDepartment() {
	  inquirer
      .prompt([{
          name: "id",
          type: "input",
          message: "Please type the department ID."
      },{
          name: "name",
          type: "input",
          message: "Please type the department name."
      },{
          name: "costs",
          type: "input",
          message: "Please type the overhead costs."
      }])
      .then(function(answer){
          var query = "insert into departments (department_id, department_name, over_head_costs) values (?,?,?)";
	        var inserts = [answer.id, answer.name, answer.costs];
	        query = mysql.format(query,inserts);
	        connection.query(query, function(err,res){
          if (err) throw err;
            console.log("New department added.");
            supervisorUI();
          });
      });
}