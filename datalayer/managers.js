const connector = require('./connector');
const entities = require('./entities');

class UnitOfMeasurementManager
{
    constructor(){}
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

    
    async getAll()
    {
        // Connection 
        const connection = await connector.getConnection();
        // validation : connection check
        if(!connection) throw `Unable to connect to the server`;
        
        // getting all records
        let rs = await connection.execute(`select * from ac_uom`);
        rs = rs ? rs.rows : []

        // closing the connection
        await connection.close();
        
        // preparing all data to return
        const unitOfMeasurements = rs.map(row => new entities.UnitOfMeasurement(parseInt(row[0]), row[1].trim()));
        
        return unitOfMeasurements;
    } // getAll method ends

    async getByCode(code)
    {
        // validation : code exists or not
        if(!code) throw `Code Required`;
        // validation : code is positive
        if(code <= 0) throw `Invalid Code : must be > 0`;
        
        // Connection 
        const connection = await connector.getConnection();
        // validation : connection check
        if(!connection) throw `Unable to connect to the server`;
        
        // getting row
        let rs = await connection.execute(`select * from ac_uom where code = ${code}`);
        // validation : code exists or not
        if(rs.rows.length == 0) 
        {
            await connection.close();
            throw `Invalid Code : ${code}`;
        }
        const unitOfMeasurement = new entities.UnitOfMeasurement(parseInt(rs.rows[0][0]), rs.rows[0][1].trim());

        // closing the connection
        await connection.close();

        return unitOfMeasurement;
    } // getByCode method ends
 
    async getByName(name)
    {
        // validation : name exists or not
        if(!name) throw `Name Required`;
        // validation : name does not exceeds 5 char
        if(name.length > 5) throw `Name cannot exceed 5 characters`;
        
        // Connection 
        const connection = await connector.getConnection();
        // validation : connection check
        if(!connection) throw `Unable to connect to the server`;
        
        
        let rs = await connection.execute(`select * from ac_uom where lower(name) = lower('${name}')`);
        // validation : name does not already exists
        if(rs.rows.length == 0) 
        {
            await connection.close();
            throw `Invalid Name : ${name}`;
        }
        const unitOfMeasurement = new entities.UnitOfMeasurement(parseInt(rs.rows[0][0]), rs.rows[0][1].trim());
        // closing the connection
        await connection.close();

        return unitOfMeasurement;
    } // getByName method ends
}

class ItemManager
{
    constructor(){}
    async add(item)
    {
        // length and value checks
        if(!item.name || item.name.length == 0) throw "Item Name required";
        if(item.name.length > 25) throw "Name cannot exceed 25 characters";
        if(!item.cgst) item.cgst = 0;
        if(!item.sgst) item.sgst = 0;
        if(!item.igst) item.igst = 0;
        if(item.cgst<0) throw "Cgst cannot be nagative";
        if(item.sgst<0) throw "Sgst cannot be nagative";
        if(item.igst<0) throw "Igst cannot be nagative";

        // Connection 
        const connection = await connector.getConnection();
        // validation : connection check
        if(!connection) throw `Unable to connect to the server`;
        // Result Set : rs
        let rs;

        // checking if name alredy exists
        rs = await connection.execute(`select code from ac_item where lower(name) = lower('${item.name}')`);
        if(rs.rows.length > 0)
        {
            await connection.close();
            throw `${item.name} exists`;
        }

        // checking and inserting UOM in ac_uom if not exists
        for(const unitOfMeasurement of item.unitOfMeasurements)
        {
            // length and value checks
            if(!unitOfMeasurement.code || unitOfMeasurement.code < 0) unitOfMeasurement.code = 0;
            if(!unitOfMeasurement.name || unitOfMeasurement.name.length == 0) 
            {
                await connection.close();
                throw `Unit Of Measurement name required`;
            }
            if(unitOfMeasurement.name.length > 5) 
            {
                await connection.close();
                throw `Unit Of Measurement name cannot exceed 5 characters`;
            }

            // checking if uom exists with that name if yes then assign its code to this object
            rs = await connection.execute(`select code from ac_uom where lower(name) = lower('${unitOfMeasurement.name}')`);
            if(rs.rows.length > 0) unitOfMeasurement.code = parseInt(rs.rows[0][0]);
            else 
            {
                // adding uom
                await connection.execute(`insert into ac_uom (name) values('${unitOfMeasurement.name}')`);

                // getting code from the inserted record and setting it to our object
                rs = await connection.execute(`select * from ac_uom where lower(name) = lower('${unitOfMeasurement.name}')`);
                unitOfMeasurement.code = parseInt(rs.rows[0][0]);
            }
        } // for loop ends

        // adding item
        await connection.execute(`insert into ac_item (name) values('${item.name}')`);

        // getting code from the inserted record and setting it to our object
        rs = await connection.execute(`select * from ac_item where lower(name) = lower('${item.name}')`);
        item.code = parseInt(rs.rows[0][0]);

        // adding item code to ac_item_tax
        await connection.execute(`insert into ac_item_tax values(${item.code}, ${item.cgst}, ${item.sgst}, ${item.igst})`);

        // adding item code and uom codes to ac_item_uom table
        for(const unitOfMeasurement of item.unitOfMeasurements)
        {
            await connection.execute(`insert into ac_item_uom values(${item.code}, ${unitOfMeasurement.code})`);
        }

        await connection.commit();
        await connection.close();
    }

    async remove(code)
    {
        // existence and value checks
        if(!code) throw 'Code Required';
        if(code < 0) throw 'Invalid Code, Must be a positive integer';
        // Connection 
        const connection = await connector.getConnection();
        // validation : connection check
        if(!connection) throw `Unable to connect to the server`;
        // Result Set : rs
        let rs;
        // checking if code exists
        rs = await connection.execute(`select code from ac_item where code = ${code}`);
        if(rs.rows.length == 0)
        {
            await connection.close();
            throw `Invalid Code : ${code}`;
        }

        // deleting from ac_item_tax
        await connection.execute(`delete from ac_item_tax where item_code = ${code}`);

        // deleting from  ac_item_uom
        await connection.execute(`delete from ac_item_uom where item_code = ${code}`);

        // deleting from ac_item
        await connection.execute(`delete from ac_item where code = ${code}`);

        await connection.commit();
        await connection.close();
    }
    
    async getAll()
    {
        // Connection 
        const connection = await connector.getConnection();
        // validation : connection check
        if(!connection) throw `Unable to connect to the server`;
        // Result Set : rs
        const items = [];
        const rs1 = await connection.execute('select * from ac_item');
        const uom_manager = new UnitOfMeasurementManager();
        for(const row of rs1.rows)
        {
            const code = row[0];
            const name = row[1].trim();
            const rs2 = await connection.execute(`select * from ac_item_tax where item_code = ${code}`);
            const cgst = rs2.rows[0][1];
            const sgst = rs2.rows[0][2];
            const igst = rs2.rows[0][3];
            const rs3 = await connection.execute(`select * from ac_item_uom where item_code = ${code}`);
            const unitOfMeasurements = [];
            for(const uom_row of rs3.rows)
            {
                unitOfMeasurements.push(
                    await uom_manager.getByCode(uom_row[1])
                    );
            }
            items.push(
                new entities.Item(code, name, cgst, sgst, igst, unitOfMeasurements)
            );
        }       
        
        await connection.close();
        return items;
    }
}

module.exports = {
    UnitOfMeasurementManager, ItemManager
}