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
    }, (err) =>{
      alert("falhou mizeravelmente")
    })

  }

}
