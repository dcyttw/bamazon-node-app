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
    listProducts();
});

function listProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
            var id = res[i].item_id; 
            var name = res[i].product_name;
            var times = 30-name.length;
            for (var j = 0; j<times; j++)
            {
                name += " ";
            }
            var price = res[i].price;
            console.log(`ID: ${id} | Item: ${name} | Price: $${price}`);
        }
        customerUI();
    });
}

function customerUI() {
    inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "Please type the ID of the product you wish to purchase."
        },{
            name: "quantity",
            type: "input",
            message: "Please type how many you wish to purchase."
        }])
        .then(function(answer){
    	      var query = "SELECT * FROM products WHERE ??=?";
    	      var inserts = ["item_id",answer.id];
    	      var total;
    	      query = mysql.format(query,inserts);
            connection.query(query, function(err,res){
                if (err) throw err;
                if (res)
                {
                    if(res[0].stock_quantity > answer.quantity)
                    {
                        total = answer.quantity * res[0].price;
                        updateQuantity(res[0],answer.quantity,total);
                        console.log(`Your order total is $${total}`);
                    }
                    else if (res[0].stock_quantity < answer.quantity)
                    {
            	          console.log("Insufficient quantity!");
                    }
                }    
                listProducts();
            });
        });
}

function updateQuantity(item,quantity,total) {
	  var newQuantity;
    newQuantity = item.stock_quantity + quantity;
    var newTotal = item.product_sales + total;
	  var query = "UPDATE products SET ??=?, ??=? WHERE ??=?";
	  var inserts = ["stock_quantity",newQuantity,"product_sales",newTotal,"item_id",item.item_id];
	  query = mysql.format(query,inserts);
	  connection.query(query, function(err,res) {
        if (err) throw err;
    });
}