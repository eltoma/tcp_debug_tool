var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'zjb622622',
    database: 'tcp_debug'
});

function insertUploadDate(frame) {
    connection.connect();

    var sql = 'INSERT uploaddata ' +
        "(sim_id,order,ymd,hms,temperature,hum,Ua,Ub,Uc,ia,ib,ic,pa,pb,pc,act_pow,react_pow,pfactor,freq,irate,out)'" +
        + frame.id + ",'" + frame.order + "','" + frame.ymd + "','" + frame.hms + "','" + frame.hms + "',"
        + frame.temperature + "," + frame.hum + "," + frame.ua+ "," + frame.ub+ "," + frame.uc+ "," + frame.ia+ ","
        + frame.ib + "," + frame.ic + "," + frame.pa +"," + frame.pb +"," + frame.pc +"," + frame.pc +"," + frame.pc +","
        + frame.pc +"," + frame.pc +"," + frame.pc +;

    )
    VALUES
    (
        110,
        ymd,
        hms,
    )'
    connection.query('SELECT * from uploaddata', function(err, rows, fields) {
        if (err) throw err;

        console.log(rows);
    });


    connection.end();
}

insertUploadDate()

// exports.insertUploadDate = insertUploadDate;
