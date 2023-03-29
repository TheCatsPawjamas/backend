require('dotenv').config();
const express = require('express');
const server = express();
const cors = require('cors');
const morgan = require('morgan');

const {client} = require('./db/client');

server.use(morgan('dev'));

server.use(express.json());
server.use(cors());

server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });

server.use('/api', (req, res, next) => {
    console.log("A request was made to /api");
    next();
});

server.get('/api/health', (req,res,next)=>{
    res.send("Server is up and running on port 1337 and all is well!");
})

const apiRouter = require('./api');
server.use('/api', apiRouter);



client.connect();
server.listen(1337, () => {
    console.log('The server is up on port 1337')
});