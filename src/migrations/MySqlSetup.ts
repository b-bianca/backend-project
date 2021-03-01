import BaseDatabase from "../data/BaseDatabase";

export class MySqlSetup extends BaseDatabase {

   static createTables = async () => {
      try {

         await BaseDatabase.connection.raw(`
            CREATE TABLE IF NOT EXISTS ${BaseDatabase.USERS_TABLE} (
             id VARCHAR(255) PRIMARY KEY,
             name VARCHAR(255) NOT NULL,
             email VARCHAR(255) UNIQUE NOT NULL,
             nickname VARCHAR(255) UNIQUE NOT NULL,
             password VARCHAR(255) NOT NULL 
            );
           `)

         await BaseDatabase.connection.raw(`
            CREATE TABLE IF NOT EXISTS ${BaseDatabase.MUSICS_TABLE} (
             id VARCHAR(255) PRIMARY KEY,
             title VARCHAR(60) NOT NULL,
             author VARCHAR(255) NOT NULL,
             date DATE DEFAULT (CURDATE()),
             file VARCHAR(255) NOT NULL,
             album VARCHAR(60) NOT NULL,
             user_id VARCHAR(255) NOT NULL,
             FOREIGN KEY(user_id) REFERENCES ${BaseDatabase.USERS_TABLE}(id)
            ); 
          `)

         await BaseDatabase.connection.raw(`
            CREATE TABLE IF NOT EXISTS ${BaseDatabase.GENRES_MUSICS_TABLE} (
             genre ENUM("AXÉ", "BLUES", "BOSSA NOVA", "COUNTRY", "DISCO", "ELETRONICA", "FORRO", "FUNK", "HEAVY METAL", "HIP HOP", "INDIE", "FOLK", "JAZZ", "MPB", "NEW WAVE", "POP", "PUNK", "REGGAE", "ROCK", "SAMBA", "SOFT ROCK") NOT NULL,
             music_id VARCHAR(255) NOT NULL,
             FOREIGN KEY(music_id) REFERENCES ${BaseDatabase.MUSICS_TABLE}(id)
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