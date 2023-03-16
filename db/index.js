const mysql=require('mysql')
const db= mysql.createPool({
    host            : '127.0.0.1',
    user            : 'root',
    password        : 'awds2220279455',
    database        : 'manage'
});
module.exports=db