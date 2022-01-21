const express = require('express');
const path = require('path');
const itemsRouter = require('./routes/items.js');
const unitOfMeasurementsRouter = require('./routes/unitOfMeasurements.js');
const errorHandler = require('./middlewares/errorHandler.js');

const app = express();
const port = 3000;

app.use(express.static('public'))
app.use(express.json())

app.get('/', (req, res)=>res.redirect('index.html'))

app.use('/items', itemsRouter)
app.use('/unitOfMeasurements', unitOfMeasurementsRouter)

app.use((req, res)=>{
    res.redirect('404.html');
});

app.use(errorHandler);


app.listen(port, (err)=>err ? console.log(err) : console.log('listening at port '+port))