import { Post } from './post';
import { Image } from './image';

export class User {
    id: string;
    email: string;
    saves: Post[];
    posts: Post[];
    picture: Image;

    constructor(id?:string, email?:string, saves?:Post[], posts?:Post[], picture?: Image){
        this.id = id;
        this.email = email;
        this.saves = saves;
        this.posts = posts;
        this.picture = picture;
    }
}