import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Logar } from '../Model/Logar';
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


  requisicao(){
    return this.http.get("http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdEmpresa=08082650&sDsSenha=564321&sCepOrigem=70002900&sCepDestino=04547000&nVlPeso=1&nCdFormato=1&nVlComprimento=20&nVlAltura=20&nVlLargura=20&sCdMaoPropria=n&nVlValorDeclarado=0&sCdAvisoRecebimento=n&nCdServico=04510&nVlDiametro=0&StrRetorno=xml&nIndicaCalculo=3")
  }

  
}
