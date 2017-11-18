import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit {
  
  @Input() public post: Post;
  private likes: number;
  private liked: boolean;
  private saved: boolean;

  constructor(private postService: PostService) { 
    
  }

  ngOnInit() {
    this.likes = Object.keys(this.post.likes).length;
    /*check if liked*/
    for(let user of this.post.likes){
      if(user.email === "brentvanvosselen@live.be"){
        this.liked = true;
      }
    }
    /*check if saved*/
    for(let user of this.post.saves){
      if(user.email === "brentvanvosselen@live.be"){
        this.saved = true;
      }
    }
  }

  save(){
    if(!this.saved){
      this.postService.savePost("brentvanvosselen@live.be",this.post.id).subscribe(res => console.log(res));
      this.saved = true;
    }
    
  }

  bulkit(){
    if(!this.liked){
      this.postService.bulkPost("brentvanvosselen@live.be",this.post.id).subscribe(res => console.log(res));
      this.likes += 1;
      this.liked = true;
    }
    
  }

}
