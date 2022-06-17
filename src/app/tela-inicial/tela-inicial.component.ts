import { Component, OnInit } from '@angular/core';
import { Product } from '../Model/Product';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tela-inicial',
  templateUrl: './tela-inicial.component.html',
  styleUrls: ['./tela-inicial.component.css']
})
export class TelaInicialComponent implements OnInit {

  products: Product[] = [];

  constructor(
    private productService: AuthService,
  ) { }

  ngOnInit() {
    this.GetAllProduct();
  }

  GetAllProduct(){
    this.productService.GetAllProducts().subscribe((resp: Product[])=>{
      this.products = resp;
    });
  }

}
