import { Post } from './post';

export class User {
    id: string;
    email: string;
    saves: Post[];
    posts: Post[];

    constructor(id?:string, email?:string, saves?:Post[], posts?:Post[]){
        this.id = id;
        this.email = email;
        this.saves = saves;
        this.posts = posts;
    }
}