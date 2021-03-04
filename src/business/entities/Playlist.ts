export class Playlist {
    constructor(
        readonly id: string,
        readonly title: string,
        readonly subtitle: string,
        readonly date: Date,
        readonly userId: string,
        readonly image?: string //= "no-image"
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
