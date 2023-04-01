const {client} = require("./client");

async function createCats({name, breed, age, temperament, outdoor, adoptionFee, imageURL}) {
    try {
        console.log("This is the image URL: " + imageURL);
        const {rows} = await client.query(`
        INSERT INTO cats(name, breed, age, temperament, outdoor, "adoptionFee", "imageURL")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
        `,[name, breed, age, temperament, outdoor, adoptionFee, imageURL]);

        return rows;
    } catch (error) {
        console.log(error);
    }
}


async function getAllCats() {
    try {
        const {rows} = await client.query(`
        SELECT * FROM cats;
        `)

        return rows;
    } catch (error) {
        console.log(error)
    }
}

async function getCatById(id){
    try {
        const {rows: [cat] } =  await client.query(`
        SELECT * FROM cats
        WHERE id = $1;
        `,[id])

        return cat;
    } catch (error) {
        console.log(error);
    }
}

async function updateCat({name, breed, age, temperament, outdoor, adoptionFee, imageURL}){
    try {
        const {rows} = await client.query(`
        UPDATE cats
        SET "name" = $1, "breed" = $2, "age" = $3, "temperament" = $4, "outdoor" = $5, "adoptionFee" = $6, "imageURL" = $7
        RETURNING *;
        `,[name, breed, age, temperament, outdoor, adoptionFee, imageURL])
        
        return rows;
    } catch (error) {
        console.log(error)
    }
}

// async function updateActivity({ id, fields= {} }) {
//     // don't try to update the id
//     // do update the name and description
//     // return the updated activity
  
//       const setString = Object.keys(fields).map(
//           (key, index) => `"${ key }"=$${ index + 1 }`
//       ).join(', ');
  
//       if(setString.length ===0){
//           return
//       }
  
//       try {
//           const { rows: [ activity ] } = await client.query(`
//           UPDATE activities
//           SET ${ setString }
//           WHERE id=${ id }
//           RETURNING *;
//         `, Object.values(fields));
    
//         return activity;
  
//       } catch (error) {
//           console.log(error);
//       }
//   }

//   activitiesRouter.patch('/:activityId', requireUser,async (req, res, next) => {
//     const id = req.params.activityId;
//     const { name, description  } = req.body;
//     console.log(id);
//     const user = req.user;
//     if(user){
//         const updateFields = {};

//         if (name) {
//             updateFields.name = name;
//         }
//         if (description) {
//             updateFields.description = description;
//         }
//         try {
//             console.log(updateFields);
//             const updatedActivity = await updateActivity({id, fields: updateFields});
//             console.log("done");
//             res.send(updatedActivity);
//         } catch ({ name, message }) {
//             next({ name, message });
//         }
//     }else{
//         res.send({
//             success : false,
//             error : {
//                 name: 'WrongUser',
//                 message : 'You need to be logged in to update this activity'
//             },
//             data : null
//         })
//     }


// });

async function deleteCatById(id) {
    try {
      const deletedCat = await db.query(`DELETE FROM cats WHERE id=$1 RETURNING *`, [id]);
      return deletedCat.rowCount;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

module.exports = {
   createCats, getAllCats, getCatById, updateCat, deleteCatById
}