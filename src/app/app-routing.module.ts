import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarrinhoComponent } from './carrinho/carrinho.component';
import { TelaInicialComponent } from './tela-inicial/tela-inicial.component';
import { TelaLoginCadastroComponent } from './tela-login-cadastro/tela-login-cadastro.component';

const routes: Routes = [
  {path:'', redirectTo:'inicio', pathMatch:'full'},
  {path: 'inicio', component: TelaInicialComponent},
  {path: 'LoginCadastro', component: TelaLoginCadastroComponent},
  {path: 'carrinho', component: CarrinhoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
