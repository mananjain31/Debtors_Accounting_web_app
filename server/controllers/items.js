const asyncWrapper = require('../middlewares/asyncWrapper.js');
const {ItemManager} = require('datalayer/managers');

const getAll = asyncWrapper( async(req, res, next)=>{
    const itemManager = new ItemManager();
    const items = await itemManager.getAll();
    res.status(200).json(items);
})

module.exports = {getAll};