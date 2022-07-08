import { Component, OnInit } from '@angular/core';
import { Logar } from '../Model/Logar';
import { User } from '../Model/User';
import { AuthService } from '../services/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

declare var jQuery: any;

@Component({
  selector: 'app-tela-login-cadastro',
  templateUrl: './tela-login-cadastro.component.html',
  styleUrls: ['./tela-login-cadastro.component.css']
})
export class TelaLoginCadastroComponent implements OnInit {

  login: Logar = new Logar();
  user: User = new User();
  varVendedor: string = "";
 
  contaVendedor: string = "";
  constructor(
    private service: AuthService,
    private router: Router,
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
      sessionStorage.setItem('usuario', JSON.stringify(resp));
      this.router.navigate(["/inicio"])
      swal.fire({
        icon: 'success',
        title: 'Bem vindo '+ resp.nameUsuario+"!",
        text: '',
      })
      // (sessionStorage.getItem('usuario') == undefined)
    }, (err) =>{
      swal.fire({
        icon: 'warning',
        title: 'Eita!',
        text: 'Email e senha inválidos!',
      })
    });
  }

  teste(){
    swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: '',
    })
  }

  Cadastrar(){
    if(this.user.nameUsuario.length > 25 || this.user.emailUsuario.length > 30 || this.user.passwordUsuario.length > 20){
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Muitos caracteres nos campos!',
      })
    }else{
      this.user.balance = 0;
    this.user.carUsuario = "";
    this.user.developerUsuario = "Nao";
    this.user.statusUsuario = "Ativo";
    this.varVendedor == ""?this.user.vendedor = "Nao":this.user.vendedor  = "Sim";
    console.log(this.user)
    this.service.CadastrarUser(this.user).subscribe((resp: User)=>{
      this.user = new User();
      swal.fire({
        icon: 'success',
        title: 'Usuário cadastrado com sucesso!',
        text: 'Você já pode logar na sua conta utilizando o email e senha!',
      })
    },(err)=>{
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo deu errado, tente novamente mais tarde!',
      })
    })
    }
    
  }

  Vendedor(event: any){
    !this.varVendedor? this.varVendedor = event.target.defaultValue: this.varVendedor = "";
  }

}
