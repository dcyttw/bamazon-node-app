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
    managerUI();
});

function managerUI(){
	  inquirer
        .prompt({
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
        })
        .then(function(answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    var query = "SELECT * FROM products";
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
        for (var i = 0; i < res.length; i++) {
          var id = res[i].item_id; 
          var name = res[i].product_name;
          var times = 30-name.length;
          for (var j = 0; j<times; j++)
          {
              name += " ";
          }
          var price = res[i].price.toString();
          times = 10-price.length;
          for (var j = 0; j<times; j++)
          {
              price += " ";
          }
          var quantity = res[i].stock_quantity;
          console.log(`ID: ${id} | Item: ${name} | Price: $${price} | Quantity: ${quantity}`);
        }
        managerUI();
    });
}

function addInventory() {
    inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "Please type the ID of the product you wish to restock."
        },{
            name: "quantity",
            type: "input",
            message: "Please type how many you wish to add."
        }])
        .then(function(answer){
    	      var query = "SELECT * FROM products WHERE ??=?";
    	      var inserts = ["item_id",answer.id];
    	      var total;
    	      query = mysql.format(query,inserts);
            connection.query(query, function(err,res){
        	  if (err) throw err;
            updateQuantity(res[0],answer.quantity);
            managerUI();  
        });
    });
}

function updateQuantity(item,quantity,flag) {
	  var newTotal;
	  if (flag == "subtract") {
        newTotal = parseInt(item.stock_quantity) - parseInt(quantity);
	  } else {
		    newTotal = parseInt(item.stock_quantity) + parseInt(quantity);
	  }
	  var query = "UPDATE products SET ??=? WHERE ??=?";
	  var inserts = ["stock_quantity",newTotal,"item_id",item.item_id];
	  query = mysql.format(query,inserts);
	  connection.query(query, function(err,res){
        if (err) throw err; 
    });
}   

function addProduct(){
	  inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "Please type the ID of the product you wish to add."
        },{
            name: "quantity",
            type: "input",
            message: "Please type how many you wish to add."
        },{
            name: "name",
            type: "input",
            message: "Please type the name of the product you wish to add."
        },{
            name: "price",
            type: "input",
            message: "Please type the price of the product you wish to add."
        },{
            name: "department",
            type: "input",
            message: "Please type the department for the product you wish to add."
        }])
        .then(function(answer){
            var query = "INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES (?,?,?,?,?)";
	          var inserts = [answer.id, answer.name, answer.department, answer.price, answer.quantity];
	          query = mysql.format(query,inserts);
	          connection.query(query, function(err,res){
                if (err) throw err;
                console.log("New product added.");
                managerUI();
            });
        });
}