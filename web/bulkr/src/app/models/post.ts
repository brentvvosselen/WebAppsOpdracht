
export class Post {
    id: string
    title: string;
    description: string;
    createdAt: Date;


    constructor(id?: string,title?: string, description?:string, createdAt?:Date){
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
    }
    
    
}
