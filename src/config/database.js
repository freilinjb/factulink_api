const mysql = require('mysql');

exports.connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1423',
    database : 'factulink',
    port: 3306,
    waitForConnections: true,
    queueLimit: 0
  });


//   conection.connect(function(err) {
//     if(err){
//         console.log(err);
//         return;
//     }
//     else {
//         console.log('Db is connected');
//     }
// });

//   module.exports = conection;