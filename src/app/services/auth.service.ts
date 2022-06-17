import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Logar } from '../Model/Logar';
import { Product } from '../Model/Product';
import { User } from '../Model/User';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost:8080';

  constructor(
    private http: HttpClient
  ) { }

  Logar(params: Logar): Observable<User>{
    return this.http.post<User>(`${this.url}/user/logar`, params)
  }

  CadastrarUser(user: User): Observable<User>{
    return this.http.post<User>(`${this.url}/user/cadastrar`, user)
  }

  CadastrarSeller(user: User): Observable<User>{
    return this.http.post<User>(`${this.url}/seller/cadastrar`, user)
  } 

  GetAllProducts(): Observable<Product[]>{
    return this.http.get<Product[]>("https://jmav-back.herokuapp.com/product/all");

  }

  
}
