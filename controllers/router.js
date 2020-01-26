module.exports = (app) => {
    const mysql = require('mysql');
    const JWT = require('jsonwebtoken');
    const secret = "omgaadadsadsadadsa";
    const cookieParser = require('cookie-parser');
    const auth = require('./auth');

    app.use(cookieParser());
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'eco'
    });

    db.connect((err, result) => {
        if (err) {
            console.log('error');
        } else {
            console.log("CONNECTED!");
        }
    });


    function getitems() {
        db.query('SELECT * FROM seeds', (err, result) => {
            if (err) {
                console.log(err);
            } else {


                // console.log(result);
                halt = result;
                return halt;
            }

        });

    }


    function registerUser(user, password) {
        var sql = "INSERT INTO `users` (`user_name`, `user_pass`) VALUES ('" + user + "','" + password + "')";
        db.query(sql);
    }


    const valx = function validateUser(username, password) {

        var sql = 'SELECT * FROM users WHERE user_name = ? OR user_pass = ?';
        db.query(sql, [username, password], function (err, result) {
            if (err) console.log(err);



            return result[0].user_name, result[0].user_pass;

        });

        return res

    }
    app.get('/buyerlogin', (req, res) => {

        res.render('buyerlogin');


    });
    app.post('/buyerlogin', (req, res) => {


        var name = req.body.user;
        var password = req.body.password;

        db.query('SELECT * FROM buyer WHERE buyer_name = ?', [name], function (error, results, fields) {
            if (error) {
                // console.log("error ocurred",error);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {
                // console.log('The solution is: ', results);
                if (results.length > 0) {
                    if (results[0].buyer_password == password) {

                        //
                        const buyer_id = results[0].buyer_id;
                        const buyer_name = results[0].buyer_name;
                        const buyer_bank_id = results[0].bank_idd;
                        const payload = {
                            name: buyer_name,
                            id: buyer_id,
                            bank_id:buyer_bank_id

                        }
                        const token = JWT.sign(payload, secret)
                        res.cookie('access_token', token);

                        res.redirect('/products');
                    } else {
                        res.send({
                            "code": 204,
                            "success": "Email and password does not match"
                        });
                    }
                } else {
                    res.send({
                        "code": 204,
                        "success": "Email does not exits"
                    });
                }
            }
        });
    });
    //routing with get
    app.get('/', (req, res) => {
        var buyer;
        var user;
        try{
            const token = req.cookies.access_token;
            const decoded = JWT.verify(token, secret);
            user = decoded.name;
       
        }catch (error){
            user = "blank";
            
        }
        console.log(user);
        res.render('index', {user,buyer});
    });

    //about!
    app.get('/about', (req, res) => {

        res.render('about');
    });

    //contact!
    app.get('/contact', (req, res) => {

        res.render('contact');
    });

    //products!
    app.get('/products', (req, res) => {
        
        db.query("SELECT * FROM seeds", function (err, result, fields) {
            if (err) res.send(err);


            console.log(result)
            res.render('products', {
                result
            });

        });
    });

    //single product
    app.get('/products/:id',auth, (req, res) => {

        var id = req.params.id;
        db.query("SELECT * FROM seeds WHERE seed_id = " + id, function (err, result, fields) {
            var har = `http://localhost:3000/buy/${id}`;

            res.render('single', {
                result, har
            });
        })
    });

    app.get('/buyer', (req, res) => {
        res.render('buyer');
    })

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    app.post('/buyer', (req, res) => {

        const name = req.body.user;
        const pass = req.body.password;
        const email = req.body.email;
        const address = req.body.address;
        const bank_id = getRandomInt(999999);
        const balance = getRandomInt(9999999999);
        console.log(bank_id, balance)
        var sql = "INSERT INTO buyer (buyer_name, buyer_password, buyer_email, buyer_address ,bank_idd) VALUES ('" + name + "','" + pass + "','" + email + "','" + address + "','" + bank_id + "')";
        db.query(sql, function (err, result) {
            if (err) console.log(err);

        });
        var sql = "INSERT INTO bank (bank_account_id, buyer_name, balance) VALUES ('" + bank_id + "','" + name + "','" + balance + "')";

        db.query(sql, function (err, result) {
            if (err) console.log(err);


        });
        res.redirect('/');
    })


    app.get('/add', auth, (req, res) => {
        
        res.render('add');

    });
    app.post('/add', auth, (req, res)=>{

        var name = req.body.name;
        var type = req.body.type;
        var origin = req.body.name;
        var price = req.body.price;
        var description = req.body.description;
        var quantity = req.body.quantity;
        
        var sql = "INSERT INTO seeds (seed_name, seed_type, seed_origin, seed_price , seed_quantity, seed_description) VALUES ('" + name + "','" + type + "','" + origin + "','" + price + "','" + quantity +  "','" + description +"')";
        db.query(sql, function (err, result) {
            if (err) console.log(err);

            res.redirect('/products');
        });
        
    })

    //get
    app.get('/login', (req, res) => {

        res.render('login');

    })


    //post
    app.post('/login', (req, res) => {


        //test
        var user = req.body.user;
        var password = req.body.password;

        db.query('SELECT * FROM users WHERE user_name = ?', [user], function (error, results, fields) {
            if (error) {
                // console.log("error ocurred",error);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {
                // console.log('The solution is: ', results);
                if (results.length > 0) {
                    if (results[0].user_pass == password) {


                        const username = results[0].user_name;
                        const id = results[0].user_id;

                        const payload = {
                            name: username,
                            id: id

                        }
                        const token = JWT.sign(payload, secret)
                        res.cookie('access_token', token, {
                            maxAge: 3600,
                            httpOnly: true
                        });


                        return res.redirect('/');
                    } else {
                        res.send({
                            "code": 204,
                            "success": "user and password does not match"
                        });
                    }
                } else {
                    res.send({
                        "code": 204,
                        "success": "user does not exits"
                    });
                }
            }
        });

    })


    app.get('/register', (req, res)=>{
        
        res.render('reg');
    })
    
    app.post('/register', (req, res)=>{
      
        const name = req.body.user;
        const pass = req.body.password;
        const role = 0;

      
        var sql = "INSERT INTO users (user_name, user_pass, user_role) VALUES ('" + name + "','" + pass + "','" + role + "')";
        db.query(sql, function (err, result) {
            if (err) console.log(err);
            
            res.redirect('/');
        })

        
    })



    app.get('/buy/:id', (req, res) => {
        const id = req.params.id;
        token = req.cookies.access_token;
        var decoded = JWT.verify(token, secret);
        
        bank_id = decoded.bank_id;

       
        db.query('SELECT * FROM seeds WHERE seed_id = ?', [id], function (error, results, fields) {
            const price = results[0].seed_price;
            db.query('SELECT * FROM bank WHERE bank_account_id = ?', [bank_id], function (error, result, fields) {



                const balance = result[0].balance;
                var total = balance - price ;
                console.log(total);
                var payload = {
                    total:total,
                    name: results[0].seed_name
                }
                //filling the cookie
                token1 = JWT.sign(payload, secret)
                res.cookie('carrier', token1);
             res.redirect(`/api/order/${id}`);
            })
        })

    })
    app.get('/api/order/:id', (req, res)=>{
        var id = req.params.id;

       
        token = req.cookies.access_token;
        var decoded = JWT.verify(token, secret);
        
        bank_id = decoded.bank_id;
        console.log(decoded.total);
        var sql = "INSERT INTO orders (buyer_id, seed_id) VALUES ('"  + id + "','" + bank_id + "')";
        
        db.query(sql, function (err, result) {
        
        })
        token1 = req.cookies.carrier;
        var unwrapped = JWT.verify(token1, secret);

        data = {
            total:unwrapped.total,
            id:id,
            name:unwrapped.name
        }
       
        console.log(data)
        res.render('order', {data});
    })

}
