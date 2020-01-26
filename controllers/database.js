const mysql = require('mysql');

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

//adding the user to the database
function registerUser(user, password) {
    var sql = "INSERT INTO `users` (`user_name`, `user_pass`) VALUES ('" + user + "','" + password + "')";
    db.query(sql);
}

var hext = function validateUser(username, password) {

    var sql = 'SELECT * FROM users WHERE user_name = ? OR user_pass = ?';
      var res = db.query(sql, [username, password], function (err, result) {
        if (err) console.log(err);
        setAuthenticity(1);
        
        module.exports = result;

        return result[0];
        
    });
    return res
    
}
    const setAuthenticity = function (state){
        if(state === 1) return true;
    
        return false;
    }



var har = getitems();

module.exports = {
    getitems: getitems,
    registerUser: registerUser,
    val: hext,
    auth: setAuthenticity
};
