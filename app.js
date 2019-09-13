const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const users = require('./routes/users');

const app = express();

//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json({limit:'5mb', extended:true}));
app.use(bodyParser.urlencoded({limit:'5mb',extended:true}));

//Routes
app.use('/users',users);

//Start the Server
const port = process.env.PORT  || 3000;
app.listen(port,function(){
    console.log(`Server is listening at port ${port}`);
})