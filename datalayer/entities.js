class UnitOfMeasurement
{
    constructor(code, name) 
    {
        this.code = code ? parseInt(code) : code;
        this.name = name?.trim();
    }
    getCode() {return this.code;}
    getName() {return this.name;}
}

class Item
{
    constructor(code, name, cgst, sgst, igst, unitOfMeasurements)
    {
        this.code = parseInt(code);
        this.name = name?.trim();
        this.cgst = parseFloat(cgst);
        this.sgst = parseFloat(sgst);
        this.igst = parseFloat(igst);
        this.unitOfMeasurements = unitOfMeasurements;
    }
    getCode() {return this.code;}
    getName() {return this.name;}
    getCgst() {return this.cgst;}
    getSgst() {return this.sgst;}
    getIgst() {return this.igst;}
}

module.exports = {UnitOfMeasurement, Item};