const express = require('express')
const userRouter = express.Router();
const jwt = require('jsonwebtoken')
require('dotenv').config(); 

const {
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
    // getAllPurchasesByUsers, // we don't have this function in the purchases db
} = require("../db/users.js")

userRouter.post("/register", async (req, res) => {
    try {
        const userExists = await getUserByUsername(username)

        if (userExists) {
            return res.status(409).json({
                message: "Username already exists, please try again "
            })
        }
        // if (password.length < 8) {
        //     return res.status(400).json({
        //       message: "Password must be at least 8 characters"
        //     });
        //   } else if (username.length < 8) {
        //     return res.status(400).json({
        //       message: "Username must be at least 8 characters"
        //     });
        // }

        console.log("creating user:" + username + " " + password)
        const user = await createUser ({ username, password});
        console.log("created user", user)

        const id = user.id

        console.log("creating token")
        const token = jwt.sign( {username, id} , process.env.JWT_SECRET);
        console.log("token created ", token )

        res.send({
            message: "Registration successful",
            token
        });
    } catch (error) {
        res.send(error).status(505)
    }
})

userRouter.post("/login", async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        res.send({
          message: "please provide both username and password or register for a new account"
        })
    }
    try {
        const user = await getUser ({username, password});
        console.log(user)

      if (user && user.password == password) {
        const {id} = user
        const token = jwt.sign({username, id}, process.env.JWT_SECRET);
        res.send({ 
            message: "you're logged in!", token 
        });
      }
    } catch (error) {
        res.send(error).status(500)
    }
})

userRouter.get("/me", async (req, res) => {
    const {username, id} = req.body
    console.log(username)
    console.log(id)

    try { 
        res.send({username, id})
    } catch (error) {
        res.send(error).status(505)
    }
})

userRouter.get("/:username/purchases", async (req, res) => {
    const {username} = req.params 
    console.log("params:" + " " + username)

    try {
        const user = await getUser({username})

        if (user) {

            const userPurchases = await getAllPurchasesByUsers (user)
                /* NOTES: getAllPurchasesByUsers does not exist in the purchases DB */ 

            res.send(userPurchases).status(202)
        } else {
            res.send("This user does not exist").status(401)
        }
    } catch (error) {
        res.send(error).status(505)
    }
})

module.exports = {userRouter}