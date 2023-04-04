const express = require("express")

const {
    addCatsToOrder, 
    getPurchasesById,
    updatePurchases, 
    deletePurchases
} = require("../db/purchases");
const { getUserById } = require("../db/users");

const purchasesRouter = express.Router();

purchasesRouter.get("/:id", async (req, res) => {
    const id = req.body.id 
    const purchases = await getPurchasesById(id)

    if (!purchases) {
        res.status(404).json({
            message: `Purchase with that id ${id} not found`
        })
    } else {
        res.json(purchases)
    }
})

purchasesRouter.patch("/:id", async (req, res) => {
    const {id} = req.params.id 
    const { catId, adoptionFee} = req.body

    const user = await getUserById(id)
    if (user) {
        let updateFields = {};
        if (catId) {
            updateFields.catId = catId
        }
        if (adoptionFee) {
            updateFields.adoptionFee = adoptionFee
        }
        try {
            const updatedPurchase = await updatePurchases({id, fields: updateFields});
            console.log("starting to update purchase")
            res.send(updatedPurchase).status(200)
        } catch (error) {
            res.send(error).status(500)
        }
    } else {
        res.send({
            success: false, 
            error: {
                name: "Invalid User",
                message: "Cannot update purchase at this time"
            },
        })
    }
})

purchasesRouter.delete("/:id", async (req, res) => {
    const id = req.params 

    try {
        const destroyPurchase = await deletePurchases(id)
        res.send({
            success: true,
            destroyPurchase
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

module.exports = purchasesRouter