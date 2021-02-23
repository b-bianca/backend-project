import bcrypt from "bcryptjs"

export class HashManager {
   
   public generateHash = (plainText: string): string => {
      const rounds: number = Number(process.env.BCRYPT_COST)
      const salt = bcrypt.genSaltSync(rounds)
      return bcrypt.hashSync(plainText, salt)
    }

   public compareHash = (plainText: string, cypherText: string): boolean => {
      return bcrypt.compareSync(plainText, cypherText)
   }
}

export default new HashManager() 