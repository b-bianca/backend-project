import BaseDatabase from "../data/BaseDatabase"

export class MySqlSetup extends BaseDatabase {

    static createTables = async () => {
        try {

           await BaseDatabase.connection.raw(`
            CREATE TABLE IF NOT EXISTS ${BaseDatabase.USER_TABLE} (
             id VARCHAR(255) PRIMARY KEY,
             name VARCHAR(255) NOT NULL,
             email VARCHAR(255) UNIQUE NOT NULL,
             nickname VARCHAR(255) UNIQUE NOT NULL,
             password VARCHAR(255) NOT NULL 
            );
           `)
          
          console.log("MySql setup completed!")
 
        } catch (error) {
           console.log(error)
 
        } finally {
           BaseDatabase.connection.destroy()
        }
    }
}

MySqlSetup.createTables()