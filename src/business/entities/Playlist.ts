export class Playlist {
    constructor(
        readonly id: string,
        readonly title: string,
        readonly subtitle: string,
        readonly date: Date,
        readonly userId: string,
        readonly image?: string 
    ) {}
}

export interface createPlaylistInput {
    title: string,
    subtitle: string,
    image?: string
}

export interface musicsPlaylist{
    musicId: string,
    playlistId: string
}

export interface musicsPlaylistInput{
    id:string,
    musicId: string,
    playlistId: string
}

export interface MusicPlaylist{
    id: string,
    musicId: string,
    playlistId:string, 
    title: string, 
    author: string, 
    album: string, 
    genres: string
}