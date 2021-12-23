class UnitOfMeasurement
{
    constructor(code, name) 
    {
        this.code = code;
        this.name = name;
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