const {client} = require("./client");

async function createCats({name, breed, age, temperment, outdoor, adoptionFee, imageURL}) {
    try {
        const {rows} = await client.query(`
        INSERT INTO cats(name, breed, age, temperment, outdoor, "adoptionFee", "imageURL")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `,[name, breed, age, temperment, outdoor, adoptionFee, imageURL]);

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

module.exports = {
   createCats, getAllCats
}