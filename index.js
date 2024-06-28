const path = require('path');
const express = require('express');
require('dotenv').config();
const {dbConnection} = require('./database/config');
const cors = require('cors');

// console.log(process.env)

// Create express server
const app = express(process.env);

// Database
dbConnection();


// CORS
app.use(cors());

// Public directory
// Middleware es una funcion que se ejecuta en el momento que alguien realiza una peticion al servidor
app.use( express.static('public') );


// Reading and parsing body
app.use( express.json() );


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


// Listen requests, sets the port it works on
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
});