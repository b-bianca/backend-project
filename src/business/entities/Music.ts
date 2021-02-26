export class Music {
    constructor(
        readonly id: string,
        readonly title: string,
        readonly author: string,
        readonly date: Date,
        readonly file: string,
        readonly album: string,
        readonly userId: string,
        readonly genres: genres[]
    ) {}
}

export enum genres {
    AXE = "AXÉ", 
    BLUES = "BLUES", 
    BOSSA_NOVA = "BOSSA NOVA", 
    COUNTRY = "COUNTRY", 
    DISCO = "DISCO", 
    ELETRONICA = "ELETRONICA", 
    FORRO = "FORRO", 
    FUNK = "FUNK", 
    HEAVY_METAL = "HEAVY METAL", 
    HIP_HOP = "HIP HOP", 
    INDIE = "INDIE", 
    FOLK = "FOLK", 
    JAZZ = "JAZZ", 
    MPB = "MPB", 
    NEW_WAVE = "NEW WAVE", 
    POP = "POP", 
    PUNK = "PUNK", 
    REGGAE = "REGGAE", 
    ROCK = "ROCK", 
    SAMBA = "SAMBA", 
    SOFT_ROCK = "SOFT ROCK"
}

export interface createMusicInput {
    title: string,
    author: string,
    file: string,
    album: string,
    genres: genres[]
}