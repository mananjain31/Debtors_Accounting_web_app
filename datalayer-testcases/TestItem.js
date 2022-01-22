const entities = require('datalayer/entities.js');
const managers = require('datalayer/managers.js');
if(process.argv.length == 2) return console.log(`You need to pass operation and data`);
const testWhat = process.argv[2];

// add 
if(testWhat == 'add')
{
    const code = 0;
    const name = "Screw Driver";
    const cgst = 18;
    const sgst = 18;
    const igst = 24;
    const unitOfMeasurements = [];
    unitOfMeasurements.push(new entities.UnitOfMeasurement(16, "KG"));
    unitOfMeasurements.push(new entities.UnitOfMeasurement(17, "pcs"));
    unitOfMeasurements.push(new entities.UnitOfMeasurement(19, "pkt"));
    const item = new entities.Item(code, name, cgst, sgst, igst, unitOfMeasurements);
    const item_manager = new managers.ItemManager();
    item_manager
    .add(item)
    .then(()=> console.log("Succesfully added : ", item))
    .catch(err=>console.log(err))
} // add ends

// remove   
if(testWhat == 'remove')
{
    // check if data given
    if(process.argv.length < 4) return console.log(`code missing`);
    const code =  process.argv[3];
    const item_manager = new managers.ItemManager();
    item_manager
    .remove(code)
    .then(()=> console.log("Succesfully deleted : ", code))
    .catch(err=>console.log(err))
} // remove ends

// update   
if(testWhat == 'update')
{
    const code = 2;
    const name = "Screw";
    const cgst = 18;
    const sgst = 18;
    const igst = 24;
    const unitOfMeasurements = [];
    unitOfMeasurements.push(new entities.UnitOfMeasurement(16, "KG"));
    unitOfMeasurements.push(new entities.UnitOfMeasurement(17, "pcs"));
    const item = new entities.Item(code, name, cgst, sgst, igst, unitOfMeasurements);
    const item_manager = new managers.ItemManager();
    item_manager
    .update(item)
    .then(()=> console.log("Succesfully updated : ", item))
    .catch(err=>console.log(err))
} // update ends


// getAll   
if(testWhat == 'getAll')
{
    const item_manager = new managers.ItemManager();
    item_manager
    .getAll()
    .then((items)=> {
        for(const item of items){
            for(const k in item)
            {
                console.log(k,":",item[k]);
            }
            console.log();
        }
    })
    .catch(err=>console.log(err))
} // getAll ends

// getByCode   
if(testWhat == 'getByCode')
{
    // check if data given
    if(process.argv.length < 4) return console.log(`code missing`);
    const code =  process.argv[3];
    const item_manager = new managers.ItemManager();
    item_manager
    .getByCode(code)
    .then((item)=> {
            for(const k in item)
            {
                console.log(k,":",item[k]);
            }
    })
    .catch(err=>console.log(err))
} // getByCode ends

