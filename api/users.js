const express = require('express')
const userRouter = express.Router();
const jwt = require('jsonwebtoken')
require('dotenv').config(); 
const bcrypt = require('bcrypt');

const {
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
    updateUserById,
    getAllUsers,
    deleteUserByUsername,
    // getAllPurchasesByUsers, // we don't have this function in the purchases db
} = require("../db/users.js")

const {requireUser, requireAdmin} = require('./utils')

const {
    createNewUserOrder
} = require('../db/orders');


userRouter.post("/register", async (req, res, next) => {
    try {
        const {username, password, email} = req.body
        const userExists = await getUserByUsername(username)
        let admin = false;
        if(req.body.admin){
            if(req.body.admin == "true"){
                admin = true;
            }else{
                admin = false;
            }
        }
        if (userExists) {
            res.send({
                message: "Username already exists, please try again "
            })
        }else{
        
            const user = await createUser ({ username, password, email, admin});
            const ourUser = await getUser({username, password, email});

            const id = user.id;

            const token = jwt.sign( {username, id} , process.env.JWT_SECRET);

            //create an order for that user
            const status='pending';
            const userId = ourUser.id;
            const order = await createNewUserOrder({userId, status});
            res.send({
                message: "Registration successful",
                token
            });
        }

    } catch (error) {
        res.send(error).status(505)
    }
})

userRouter.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = await getUserByUsername(username)
    try {
        if (user) {
            const samePasswords = await bcrypt.compare(password, user.password);
            if (samePasswords) {
                const {id} = user
                const token = jwt.sign({username, id}, process.env.JWT_SECRET);
                res.send({ 
                    message: "you're logged in!", token 
                });
            }
        }else{
            res.send({
                message: "you must have valid credentials to log in"
            }).status(403);
        }
    } catch (error) {
        res.send(error).status(500)
    }
})

userRouter.get("/me", requireUser, async (req, res) => {
    const {username, id, admin} = req.user
    try { 
        
        res.send({username, id, admin})
    } catch (error) {
        res.send(error).status(505)
    }
})

userRouter.get("/:username/purchases", async (req, res) => {
    const {username} = req.params 

    try {
        const user = await getUser({username})

        if (user) {

            const userPurchases = await getAllPurchasesByUsers (user)

            res.send(userPurchases).status(202)
        } else {
            res.send("This user does not exist").status(401)
        }
    } catch (error) {
        res.send(error).status(505)
    }
})
userRouter.patch("/:id", async (req, res) => {
    const {id} = req.params 
    const {username,password,email} = req.body;
    const user = await getUserById(id)
    if(user){
        const updateFields = {};
        let hashedPassword='';
        let hashedEmail = '';
        if (username) {
            updateFields.username = username;
        }
        if (password) {
            const saltCount=12;
            hashedPassword = await bcrypt.hash(password,saltCount);
            updateFields.password = hashedPassword;
        }
        if (email) {
            const saltCount = 12;
            hashedEmail= await bcrypt.hash(email,saltCount);
          updateFields.email = hashedEmail;
        }
    
        try {
            const updatedUser = await updateUserById({id, fields: updateFields});
            res.send(updatedUser).status(200);
        } catch (error) {
            res.send(error).status(505)
        }
    }else{
        res.send({
            success : false,
            error : {
                name: 'InvalidUser',
                message : 'You need to enter a valid username, password or email'
            },
            data : null
        })
    }
})


//all of the bellow routers are for admin users

//get all users
userRouter.get('/admin', requireAdmin, async(req,res,next)=>{
    try {
        const allUsers = await getAllUsers();

        res.send(allUsers);

    } catch (error) {
        console.log(error);
        throw error;
    }

})

//delete a user
userRouter.delete('/admin/:id', requireAdmin, async(req,res)=>{
    const id = req.params.id
    try {
        const userToBeDeleted = await getUserById(id);
        if(userToBeDeleted){
            const deleted = await deleteUserByUsername(userToBeDeleted.username);
            res.send(userToBeDeleted);

        }else{
            res.send({
                success : false,
                error : {
                    name: 'InvalidUser',
                    message : 'You need to enter a valid username, password or email'
                },
                data : null
            })
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
})

//update a user
userRouter.patch("/admin/:id",requireAdmin, async (req, res) => {
    const {id} = req.params 
    const {username,password,email, admin} = req.body;
    const user = await getUserById(id)
    if(user){
        const updateFields = {};
        let hashedPassword='';
        let hashedEmail = '';
        if (username) {
            updateFields.username = username;
        }
        if (password) {
            const saltCount=12;
            hashedPassword = await bcrypt.hash(password,saltCount);
            updateFields.password = hashedPassword;
        }
        if (email) {
            const saltCount = 12;
            hashedEmail= await bcrypt.hash(email,saltCount);
          updateFields.email = hashedEmail;
        }
        if(admin){
            updateFields.admin=admin;
        }
        try {
            const updatedUser = await updateUserById({id, fields: updateFields});
            res.send(updatedUser).status(200);
        } catch (error) {
            res.send(error).status(505)
        }
    }else{
        res.send({
            success : false,
            error : {
                name: 'InvalidUSer',
                message : 'You need to enter a valid username, password or email'
            },
            data : null
        })
    }
})


module.exports = userRouter
