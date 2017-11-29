import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

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
    return this.http.post(`${this._url}/login`,
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

}
