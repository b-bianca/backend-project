export class Playlist {
    constructor(
        readonly id: string,
        readonly title: string,
        readonly subtitle: string,
        readonly date: Date,
        readonly image?: string //= "no-image"
    ) {}
}

export interface createPlaylistInput {
    title: string,
    subtitle: string,
    image?: string
}

