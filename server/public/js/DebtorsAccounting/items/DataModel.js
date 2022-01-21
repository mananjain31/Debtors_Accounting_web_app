class DataModel{
    constructor(items = [], unitOfMeasurements = [], itemsTable)
    {
        this.items = items;
        this.unitOfMeasurements = unitOfMeasurements;
        this.itemsTable = itemsTable;
    }
    getItemByCode = (code) => {
        return this.items.find(item => item.code === code);
    }
    setSelectedItem = (item) => {
        this.selectedItem = item;
    }
}

export default DataModel;