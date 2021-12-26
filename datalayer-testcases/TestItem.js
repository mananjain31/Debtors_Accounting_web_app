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