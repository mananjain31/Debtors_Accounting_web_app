class UnitOfMeasurement
{
    constructor(code, name) 
    {
        this.code = code ? parseInt(code) : code;
        this.name = name?.trim();
    }
    getCode() 
    {
        return this.code;
    }
    getName() 
    {
        return this.name;
    }
}

module.exports = {UnitOfMeasurement};