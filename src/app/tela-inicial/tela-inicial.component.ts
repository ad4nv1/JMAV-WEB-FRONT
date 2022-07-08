import { Component, OnInit } from '@angular/core';
import { Product } from '../Model/Product';
import { User } from '../Model/User';
import { AuthService } from '../services/auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-tela-inicial',
  templateUrl: './tela-inicial.component.html',
  styleUrls: ['./tela-inicial.component.css']
})
export class TelaInicialComponent implements OnInit {

  products: Product[] = [];
  verificaUsuario: User = new User();
  logado: boolean = false;
  vendedor: boolean = false;
  produto: Product = new Product();
  produtoInfo: Product = new Product();
  nomeUsuarioInfo: string = "";
  usuario: User = new User();
  auxSenha: string = "";
  senha: string ="";
  confirmarSenha: string = "";
  editSenha: number = 0;
  exibirEditarSenha: boolean = false;

  constructor(
    private service: AuthService,
  ) {
    
   }

  ngOnInit() {
    this.GetAllProduct();
    this.Inicial()
  }

  Inicial(){
    if(sessionStorage.getItem('usuario')){
      sessionStorage.getItem('usuario')? this.logado = true: this.logado =false;
    this.verificaUsuario = JSON.parse(sessionStorage.getItem('usuario') as string);
    this.verificaUsuario.vendedor == "Sim"? this.vendedor = true: this.vendedor = false;
    this.usuario = this.verificaUsuario;
    }
    
  }

  GetAllProduct(){
    this.service.GetAllProducts().subscribe((resp: Product[])=>{
      this.products = resp;
    });
  }

  teste(){
    console.log(sessionStorage.getItem('usuario')? true: false)
  }

  Sair(){
    sessionStorage.clear();
    this.logado = false
  }

  VerificaSenhas(){
    if(this.exibirEditarSenha && this.senha != "" && this.confirmarSenha != "")this.usuario.passwordUsuario = this.confirmarSenha;
    else this.usuario.passwordUsuario = this.usuario.passwordUsuario;
  }


  CadastrarProduto(){

    this.produto.seller = this.verificaUsuario;
    this.produto.price = +this.produto.price;
    this.produto.inventory = +this.produto.inventory;
    console.log(this.produto)
    this.service.CadastrarProduto(this.produto).subscribe((resp: any)=>{
      this.GetAllProduct();
      this.produto = new Product();
      swal.fire({
        icon: 'success',
        title: 'Produto cadastrado com sucesso!',
        text: 'Obrigado!',
      })
    },(err)=>{
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo deu errado, tente novamente mais tarde!',
      })
    })
  }

  SelecionarProduto(parametro: Product){
    this.nomeUsuarioInfo = ""
    this.produtoInfo = parametro;
    this.produtoInfo.seller == null?this.nomeUsuarioInfo = "Não informado":this.nomeUsuarioInfo = this.produtoInfo.seller.nameUsuario ;
  }

  AtualizaUsuario(){
    this.VerificaSenhas();
    this.service.AtualizarUsuario(this.usuario).subscribe((resp: User)=>{
      sessionStorage.setItem('usuario', JSON.stringify(resp));
      swal.fire({
        icon: 'success',
        title: 'Usuário atualizado com sucesso!',
        text: 'Os dados do usuário foram atualizados!',
      })
    },(err)=>{
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo deu errado, tente novamente mais tarde!',
      })
    })
  }

  EditarSenha(event: any){
    if(this.editSenha == 0){
      this.editSenha = 1;
      this.exibirEditarSenha = true;
    }else{
      this.editSenha = 0;
      this.exibirEditarSenha = false;
    }
  }

}
