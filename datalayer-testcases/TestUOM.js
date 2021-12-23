const entities = require('datalayer/entities.js');
const managers = require('datalayer/managers.js');
if(process.argv.length == 2) return console.log(`You need to pass operation and data`);
const testWhat = process.argv[2];

// add 
if(testWhat == 'add')
{
    // check if data given
    if(process.argv.length < 4) return console.log(`Data to add is missing`);
    const name =  process.argv[3];
    const unitOfMeasurement = new entities.UnitOfMeasurement(0, name);
    const uom_manager = new managers.UnitOfMeasurementManager();
    uom_manager
    .add(unitOfMeasurement)
    .then(()=> console.log("Succesfully added : ", unitOfMeasurement))
    .catch(err=>console.log(err))
} // add ends


// remove   
if(testWhat == 'remove')
{
    // check if data given
    if(process.argv.length < 4) return console.log(`code missing`);
    const code =  process.argv[3];
    const uom_manager = new managers.UnitOfMeasurementManager();
    uom_manager
    .remove(code)
    .then(()=> console.log("Succesfully deleted : ", code))
    .catch(err=>console.log(err))
} // remove ends