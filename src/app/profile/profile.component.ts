import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { Post } from '../models/post';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private _posts: Post[];

  constructor(private _profileService: ProfileService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    console.log("getting posts");
    this._profileService.getMyPosts(this.authenticationService.user$.value).subscribe(posts => this._posts = posts);
    
  }

  get posts(): Post[]{
    return this._posts;
  }

}
