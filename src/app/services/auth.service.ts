import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Logar } from '../Model/Logar';
import { User } from '../Model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://localhost:8080';

  constructor(
    private http: HttpClient
  ) { }

  Logar(params: Logar): Observable<User>{
    return this.http.post<User>(`${this.url}/user/logar`, params)
  }

  Cadastrar(user: User): Observable<User>{
    return this.http.post<User>(`${this.url}/user/logar`, user)
  }

  
}
