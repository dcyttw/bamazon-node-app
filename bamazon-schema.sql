-- Drops the "bamazon" database if it exists currently --
DROP DATABASE IF EXISTS bamazon;
-- Creates the "bamazon" database --
CREATE database bamazon;
-- Makes it so all of the following code will affect the "bamazon" database --
USE bamazon;
-- Creates the table "products" within "bamazon" database --
CREATE TABLE products (
	-- Creates a numeric column called "item_id" which will automatically increment its default value as we create new rows --
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	-- Makes a string column called "product_name" which cannot contain null --
	product_name VARCHAR(50) NOT NULL,
	-- Makes a string column called "department_name" which cannot contain null --
	department_name VARCHAR(50) NOT NULL,
	-- Makes an numeric column called "stock_quantity" which cannot contain null --
	price DECIMAL(10,2) NOT NULL,
	-- Makes an numeric column called "stock_quantity" which cannot contain null --
	stock_quantity INTEGER(10) NOT NULL,
	-- Makes an numeric column called "product_sales" which default to 0 --
	product_sales DECIMAL(15,2) DEFAULT 0,
	-- Sets "item_id" as this table's primary key which means all data contained within it will be unique --
	PRIMARY KEY (item_id)
);
-- Creates new rows containing data in all named columns --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("POne", "DOne", 100, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("PTwo", "DTwo", 100, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("PThree", "DThree", 100, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("PFour", "DFour", 100, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("PFive", "DFive", 100, 1);
-- Creates the table "departments" within "bamazon" database --
CREATE TABLE departments(
	-- Creates a numeric column called "department_id" which will automatically increment its default value as we create new rows --
	department_id INT(11) AUTO_INCREMENT NOT NULL,
	-- Makes a string column called "department_name" which cannot contain null --
	department_name VARCHAR(50) NOT NULL,
	-- Makes an numeric column called "over_head_costs" which cannot contain null --
	over_head_costs DECIMAL(10,2) NOT NULL,
	-- Sets "department_id" as this table's primary key which means all data contained within it will be unique --
	PRIMARY KEY (department_id)
);
INSERT INTO departments (department_name, over_head_costs)
VALUES ("DOne", 8000);
INSERT INTO departments (department_name, over_head_costs)
VALUES ("DTwo", 8000);
INSERT INTO departments (department_name, over_head_costs)
VALUES ("DThree", 8000);
INSERT INTO departments (department_name, over_head_costs)
VALUES ("DFour", 8000);
INSERT INTO departments (department_name, over_head_costs)
VALUES ("DFive", 80);