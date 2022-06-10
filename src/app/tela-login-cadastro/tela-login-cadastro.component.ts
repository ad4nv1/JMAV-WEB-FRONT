import { Component, OnInit } from '@angular/core';
import { Logar } from '../Model/Logar';
import { User } from '../Model/User';
import { AuthService } from '../services/auth.service';

declare var jQuery: any;

@Component({
  selector: 'app-tela-login-cadastro',
  templateUrl: './tela-login-cadastro.component.html',
  styleUrls: ['./tela-login-cadastro.component.css']
})
export class TelaLoginCadastroComponent implements OnInit {

  login: Logar = new Logar();
  user: User = new User();
  contaVendedor: string = "";
  constructor(
    private service: AuthService,
  ) { }

  ngOnInit(): void {

    (function($){
      $("#signup").click(function() {
        $(".message").css("transform", "translateX(100%)");
        if ($(".message").hasClass("login")) {
          $(".message").removeClass("login");
        }
        $(".message").addClass("signup");
      });
      
      $("#login").click(function() {
        $(".message").css("transform", "translateX(0)");
        if ($(".message").hasClass("login")) {
          $(".message").removeClass("signup");
        }
        $(".message").addClass("login");
      });
    }) (jQuery);
  }


  Logar(){
    this.service.Logar(this.login).subscribe((resp: User)=>{
      alert("Usuario Logou");
      sessionStorage.setItem('usuario', JSON.stringify(resp));
      // (sessionStorage.getItem('usuario') == undefined)
    }, (err) =>{
      alert("falhou")
    });
  }
  teste(){
    this.service.requisicao().subscribe((resp:  any)=>{
      console.log(resp)
    })
  }

  Cadastrar(){
    if(this.contaVendedor){
      this.service.CadastrarUser(this.user).subscribe((resp: User)=>{
        alert("usuário cadastrado com sucesso");
      },(err)=>{
        alert("ocorreu algum erro, tente novamente mais tarde");
      });
    }else{
      this.service.CadastrarSeller(this.user).subscribe((resp: User)=>{
        alert("usuário cadastrado com sucesso");
      },(err)=>{
        alert("ocorreu algum erro, tente novamente mais tarde");
      });
    }
  }

  Vendedor(event: any){
    !this.contaVendedor? this.contaVendedor = event.target.defaultValue:this.contaVendedor = "";
    console.log(this.contaVendedor)
  }

}
