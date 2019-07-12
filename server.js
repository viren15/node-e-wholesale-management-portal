const mysql = require('mysql');
const http = require('http');
const express = require('express');
const bodyparser = require('body-parser');
const hbs = require('hbs');
const html = require('html');

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true,
}));

app.use(express.static(__dirname + '/client'));

app.set('view engine', 'hbs');

function connect() {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Viren@2231',
        database: 'viren',
        insecureAuth: true,
    })
    connection.connect
    return connection;
}

// new user
app.post('/signIn', (req, res) => {
    user_id = req.body.user_id;
    user_pass = req.body.user_pass;
    var connection = connect();
    var sql = `select * from users where user_id="${user_id}"`
    connection.query(sql, (err, rows, fields) => {
        connection.end;
        if (rows.length !== 0) {
            res.render('addnewuser.hbs', {
                text: 'user already exist',
            })
        }
    });
    connection.query(' insert into users values("' + user_id + '" , "' + user_pass + '")', (err, rows, fields) => {
        connection.end;
        if (err) {
            console.log(err);
            msg = 'failed'
        } else {
            msg = 'success';
        }
        res.render('index.hbs', {
            text: msg,
        })
    })
});

// from index.html file
app.post('/login', (req, res) => {
    user_id = req.body.username;
    password = req.body.password;
    var connection = connect();
    connection.query(`select user_pass from users where user_id ="${req.body.username}"`, (err, rows, fields) => {
        connection.end;
        if (err) {
            console.log(err);
        }
        else if (rows.length === 0) {
            res.render('index.hbs', {
                text: 'userid does not exist'
            })
        }
        else if (rows[0].user_pass !== password) {
            res.render('index.hbs', {
                text: 'password is incorrect'
            })
        }
        else {
            res.render('option.hbs', {
            })
        }
    })
})
var msg;
// from addcustomer
app.post('/addcust', (req, res) => {
    cust_id = req.body.cust_id;
    cust_name = req.body.cust_name;
    cust_email = req.body.cust_email;
    cust_city = req.body.cust_city;
    contactNo1 = req.body.contactNo1;
    contactNo2 = req.body.contactNo2;
    console.log(req.body);
    var connection = connect();
    var sql = `select * from customer where cust_id="${cust_id}"`
    connection.query(sql, (err, rows, fields) => {
        connection.end;
        if (rows.length !== 0) {
            res.render('addcustomer.hbs', {
                text: 'customer_id already exist',
            })
        }
    });
    connection.query('insert into customer values("' + cust_id + '","' + cust_name + '","' + cust_email + '" , "' + cust_city + '" )', (err, rows, fields) => {
        connection.end;
        if (err) {
            console.log(err);
        }

        if (err) {
            if (err.code === 'ER_DUP_ENTRY')
                msg = 'Customer Already Registered';
        }
        else
            msg = 'Customer Added';
        res.render('addcustomer.hbs', {
            text: msg
        })
    });
    if (contactNo1 != "" && contactNo1.length == 10)
        connection.query('insert into contact_no values("' + cust_id + '","' + contactNo1 + '")', (err, rows, fields) => {
            connection.end;
            if (err) {
                console.log(err);
            }

        })
    if (contactNo2 != "" && contactNo2.length == 10)
        if (contactNo2 != contactNo1) {
            connection.query('insert into contact_no values("' + cust_id + '","' + contactNo2 + '")', (err, rows, fields) => {
                connection.end;
                if (err) {
                    console.log(err);
                }

            })
        };
    console.log(msg);


})
// for removecustomer
app.post('/remcust', (req, res) => {
    cust_id = req.body.cust_id;
    var connection = connect();
    connection.query(' delete from customer where cust_id = "' + cust_id + '" ', (err, rows, fields) => {
        connection.end;
        if (err) {
            console.log(err);
            msg = 'failed'
        } else {
            msg = 'success';
        }
        res.render('removecustomer.hbs', {
            text: msg,
        })
    })
})
// search customer
// for removecustomer
app.post('/searchcust', (req, res) => {
    cust_id = req.body.cust_id;
    var connection = connect();
    connection.query(' select * from customer where cust_id = "' + cust_id + '" ', (err, rows, fields) => {
        connection.end;
        if (err) {
            console.log(err);
            msg = 'failed';
            res.render('searchcustomer.hbs', {

            });
        } else {
            msg = 'success';

        }
        console.log(rows);
        if (rows.length != 0)
            res.render('searchcustomer.hbs', {
                cust_id: ' cust_id:      ' + rows[0].cust_id,
                cust_name: ' cust_name:    ' + rows[0].cust_name,
                cust_email: ' cust_email:   ' + rows[0].cust_email,
                cust_city: ' cust_city:    ' + rows[0].cust_city,
            })
        else
            res.render('searchcustomer.hbs', {
                text: 'customer not found',
            });
    })
})

// add product
app.post('/addprod', (req, res) => {
    product_id = req.body.product_id;
    product_type = req.body.product_type;
    product_desc = req.body.product_desc;
    product_price = req.body.product_price;
    brand = req.body.brand;
    var connection = connect();
    var sql = `select * from product where product_id="${product_id}"`
    connection.query(sql, (err, rows, fields) => {
        connection.end;
        if (rows.length !== 0) {
            res.render('addproduct.hbs', {
                text: 'product_id already exist',
            })
        }
    });
    connection.query('insert into product values("' + product_id + '","' + product_type + '","' + product_desc + '" , "' + product_price + '" ,"' + brand + '" )', (err, rows, fields) => {
        connection.end;
        if (err) {
            console.log(err);
            msg = 'failed'
        } else {
            msg = 'success';
        }
        res.render('addproduct.hbs', {
            text: msg,
        })
    })
})

// remove product 
app.post('/remprod', (req, res) => {
    product_id = req.body.product_id;
    var connection = connect();
    connection.query(' delete from product where product_id = "' + product_id + '" ', (err, rows, fields) => {
        connection.end;
        if (err) {
            console.log(err);
            msg = 'failed'
        } else {
            msg = 'success';
        }
        res.render('removeproduct.hbs', {
            text: msg,
        })
    })
})
// update product price
app.post('/productPriceUpdate', (req, res) => {
    product_id = req.body.product_id;
    product_price = req.body.product_price;

    var connection = connect();
    connection.query('update product set product_price =' + product_price + ' where product_id = "' + product_id + '" ', (err, rows, fields) => {
        connection.end;
        if (err) {
            console.log(err);
            msg = 'failed'
        } else {
            msg = 'success';
        }
        res.render('updateproductprice.hbs', {
            text: msg,
        })
    })
})
// search product
app.post('/searchprod', (req, res) => {
    product_id = req.body.product_id;
    var connection = connect();
    connection.query(' select * from product where product_id = "' + product_id + '" ', (err, rows, fields) => {
        connection.end;
        if (err) {
            console.log(err);
            msg = 'failed';
            res.render('searchproduct.hbs', {

            });
        } else {
            msg = 'success';

        }
        console.log(rows);
        if (rows.length != 0)
            res.render('searchproduct.hbs', {
                id: ' product_id:      ' + rows[0].product_id,
                type: ' product_type:    ' + rows[0].product_type,
                price: ' product_price:   ' + rows[0].product_price,
                desc: ' product_desc:    ' + rows[0].product_desc,
                brand: 'brand :    ' + rows[0].brand,
            })
        else
            res.render('searchproduct.hbs', {
                text: 'product not found',
            });
    })
})



// add supplier
app.post('/addsup', (req, res) => {
    sup_id = req.body.sup_id;
    sup_name = req.body.sup_name;
    sup_email = req.body.sup_email;
    var connection = connect();
    var sql = `select * from supplier where sup_id="${sup_id}"`
    connection.query(sql, (err, rows, fields) => {
        connection.end;
        if (rows.length !== 0) {
            res.render('addsupplier.hbs', {
                text: 'supplier_id  already exist',
            })
        }
    });
    connection.query('insert into supplier values("' + sup_id + '","' + sup_name + '","' + sup_email + '" )', (err, rows, fields) => {
        connection.end;
        if (err) {
            console.log(err);
            msg = 'failed'
        } else {
            msg = 'success';
        }
        res.render('addsupplier.hbs', {
            text: msg,
        })
    })
})

// remove supplier
app.post('/remsup', (req, res) => {
    sup_id = req.body.sup_id;
    var connection = connect();
    connection.query(' delete from supplier where sup_id = "' + sup_id + '" ', (err, rows, fields) => {
        connection.end;
        if (err) {
            console.log(err);
            msg = 'failed'
        } else {
            msg = 'success';
        }
        res.render('removesupplier.hbs', {
            text: msg,
        })
    })
})

// add stock
app.post('/addstock', (req, res) => {
    // stock_id = req.body.stock_id;
    product_id = req.body.product_id;
    stock_desc = req.body.stock_desc;
    total_quantity = req.body.total_quantity;
    // stock_value = req.body.stock_value;
    sup_id = req.body.sup_id;
    var connection = connect();
    // "' + stock_id + '",
    var sql = `select * from stock where product_id="${product_id}"`
    connection.query(sql, (err, rows, fields) => {
        connection.end;
        if (rows.length !== 0) {
            res.render('addstock.hbs', {
                text: 'stock already exist , update the quantity :)',
            })
        }
    });
    connection.query('insert into stock values("' + product_id + '","' + stock_desc + '" ,' + total_quantity + ' , "' + sup_id + '" )', (err, rows, fields) => {
        connection.end;
        if (err) {
            console.log(err);
            msg = 'failed'
        } else {
            msg = 'success';
        }
        res.render('addstock.hbs', {
            text: msg,
        })
    })
})
// update stock
app.post('/updatestock', (req, res) => {
    product_id = req.body.product_id;
    total_quantity = req.body.total_quantity;
    // stock_value = req.body.stock_value;
    var add = 0;
    var connection = connect();

    connection.query('update stock set total_quantity =' + total_quantity + ' where product_id = "' + product_id + '" ', (err, rows, fields) => {
        connection.end;
        if (err) {
            console.log(err);
            msg = 'failed'
        } else {
            msg = 'success';
        }
        res.render('updatestock.hbs', {
            text: msg,
        })
    })
})

// search stock
app.post('/searchstock', (req, res) => {
    product_id = req.body.product_id;
    var connection = connect();
    connection.query(' select * from stock where product_id = "' + product_id + '" ', (err, rows, fields) => {
        connection.end;
        if (err) {
            console.log(err);
            msg = 'failed';
            res.render('searchstock.hbs', {

            });
        } else {
            msg = 'success';

        }
        console.log(rows);
        if (rows.length != 0)
            res.render('searchstock.hbs', {
                product_id: ' product_id:      ' + rows[0].product_id,
                stock_desc: ' stock_desc:    ' + rows[0].stock_desc,
                total_quantity: ' total_quantity:   ' + rows[0].total_quantity,
                sup_id: ' sup_id:    ' + rows[0].sup_id,
            })
        else
            res.render('searchstock.hbs', {
                text: 'stock not found',
            });
    })
})

// for placing order
app.post('/addbill', (req, res) => {
    bill_id = req.body.bill_id;
    product_id = req.body.product_id;
    cust_id = req.body.cust_id;
    bill_date = req.body.bill_date;
    pro_quantity = req.body.pro_quantity;
    var connection = connect();
    connection.query('select sum(total_quantity) as total from stock where product_id = "' + product_id + '"', (err, rows, fields) => {
        connection.end;
        console.log(err);
        console.log(rows);
        if (rows[0].total >= pro_quantity) {

            var billValue = 0;
            connection.query('update stock set total_quantity =' + (rows[0].total - pro_quantity) + ' where product_id = "' + product_id + '" ', (err, rows, fields) => {
                if (err)
                    console.log(err);
            });
            connection.query('select product_price from product where product_id= "' + product_id + '" ', (err, row, fields) => {
                console.log(row);
                billValue = row[0].product_price * pro_quantity;
            });
            connection.query('insert into bill values(' + bill_id + ',"' + product_id + '","' + cust_id + '","' + bill_date + '" ,' + pro_quantity + ' )', (err, rows, fields) => {
                connection.end;
                if (err) {
                    console.log(err);
                    msg = 'failed'
                } else {
                    msg = 'Bill amount: ' + billValue + '. Your Order Successfully Placed';
                }
                res.render('addbill.hbs', {
                    text: msg,
                })
            })
        }
        else {
            if (!rows[0].total) {
                res.render('addbill.hbs', {
                    text: "product not available",
                })
            }
            else {
                res.render('addbill.hbs', {
                    text: "only " + rows[0].total + " quantities available",
                })
            }

        }
    });
})


app.listen(3300, (err, res) => {
    if (err) {
        console.log("Error");
    }
    else {
        console.log("Connected to port 3300..");
    }
})