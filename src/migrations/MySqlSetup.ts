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
            CREATE TABLE IF NOT EXISTS ${BaseDatabase.GENRES_TABLE} (
               genre ENUM("AXÉ", "BLUES", "BOSSA NOVA", "COUNTRY", "DISCO", "ELETRONICA", "FORRO", "FUNK", "HEAVY METAL", "HIP HOP", "INDIE", "FOLK", "JAZZ", "MPB", "NEW WAVE", "POP", "PUNK", "REGGAE", "ROCK", "SAMBA", "SOFT ROCK") PRIMARY   KEY 
            ); 
           `)

         await BaseDatabase.connection.raw(`
            CREATE TABLE IF NOT EXISTS ${BaseDatabase.GENRES_MUSICS_TABLE} (
               genre_id ENUM("AXÉ", "BLUES", "BOSSA NOVA", "COUNTRY", "DISCO", "ELETRONICA", "FORRO", "FUNK", "HEAVY METAL", "HIP HOP", "INDIE", "FOLK", "JAZZ", "MPB", "NEW WAVE", "POP", "PUNK", "REGGAE", "ROCK", "SAMBA", "SOFT ROCK") NOT NULL,
               music_id VARCHAR(255) NOT NULL,
               FOREIGN KEY(genre_id) REFERENCES ${BaseDatabase.GENRES_TABLE}(genre),
               FOREIGN KEY(music_id) REFERENCES ${BaseDatabase.MUSICS_TABLE}(id) ON DELETE CASCADE
            ); 
           `)

         await BaseDatabase.connection.raw(`
            CREATE TABLE IF NOT EXISTS ${BaseDatabase.PLAYLIST_TABLE} (
               id VARCHAR(255) PRIMARY KEY,
               title VARCHAR(60) NOT NULL,
               subtitle VARCHAR(255) NOT NULL,
               image VARCHAR(255) NULL,
               date DATE DEFAULT (CURDATE()),
               user_id VARCHAR(255) NOT NULL,
               FOREIGN KEY(user_id) REFERENCES ${BaseDatabase.USERS_TABLE}(id) ON DELETE CASCADE
            ); 
           `)

         await BaseDatabase.connection.raw(`
            CREATE TABLE IF NOT EXISTS ${BaseDatabase.PLAYLIST_MUSICS_TABLE} (
               id VARCHAR(255) PRIMARY KEY,
               playlist_id VARCHAR(255) NOT NULL,
               music_id VARCHAR(255) UNIQUE NOT NULL,
               FOREIGN KEY(playlist_id) REFERENCES ${BaseDatabase.PLAYLIST_TABLE}(id) ON DELETE CASCADE,
               FOREIGN KEY(music_id) REFERENCES ${BaseDatabase.MUSICS_TABLE}(id) ON DELETE CASCADE
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