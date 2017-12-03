import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileService } from './services/profile.service';
import { PostService } from './services/post.service';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FeedComponent } from './feed/feed.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { PostViewComponent } from './post-view/post-view.component';
import { NewPostComponent } from './new-post/new-post.component';
import { SavedPostsComponent } from './saved-posts/saved-posts.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthenticationService } from './authentication.service';

//material
import { MaterialModule } from './material.module';
@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FeedComponent,
    NotFoundComponent,
    ProfileComponent,
    PostViewComponent,
    NewPostComponent,
    SavedPostsComponent,
    UserComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot([
      { path: "feed", component:FeedComponent},
      { path: "profile/:email", component:UserComponent},
      { path: "profile", component:ProfileComponent},
      { path: "new", component:NewPostComponent}, 
      { path: "saves", component:SavedPostsComponent},
      { path: "register", component:RegisterComponent},
      { path: "login", component:LoginComponent},
      { path: "", component:FeedComponent},
      { path: "**", component:NotFoundComponent}
        
    ])
  ],
  providers: [ProfileService, PostService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
