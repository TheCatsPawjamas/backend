const {client} = require("./client");

async function dropTables(){
    try {
        console.log("Dropping all tables...");
        await client.query(`
            DROP TABLE IF EXISTS purchases;
            DROP TABLE IF EXISTS cats;
            DROP TABLE IF EXISTS orders;
            DROP TABLE IF EXISTS users;
            
        `);
    console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables");
        throw error;
    }
    
}


async function createTables(){
    try {
        console.log("Starting to build tables...")
        await client.query(`
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                admin BOOLEAN DEFAULT false
            
            );
            CREATE TABLE orders(
                id SERIAL PRIMARY KEY,
                "userId" INT REFERENCES users(id),
                "creditCardName" VARCHAR(255) NOT NULL,
                "creditCard" VARCHAR(255) UNIQUE NOT NULL,
                "creditCardExprDate" VARCHAR(255) NOT NULL,
                "creditCardCVC" VARCHAR(4) NOT NULL,
                status VARCHAR(255) DEFAULT 'pending'
            
            );
            CREATE TABLE cats(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) DEFAULT 'Sir. Pounce',
                breed VARCHAR(255),
                age VARCHAR(255) NOT NULL,
                temperment VARCHAR(255),
                outdoor BOOLEAN DEFAULT false,
                "adoptionFee" INT DEFAULT 100,
                "imageURL" TEXT NOT NULL
            );
            CREATE TABLE purchases(
                id SERIAL PRIMARY KEY,
                "catId" INT REFERENCES cats(id),
                "orderId" INT REFERENCES orders(id),
                "adoptionFee" INT DEFAULT 100
            );
            `);
        console.log("Finished building tables");
        
    } catch (error) {
        console.error("Error building tables!");
        throw error;
    }

}

// CREATE INITIAL VALUES BELOW
