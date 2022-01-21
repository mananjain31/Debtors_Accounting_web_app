const asyncWrapper = require('../middlewares/asyncWrapper.js');
const {ItemManager} = require('datalayer/managers');
const {Item} = require('datalayer/entities');

const getAll = asyncWrapper( async(req, res, next)=>{
    const itemManager = new ItemManager();
    const items = await itemManager.getAll();
    res.status(200).json(items);
})

const update = asyncWrapper( async(req, res, next)=>{
    const item = Item.from(req.body.item);
    const itemManager = new ItemManager();
    const updatedItem = await itemManager.update(item);
    res.status(200).json(updatedItem);
})

module.exports = {getAll, update};