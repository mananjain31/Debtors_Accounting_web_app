const connector = require('./connector');
const entities = require('./entities');

class UnitOfMeasurementManager
{
    constructor()
    {
    }
    async add(unitOfMeasurement)
    {
        // validation : name exists or not
        if(!unitOfMeasurement.name) throw `Name Required`;
        // validation : name does not exceeds 5 char
        if(unitOfMeasurement.name.length > 5) throw `Name cannot exceed 5 characters`;
        
        // Connection 
        const connection = await connector.getConnection();
        // validation : connection check
        if(!connection) throw `Unable to connect to the server`;
        
        
        // validation : name does not already exists
        let rs = await connection.execute(`select * from ac_uom where lower(name) = lower('${unitOfMeasurement.name}')`);
        if(rs.rows.length > 0) 
        {
            await connection.close();
            throw `${unitOfMeasurement.name} already Exists`;
        }

        // adding uom
        await connection.execute(`insert into ac_uom (name) values('${unitOfMeasurement.name}')`);

        // getting code from the inserted record and setting it to the recieved object
        rs = await connection.execute(`select * from ac_uom where lower(name) = lower('${unitOfMeasurement.name}')`);
        unitOfMeasurement.code = rs.rows[0][0];

        // committing and  closing the connection
        await connection.commit();
        await connection.close();
    } // add method ends

    async remove(code)
    {
        // validation : code exists or not
        if(!code) throw `Code Required`;
        // validation : code is positive
        if(code <= 0) throw `Invalid Code : must be > 0`;
        
        // Connection 
        const connection = await connector.getConnection();
        // validation : connection check
        if(!connection) throw `Unable to connect to the server`;
        
        
        // validation : code exists or not
        let rs = await connection.execute(`select code from ac_uom where code = ${code}`);
        if(rs.rows.length == 0) 
        {
            await connection.close();
            throw `Invalid Code : ${code}`;
        }

        // checking if uom with this code is allotted to an item or not
        rs = await connection.execute(`select uom_code from ac_item_uom where uom_code = ${code}`);
        if(rs.rows.length > 0) 
        {
            await connection.close();
            throw `Unit Of Measurement with code : ${code} is allotted to an item.`;
        }

        // deleting row
        await connection.execute(`delete from ac_uom where code = ${code}`);

        // committing and  closing the connection
        await connection.commit();
        await connection.close();
    } // remove method ends

    
    async update(unitOfMeasurement)
    {
        // validation : name exists or not
        if(!unitOfMeasurement.name) throw `Name Required`;
        // validation : name does not exceeds 5 char
        if(unitOfMeasurement.name.length > 5) throw `Name cannot exceed 5 characters`;
        // validation : code exists or not
        if(!unitOfMeasurement.code) throw `Code Required`;
        // validation : code is positive
        if(unitOfMeasurement.code <= 0) throw `Invalid Code : must be > 0`;
        
        // Connection 
        const connection = await connector.getConnection();
        // validation : connection check
        if(!connection) throw `Unable to connect to the server`;
        
        // validation : code exists or not
        let rs = await connection.execute(`select code from ac_uom where code = ${unitOfMeasurement.code}`);
        if(rs.rows.length == 0)
        {
            await connection.close();
            throw `Invalid Code : ${unitOfMeasurement.code}`;
        }

        // checking weather other record with same uom name exists
        rs = await connection.execute(`select code from ac_uom where name = '${unitOfMeasurement.name}' and code <> ${unitOfMeasurement.code}`);
        if(rs.rows.length > 0) 
        {
            await connection.close();
            throw `${unitOfMeasurement.name} Exists`;
        }

        // updating row
        await connection.execute(`update ac_uom set name = '${unitOfMeasurement.name}' where code = ${unitOfMeasurement.code}`);

        // committing and  closing the connection
        await connection.commit();
        await connection.close();
    } // update method ends
}

module.exports = {
    UnitOfMeasurementManager
}