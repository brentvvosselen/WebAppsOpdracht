import {User} from './user';
import {Image} from './image';

export class Post {
    _id: string;
    id: string;
    title: string;
    description: string;
    likes: User[];
    saves: User[];
    createdAt: Date;
    picture: Image;
    poster: User;

    constructor(id?: string,title?: string, description?:string, createdAt?:Date, likes?: User[], saves?: User[], picture?: Image, poster?: User){
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.likes = likes;
        this.saves = saves;
        this.picture = picture;
        this.poster = poster;
    } 
}
