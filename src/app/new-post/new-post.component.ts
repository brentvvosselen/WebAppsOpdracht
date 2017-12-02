import { Component, OnInit, ViewChild } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';
import { AuthenticationService } from '../authentication.service';
import { Image } from '../models/image';


@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  
  private _post: Post;
  currentUser: string;

  @ViewChild('fileInput') fileInput;
  @ViewChild('preview') preview;
  image: Image;

  constructor(private postService: PostService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this._post = new Post();
    this.currentUser = this.authenticationService.user$.value
  }

  add(){
    
    this.postService.addPost(this.currentUser,this._post).subscribe(res => (console.log(res)));
  }

  showPreview(){
    var file = this.fileInput.nativeElement.files[0];
    console.log(file);
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () =>{
      this.image = new Image(file.name, file.type, reader.result.split(',')[1]);
      console.log(this.image);
      this._post.picture = this.image;
    }
  }

  get post():Post{
    return this._post;
  }

}
