import BaseDataBase from "../data/BaseDataBase"

export class MySqlSetup extends BaseDataBase {

    static createTables = async () => {
        try {
           
           await BaseDataBase.connection.raw(`
            CREATE TABLE IF NOT EXISTS ${BaseDataBase.USER_TABLE} (
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
           BaseDataBase.connection.destroy()
        }
    }
}

MySqlSetup.createTables()