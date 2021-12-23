const oracledb = require('oracledb');
async function getConnection()
{
    let connection = null;
    try
    {
        connection = await oracledb.getConnection({
            'user' : 'hr',
            'password' : 'hr',
            'connectionString' : 'localhost:1521/xepdb1'
        });
    }
    catch(err)
    {
        console.log('Connection Error : ' + err);
    }
    return connection;
}

module.exports = {getConnection};