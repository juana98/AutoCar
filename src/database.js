const mysql =  require('mysql');
const {database} = require('./keys');
const {promisify} = require('util');
const pool = mysql.createPool(database);

pool.getConnection((err,connection)=>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNCETION WAS CLOSED')
        }
        if(err.code === 'ER_CON COUNT_ERROR'){
            console.error('DATABASE HAS MANY CONNECTIONSS')
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNCETION WAS REFUSED')
        }
    }
    if(connection)connection.release();
    console.log('DB is connected');
    return;
    
});

pool.query = promisify(pool.query);

module.exports = pool;
