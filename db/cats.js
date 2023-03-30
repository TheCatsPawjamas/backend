const {client} = require("./client");

async function createCats({name, breed, age, temperment, outdoor, adoption, imageURL}) {
    try {
        const {rows} = await client.query(`
        INSERT INTO activities(name, breed, age, temperment, outdoor, adoption, "imageURL")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `,[name, breed, age, temperment, outdoor, adoption, imageURL]);

        return rows;
    } catch (error) {
        console.log(error);
    }
}

async function getCats() {
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
   createCats, getCats
}