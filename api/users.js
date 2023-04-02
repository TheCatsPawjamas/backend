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
        const {username, password, email} = req.body
        const userExists = await getUserByUsername({username, email})

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
        const user = await createUser ({ username, password, email});
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
    
    const user = await getUserByUsername(username)
    try {
        console.log(user)

        
      if (user) {
            const samePasswords = await bcrypt.compare(password, user.password);
        if (samePasswords) {
        const {id} = user
        const token = jwt.sign({username, id}, process.env.JWT_SECRET);
        res.send({ 
            message: "you're logged in!", token 
        });
      }
    }
    } catch (error) {
        res.send(error).status(500)
    }
})

// userRouter.get("/me", async (req, res) => {
//     const {username, id} = req.body
//     console.log(username)
//     console.log(id)

//     try { 
//         res.send({username, id})
//     } catch (error) {
//         res.send(error).status(505)
//     }
// })

userRouter.get("/:username/purchases", async (req, res) => {
    const {username} = req.params 
    console.log("params:" + " " + username)

    try {
        const user = await getUser({username})

        if (user) {

            const userPurchases = await getAllPurchasesByUsers (user)
                /* NOTES: getAllPurchasesByUsers does not exist in the purchases DB yet */ 

            res.send(userPurchases).status(202)
        } else {
            res.send("This user does not exist").status(401)
        }
    } catch (error) {
        res.send(error).status(505)
    }
})

module.exports = userRouter
