const asyncWrapper = require('../middlewares/asyncWrapper.js');
const {UnitOfMeasurementManager} = require('datalayer/managers');

const getAll = asyncWrapper( async(req, res, next)=>{
    const unitOfMeasurementManager = new UnitOfMeasurementManager();
    const unitOfMeasurements = await unitOfMeasurementManager.getAll();
    res.status(200).json(unitOfMeasurements);
})

module.exports = {getAll};