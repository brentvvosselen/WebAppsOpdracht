import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  
  private _post: Post;
  currentUser: string;

  constructor(private postService: PostService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this._post = new Post();
    this.currentUser = this.authenticationService.user$.value
  }

  add(){
    this.postService.addPost(this.currentUser,this._post).subscribe(res => (console.log(res)));
  }

  get post():Post{
    return this._post;
  }

}
