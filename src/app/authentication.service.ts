import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AuthenticationService {
  private _url = '/api/users';
  private _user$: BehaviorSubject<string>;


  constructor(private http: Http) { 
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this._user$ = new BehaviorSubject<string>(
      currentUser && currentUser.email);
  }

  get user$(): BehaviorSubject<string> {
    return this._user$;
  }

  login(email: string, password: string): Observable<boolean>{
    return this.http.post(`http://localhost:3000/api/login`,
    {email: email, password: password})
    .map(res => res.json()).map(res => {
      const token = res.token;
      if(token){
        localStorage.setItem('currentUser', 
      JSON.stringify({email: email, token: token}));
      this._user$.next(email);
      return true;
      }else{
        return false;
      }
    });
  }

  register(email: string, password: string): Observable<boolean>{
    return this.http.post(`http://localhost:3000/api/register`,{
      email: email, password: password
    }).map(res => res.json()).map(res => {
      const token = res.token;
      if(token){
        localStorage.setItem('currentUser',JSON.stringify({email: email, token: res.token}));
        this._user$.next(email);
        return true;
      }else{
        return false;
      }
    });
  }

  logout(){
    if (this.user$.getValue()){
      localStorage.removeItem('currentUser');
      setTimeout(() => this._user$.next(null));
    }
  }
  
  checkUserNameAvailability(email: string): Observable<boolean> {
    return this.http.post(`http://localhost:3000/api/checkusername`, { email: email }).map(res => res.json())
    .map(item => {
      if (item.email === 'alreadyexists') {
        return false;
      } else {
        return true;
      }
    });
  }

}
