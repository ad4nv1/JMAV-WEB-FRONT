import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Logar } from '../Model/Logar';
import { Pagamento } from '../Model/Pagamento';
import { Product } from '../Model/Product';
import { User } from '../Model/User';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private url = 'http://localhost:8080';
  private url = 'https://jmav-back.herokuapp.com';

  token= {
    headers: new HttpHeaders().append(
      'Content-Type', 'application/json'
      )
  }

  constructor(
    private http: HttpClient
  ) { }

  Logar(params: Logar): Observable<User>{
    return this.http.post<User>(`${this.url}/user/logar`, params)
  }

  CadastrarUser(user: User): Observable<User>{
    return this.http.post<User>(`${this.url}/user/cadastrar`, user)
  }

  GetAllProducts(): Observable<Product[]>{
    return this.http.get<Product[]>("https://jmav-back.herokuapp.com/product/all");
  }

  CadastrarProduto(param: Product){
    
    return this.http.post(`${this.url}/product/cadastrar`, param, this.token);
  }

  AtualizarUsuario(user: User): Observable<User>{
    return this.http.put<User>(`${this.url}/user/atualizar`, user)
  }
  
  Pagamento(parametro: Pagamento): Observable<any>{
    let token= {
      headers: new HttpHeaders()
      .append(
        'Authorization', 'Bearer TEST-2021537415264714-070723-35600570f0ba87973595bc1399cadb5d-744347714'
      ).append(
        'Content-Type', 'application/json'
        )
    }
    return this.http.post<any>("https://api.mercadopago.com/checkout/preferences", parametro, token)
  }

  Frete(parametro: string):Observable<any>{
    return this.http.post<any>(`${this.url}/requisicao/consultarCEP`, "53441310")
  }

  
}
