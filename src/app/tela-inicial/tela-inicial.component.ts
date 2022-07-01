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

}
