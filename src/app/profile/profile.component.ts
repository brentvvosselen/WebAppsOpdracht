import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { Post } from '../models/post';
import { Image } from '../models/image';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private _posts: Post[];

  @ViewChild('fileInput') fileInput;
  @ViewChild('preview') preview;
  profileImage: Image;

  constructor(private _profileService: ProfileService, private authenticationService: AuthenticationService) {
    this._profileService.getProfilePicture(this.authenticationService.user$.value).subscribe(pic => this.profileImage = pic);
   }

  ngOnInit() {
    console.log("getting posts");
    this._profileService.getMyPosts(this.authenticationService.user$.value).subscribe(posts => this._posts = posts);
  }

  showPreview(){
    var file = this.fileInput.nativeElement.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () =>{
      this.profileImage = new Image(file.name, file.type, reader.result.split(',')[1]);

    }
  }

  addPicture(){
    this._profileService.addPicture(this.authenticationService.user$.value,this.profileImage).subscribe(item => console.log(item));
  }

  get posts(): Post[]{
    return this._posts;
  }

}
