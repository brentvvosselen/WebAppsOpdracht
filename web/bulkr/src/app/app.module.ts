import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileService } from './services/profile.service';
import { PostService } from './services/post.service';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FeedComponent } from './feed/feed.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { PostViewComponent } from './post-view/post-view.component';
import { NewPostComponent } from './new-post/new-post.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FeedComponent,
    NotFoundComponent,
    ProfileComponent,
    PostViewComponent,
    NewPostComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: "feed", component:FeedComponent},
      { path: "profile", component:ProfileComponent},
      { path: "new", component:NewPostComponent}, 
      { path: "", component:FeedComponent},
      { path: "**", component:NotFoundComponent}
        
    ])
  ],
  providers: [ProfileService, PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
