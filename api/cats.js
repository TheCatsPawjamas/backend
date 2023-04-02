const express = require('express');
const { requireUser } = require('./utils');
const { createCats, updateCat } = require("../db/index"); 
const { getAllCats } = require("../db/index");
const { deleteCatById } = require("../db/index");
const { getCatById } = require("../db/index");
const { updateCat } = require("../db/index");

const cats = express.Router();
  

// GET /api/cats
cats.get('/', async (req, res) => {
    try {
        console.log("Starting to fetch cats")
        const allCats = await getAllCats();
        console.log("Finished fetching cats")
        res.send(allCats)
    } catch (error) {
        console.log(error)
    }
})

// GET /api/cats/:catId
cats.get('/:catId', async (req, res) => {
  try {
    const id = req.params.catId;
    const cat = await getCatById(id);
    if (!cat) {
      res.status(404).json({ message: `Cat with id ${id} not found` });
    } else {
      res.json(cat);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// POST /api/cats
cats.post('/cats', async (req, res) => {
    try {
      const { name, breed, age, temperament, outdoor, adoptionFee, imageURL } = req.body;
      const newCat = await createCats({ name, breed, age, temperament, outdoor, adoptionFee, imageURL });
      res.send(newCat);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// PATCH /api/cats/:catId
cats.patch('/:catId', requireUser,async (req, res, next) => {
    const id = req.params.catId;
    const { name, breed, age, temperament, outdoor, adoptionFee, imageURL  } = req.body;
    console.log(id);
    const user = req.user;
    if(user){
        const updateFields = {};

        if (name) {
            updateFields.name = name;
        }
        if (breed) {
            updateFields.breed = breed;
        }
        if (age) {
          updateFields.age = age;
        }
        if (temperament) {
          updateFields.temperament = temperament;
        }
        if (outdoor) {
          updateFields.outdoor = outdoor;
        }
        if (adoptionFee) {
          updateFields.adoptionFee = adoptionFee;
        }
        if (imageURL) {
          updateFields.imageURL = imageURL;
        }
        try {
            console.log(updateFields);
            const updatedCat = await updateCat({id, fields: updateFields});
            console.log("done");
            res.send(updatedCat);
        } catch ({ name, message }) {
            next({ name, message });
        }
    }else{
        res.send({
            success : false,
            error : {
                name: 'WrongUser',
                message : 'You need to be logged in to update this activity'
            },
            data : null
        })
    }

});


// DELETE /api/cats/:catId
cats.delete('/cats/:catId', requireUser, async (req, res) => {
    try {
      const id = req.params.catId;
      const deletedCat = await deleteCatById(id);
      if (deletedCat === 0) {
        res.status(404).json({ message: `Cat with id ${id} not found` });
      } else {
        res.json({ message: `Cat with id ${id} deleted successfully` });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  
module.exports = cats;