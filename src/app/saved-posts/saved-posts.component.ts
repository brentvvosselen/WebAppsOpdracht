import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from '../models/post';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-saved-posts',
  templateUrl: './saved-posts.component.html',
  styleUrls: ['./saved-posts.component.css']
})
export class SavedPostsComponent implements OnInit {

  private _savedPosts: Post[];
  private _user: string;

  constructor(private postService: PostService, private authenticationService: AuthenticationService, private router: Router) {
    if(!this.authenticationService.user$.value){
      this.router.navigateByUrl("/login");
    }
   }

  ngOnInit() {
    this._user = this.authenticationService.user$.value;
    this.postService.getSavedPosts(this._user).subscribe(posts => {this._savedPosts = posts; console.log(posts);
    });
  }

  get savedPosts(): Post[]{
    return this._savedPosts;
  }

}
