const entities = require('datalayer/entities.js');
const managers = require('datalayer/managers.js');
if(process.argv.length == 2) return console.log(`You need to pass operation and data`);
const testWhat = process.argv[2];

// remove   
if(testWhat == 'removeUsed')
{
    async function removeUsed(){        
        const uom_manager = new managers.UnitOfMeasurementManager();
        const uoms = await uom_manager.getAll();
        for(const uom of uoms){
            try{
                await uom_manager.remove(uom.code);
                console.log(uom.name, 'deleted')
            }catch(err){
                console.log(err);
                console.log(uom.name, 'not deleted')
            }
        }
    }
    removeUsed();

} // remove ends
