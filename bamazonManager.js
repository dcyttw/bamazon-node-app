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
    managerUI();
});

function managerUI(){
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Exit"
        ]
    }).then(function(answer) {
        switch (answer.action) {
            case "View Products for Sale":
                query = "SELECT * FROM products";
                listProducts(query);
                break;
            case "View Low Inventory":
                var query = "SELECT * FROM products WHERE stock_quantity < 5";
                listProducts(query);
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Exit":
                connection.end();
                break;
            }
    });
}
function listProducts(query) {
    connection.query(query, function(err, res) {
        if (res.length > 0) {
            var table = new AsciiTable();
            table.setHeading("item_id", "product_name", "price", "quantity");
            for (var i = 0; i < res.length; i++) {
                var itemID = res[i].item_id; 
                var productName = res[i].product_name;
                var price = res[i].price;
                var quantity = res[i].stock_quantity;
                table.addRow(itemID, productName, price, quantity);
            }
            console.log(table.toString());
        } else {
            console.log("No product with an inventory count lower than five.!\n");
        }
        managerUI();
    });
}
function addInventory() {
    inquirer.prompt([{
        name: "itemID",
        type: "input",
        message: "Please type the ID of the product you wish to restock:"
    },{
        name: "quantity",
        type: "input",
        message: "Please type how many you wish to add:"
    }]).then(function(answer){
        query = "SELECT * FROM products WHERE item_id = " + answer.itemID;
        connection.query(query, function(err, res) {
            if (err) throw err;
            var stockQuantity = parseInt(res[0].stock_quantity);
            var userQuantity = parseInt(answer.quantity);
            var newQuantity = stockQuantity + userQuantity;
            query = "UPDATE products SET stock_quantity = " + newQuantity + " WHERE item_id = " + answer.itemID;
            connection.query(query, function(err, res) {
                if (err) throw err;
                //console.log("\n" + res.affectedRows + " products updated!\n");
            });
            managerUI();  
        });
    });
}
function addProduct() {
    inquirer.prompt([{
        name: "productName",
        type: "input",
        message: "Please enter the New Product Name:"
    },{
        name: "departmentName",
        type: "input",
        message: "Please enter the Department Name for the New Product:"
    }, {
        name: "price",
        type: "input",
        message: "Please enter the Price for the New Product:"
    },{
        name: "quantity",
        type: "input",
        message: "Please enter the Quantity for the New Product:"
    }]).then(function(answer){
        query = "INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('" + answer.productName + "', '" + answer.departmentName + "'," + parseFloat(answer.price) + "," + parseInt(answer.quantity) + ")";
        console.log(query);
        connection.query(query, function(err,res){
            if (err) throw err;
            console.log("New product added.");
            managerUI();
        });
    });
}