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
    listProducts();
});
function listProducts() {
    query = "SELECT item_id, product_name, price FROM products";
    connection.query(query, function(err, res) {
        var table = new AsciiTable();
        table.setHeading("item_id", "product_name", "price");
        for (var i = 0; i < res.length; i++) {
            var itemID = res[i].item_id; 
            var productName = res[i].product_name;
            var price = res[i].price;
            table.addRow(itemID, productName, price);
        }
        console.log(table.toString());
        customerUI();
    });
}
function customerUI() {
    inquirer.prompt([{
        name: "itemID",
        type: "input",
        message: "Please enter the ID of the product you want to purchase:",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return "Please enter numbers only.";
        }
    }, {
        name: "quantity",
        type: "input",
        message: "Please enter how many you wish to purchase:",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return "Please enter numbers only.";
        }
    }]).then(function(answer) {
        // connect to the mySQL database and run this query below (shows info of product data based on user input)
        query = "SELECT product_name, price, stock_quantity, product_sales FROM products WHERE item_id = " + answer.itemID;
        connection.query(query, function(err, res) {
            if (err) throw err;
            var productName = res[0].product_name;
            var productPrice = parseFloat(res[0].price);
            var stockQuantity = parseInt(res[0].stock_quantity);
            var productSales = parseFloat(res[0].product_sales);

            var userQuantity = parseInt(answer.quantity);

            var newQuantity = stockQuantity - userQuantity;
            var totalPrice = productPrice * userQuantity;
            var newProductSales = productSales + totalPrice;
            // Check to see if we have enough quantity.
            if (stockQuantity >= userQuantity) {
                // Update the database with the new quantity
                query = "UPDATE products SET stock_quantity = " + newQuantity + ", product_sales = " + newProductSales + " WHERE item_id = " + answer.itemID;
                connection.query(query, function(err, res) {
                    if (err) throw err;
                    //console.log("\n" + res.affectedRows + " products updated!\n");
                });
                //Sends the user  message confirming the order when sufficient qty. in stock
                console.log("\nThank you! Order has been placed! \n" + userQuantity + " orders of " + productName + " for $" + productPrice + " each.\nYour total is $" + totalPrice + ".\n");
                // Notify user that we don't have their deisred qty.
            } else {
                console.log("\n Sorry! " + productName + " has insufficient quantity!\n");
            }
            customerUI();
        });
    });
};