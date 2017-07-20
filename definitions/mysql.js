var mysql = require('mysql');

var Sequelize = require('sequelize');

var mysql_host = CONFIG('mysql-host');
var mysql_user = CONFIG('mysql-user');
var mysql_password = CONFIG('mysql-password');
var mysql_database = CONFIG('mysql-database');


var Agent = require('sqlagent/mysql').connect({
    host: mysql_host,
    user: mysql_user,
    password: mysql_password,
    database: mysql_database,
    typeCast: function castField( field, useDefaultTypeCasting ) {
        if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
            var bytes = field.buffer();
            return( bytes[ 0 ] === 1 );
        }
        return( useDefaultTypeCasting() );
    }
});
var sql = new Agent();


var pool = mysql.createPool({
    host: mysql_host,
    user: mysql_user,
    password: mysql_password,
    database: mysql_database
});

//var sequelize_connetor  = new Sequelize(mysql_database, mysql_user, mysql_password, {
//    host: mysql_host,
//    dialect: 'mysql',
//
//    pool: {
//        max: 5,
//        min: 0,
//        idle: 10000
//    }
//});

// override the framework prototype
// use CONFIG files for connection string
//F.database = sequelize_connetor;
F.database = function(callback) {
    return pool.getConnection(callback);
};

