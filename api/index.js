const express = require('express');
const apiRouter = express.Router();

const jwt = require('jsonwebtoken');
const {getUserById, getUserByUsername} = require('../db');
const {JWT_SECRET} = process.env;

apiRouter.use(async(req,res,next)=>{
    // console.log("This is the top of the routeHandler");
    const prefix='Bearer ';
    let auth ="";
    if(req.header("Authorization")){
        auth = req.header("Authorization")
    } 
    if(req.header("authorization")){
        auth = req.header('authorization');
    }
    if(req.user){
        next();
    }
    else{
    if(!auth){
        next();
    }else if(auth.startsWith(prefix)){
        const token = auth.slice(prefix.length);
        try {
            const jwtId = jwt.verify(token, JWT_SECRET);
            const {username} = jwtId;
            if(username){
                req.user = await getUserByUsername(username);
                next();
            }
        } catch ({name, message}) {
            next({name, message});
        }
    }else{
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${prefix}`
        });
    }
}
});
apiRouter.use((req,res,next) =>{
    if(req.user){
        console.log("User is set: ");
    }
    next();
});


const userRouter = require('./users');
const cats = require('./cats');
const ordersRouter = require('./orders');
const purchasesRouter = require('./purchases');

apiRouter.use('/users', userRouter);
apiRouter.use('/cats', cats);
apiRouter.use('/orders', ordersRouter);
apiRouter.use('/purchases', purchasesRouter);

apiRouter.use((error,req,res,next)=>{
    res.send({
        name: error.name,
        message: error.message
    });
});

module.exports = apiRouter; 