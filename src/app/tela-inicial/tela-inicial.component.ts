import { Component, OnInit } from '@angular/core';
import { Product } from '../Model/Product';
import { User } from '../Model/User';
import { AuthService } from '../services/auth.service';
import swal from 'sweetalert2';
import { Pagamento } from '../Model/Pagamento';
import { RequisicaoPagamento } from '../Model/RequisicaoPagamento';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

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
  senha: string = "";
  confirmarSenha: string = "";
  editSenha: number = 0;
  exibirEditarSenha: boolean = false;
  queryField = new FormControl();
  nomeProduto: string = "";
  productsFiltrado: Product[] = [];
  preco: any 

  constructor(
    private service: AuthService,
    // private ngxXml2jsonService: NgxXml2jsonService

  ) {

  }

  ngOnInit() {
    this.GetAllProduct();
    this.Inicial()

    this.queryField.valueChanges
      .pipe(
        map(value => value.trim()),
        distinctUntilChanged(),
      ).subscribe((resp: any) => {
        this.nomeProduto = resp
        this.productsFiltrado = []
        this.products.map((x: Product) => {
          
          if (x.name.toUpperCase().includes(this.nomeProduto.toUpperCase())) this.productsFiltrado.push(x);

        })
      });


  }

  Inicial() {
    if (sessionStorage.getItem('usuario')) {
      sessionStorage.getItem('usuario') ? this.logado = true : this.logado = false;
      this.verificaUsuario = JSON.parse(sessionStorage.getItem('usuario') as string);
      this.verificaUsuario.vendedor == "Sim" ? this.vendedor = true : this.vendedor = false;
      this.usuario = this.verificaUsuario;
    }

  }

  GetAllProduct() {
    this.service.GetAllProducts().subscribe((resp: Product[]) => {
      this.products = resp;
      this.productsFiltrado = this.products
    });
  }

  teste() {
    console.log(sessionStorage.getItem('usuario') ? true : false)
  }

  Sair() {
    sessionStorage.clear();
    this.logado = false
  }

  VerificaSenhas() {
    if (this.exibirEditarSenha && this.senha != "" && this.confirmarSenha != "") this.usuario.passwordUsuario = this.confirmarSenha;
    else this.usuario.passwordUsuario = this.usuario.passwordUsuario;
  }


  CadastrarProduto() {

    this.produto.seller = this.verificaUsuario;
    this.produto.price = +this.produto.price;
    this.produto.inventory = +this.produto.inventory;
    this.service.CadastrarProduto(this.produto).subscribe((resp: any) => {
      this.GetAllProduct();
      this.produto = new Product();
      swal.fire({
        icon: 'success',
        title: 'Produto cadastrado com sucesso!',
        text: 'Obrigado!',
      })
    }, (err) => {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo deu errado, tente novamente mais tarde!',
      })
    })
  }

  SelecionarProduto(parametro: Product) {
    this.nomeUsuarioInfo = ""
    this.produtoInfo = parametro;
    this.produtoInfo.seller == null ? this.nomeUsuarioInfo = "Não informado" : this.nomeUsuarioInfo = this.produtoInfo.seller.nameUsuario;
  }

  AtualizaUsuario() {
    if ((this.usuario.emailUsuario.length >=1) &&
    (this.usuario.emailUsuario.length >=3) &&
    (this.usuario.emailUsuario.search("@")!=-1) &&
    (this.usuario.emailUsuario.search(" ")==-1) &&
    (this.usuario.emailUsuario.search(" ")==-1) &&
    (this.usuario.emailUsuario.search(".")!=-1) &&
    (this.usuario.emailUsuario.indexOf(".") >=1)&&
    (this.usuario.emailUsuario.lastIndexOf(".") < this.usuario.emailUsuario.length - 1)) 
    {
    this.VerificaSenhas();
    this.service.AtualizarUsuario(this.usuario).subscribe((resp: User) => {
      sessionStorage.setItem('usuario', JSON.stringify(resp));
      swal.fire({
        icon: 'success',
        title: 'Usuário atualizado com sucesso!',
        text: 'Os dados do usuário foram atualizados!',
      })
    }, (err) => {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo deu errado, tente novamente mais tarde!',
      })
    })
  }else{
    swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Email inválido!',
    })
  }
  }

  EditarSenha(event: any) {
    if (this.editSenha == 0) {
      this.editSenha = 1;
      this.exibirEditarSenha = true;
    } else {
      this.editSenha = 0;
      this.exibirEditarSenha = false;
    }
  }

  Pagamento(parametro: Product) {
    let req: RequisicaoPagamento = new RequisicaoPagamento();
    req.unit_price = parametro.price;
    req.category_id = parametro.category;
    req.title = parametro.name;
    req.description = parametro.description;
    req.picture_url = parametro.image;
    req.currency_id = "BRL";
    req.quantity = 1;
    let pag: Pagamento = new Pagamento();
    pag.items = [];
    pag.items.push(req);
    this.service.Pagamento(pag).subscribe((resp: any) => {
      console.log(resp.sandbox_init_point)
      window.location = resp.sandbox_init_point;

    })
  }

//   CalcularFrete() {
//     this.service.Frete("53441310").subscribe((resp: any) => {
//       console.log(resp)
//     }, (err) => {
//       if (err.statusText === "OK") {
//         console.log(err.error.text)
//         let parseString = require('xml2js').parseString;
// let xml = "<root>Hello xml2js!</root>"

// parseString(xml, function (err:any, result:any) {
//   console.dir(result);
// });
//         // let parseString = require('xml2js').parseString;
//         // let xml = "<root>Hello xml2js!</root>"

//         // parseString(xml, ((error: any, result: any)=>{
//         //   console.dir(result);
//         // }) )
//       }
//     })
//   }

}
