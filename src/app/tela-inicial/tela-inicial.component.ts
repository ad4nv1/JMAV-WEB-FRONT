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
  preco: any;
  atualizarProduto: Product = new Product();

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
    req.picture_url = "https://avatars.githubusercontent.com/u/71855790?v=4";
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

  SelecionarProdutoAtualizar(produto: Product){
    this.atualizarProduto = produto;
  }

  AtualizarProduto(){
    this.service.EditarProduto(this.atualizarProduto).subscribe((resp: Product)=>{
      swal.fire({
        icon: 'success',
        title: 'Produto atualizado com sucesso!',
        text: 'Os dados do produto foram atualizados!',
      })
    }, (err)=>{
      swal.fire({
        icon: 'warning',
        title:'Algo deu errado',
        text: 'Tente novamente mais tarde!',
      })
    })
  }



  async CalcularFrete() {
    const { value: text } = await swal.fire({
      input: 'text',
      inputLabel: 'Insira seu CPF',
      inputPlaceholder: '00000-000',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true
    })
    
    if (text) {
      this.service.Frete(text).subscribe((resp: string)=>{
        let a = resp.indexOf("<Valor>") //7
        let b = resp.indexOf("<\Valor>") //7
        swal.fire("O valor do frete é: "+resp.slice(a+7, b));
      },(err)=>{
        console.log(err.error.text)
        if(err.statusText.toUpperCase === "OK".toUpperCase){
        let a = err.error.text.indexOf("<Valor>") //7
        let b = err.error.text.indexOf("</Valor>") //7
        swal.fire("O valor do frete é: "+err.error.text.slice(a+7, b));
        }else{
          console.log(err.statusText)
        swal.fire("Cep informado não é válido");
        }
        
      })

     
    }
  }

  async MensagemValor(msg:string): Promise<string>{
    this.service.Frete(msg).subscribe((resp: String)=>{
      let a = resp.indexOf("<Valor>") //7
      let b = resp.indexOf("<\Valor>") //7
      msg = resp.slice(a+7, b)
      msg =  "O valor do frete é: "+msg;
    },(err)=>{
      msg = "O valor do frete é: "+msg;
    })
    return msg
  }

}
