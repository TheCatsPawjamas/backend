const {client} = require("./client");

const bcrypt = require("bcrypt"); 

// database functions

// user functions
async function createUser({ username, password, email, admin }) {
    try {
        const saltCount = 12;
        const hashedPassword = await bcrypt.hash(password, saltCount);
        const hashedEmail = await bcrypt.hash(email, saltCount);
    
        const { rows } = await client.query(`
            INSERT INTO users(username, password, email, admin )
            VALUES($1, $2, $3, $4)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
            `, [username, hashedPassword, hashedEmail, admin]);
    
        return rows;
      } catch (error) {
        throw error;
      }

}

async function getUser({ username, password, email }) {
    try {
        const { rows } = await client.query(`
          SELECT id, username, password, email 
          FROM users
          WHERE username = $1;
        `, [username]);
    
        if (rows.length === 0) {
          throw new Error('User not found');
        }
    
        const user = rows[0];
        // const saltCount = 12;
        const hashedPassword = user.password;
        const hashedEmail = user.email;
    
        const isValidPassword = await bcrypt.compare(password, hashedPassword);
        if (!isValidPassword) {
          throw new Error('Invalid password');
        }
        const isValidEmail = await bcrypt.compare(email, hashedEmail);
        if(!isValidEmail){
            throw new Error('Invalid email');
        }
    
        return user;
      } catch (error) {
        throw error;
      }
}

async function getUserById(userId) {
    try {

        const {rows: [user] } = await client.query(`
            SELECT id, username FROM users
            WHERE id=$1;
        `,[userId]);

        if (!user) {
            return null
        }

        return user;

    } catch (error) {
        console.log(error);
    }

}

async function getUserByUsername(userName) {
    try {
        console.log("username in getUserByUsername" + userName)
        const {rows} = await client.query(`
            SELECT id, username, password 
            FROM users
            WHERE username=$1;
        `, [userName])

        console.log("rows for getUserByUsername");
        console.log(rows);
        return rows;
        // if(rows){
        //     return rows[0];
        // }
        // else{
        //     return undefined;
        // }
    } catch (error) {
        console.log(error);
    }
}
async function updateUserById({id, fields={}}){
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    if(setString.length ===0){
        return
    }

    try {
        const { rows: [ user ] } = await client.query(`
        UPDATE users
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return user;

    } catch (error) {
        console.log(error);
    }

}
module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
  updateUserById,
}