import { Component, OnInit, ViewChild } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';
import { AuthenticationService } from '../authentication.service';
import { Image } from '../models/image';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  
  private _post: Post;
  currentUser: string;
  private _error: string;

  @ViewChild('fileInput') fileInput;
  @ViewChild('preview') preview;
  image: Image;

  constructor(private postService: PostService, private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this._post = new Post();
    this.currentUser = this.authenticationService.user$.value
  }

  add(){
    
    if(this._post.description == undefined || this._post.title == undefined){
      this._error = "Not all fields are filled in";
    }else{
      this.postService.addPost(this.currentUser,this._post).subscribe(res => (this.router.navigate(["/feed"])),
      (err: HttpErrorResponse) => {
        if(err.error instanceof Error){
          this._error = err.error.message;
        }else{
          this._error = "Could not add post";
        }
      });
    }
   
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

  get error(): string{
    return this._error;
  }

}
