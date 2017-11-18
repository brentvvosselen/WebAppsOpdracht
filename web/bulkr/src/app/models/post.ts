import {User} from './user';

export class Post {
    id: string;
    title: string;
    description: string;
    likes: User[];
    saves: User[];
    createdAt: Date;

    constructor(id?: string,title?: string, description?:string, createdAt?:Date, likes?: User[], saves?: User[]){
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.likes = likes;
        this.saves = saves;
    } 
}
