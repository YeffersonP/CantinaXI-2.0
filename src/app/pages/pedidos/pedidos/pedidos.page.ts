import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { CarrinhoPage } from 'src/app/pages/pedidos/carrinho/carrinho.page'
import { CategoriaDados, CategoriaService } from 'src/app/services/categoria.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {
  categorias: CategoriaDados[] = [];
  vendedor = localStorage.getItem('vendedor');
  admin = localStorage.getItem('administrador');
  gerenciamento = localStorage.getItem('gerenciamento');
  checadoTema = false;
  checadoEditor = false;

  constructor(
    private categoriaService:CategoriaService,
    private modalCtrl: ModalController, 
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
    if(localStorage.getItem('tema') != 'light'){
      this.checadoTema = true;
      document.body.setAttribute('color-theme', 'dark');
      localStorage.setItem('tema', 'dark');
    }

    if(localStorage.getItem('gerenciamento') != 'false'){
      this.checadoEditor = true;
      localStorage.setItem('gerenciamento', 'true');
    }

    this.carregarCategorias();
  }

  alterarTema(event: any){
    if(event.detail.checked){
      document.body.setAttribute('color-theme', 'dark');
      localStorage.setItem('tema', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
      localStorage.setItem('tema', 'light');
    }
  }
  
  alterarModo(event: any){
    location.href = '/tabs/pedidos';
    if(event.detail.checked){
      localStorage.setItem('gerenciamento', 'true');
    } else {
      localStorage.setItem('gerenciamento', 'false');
    }
  }

  async carregarCategorias(){
    const loading = await this.loadingCtrl.create({
      message: 'Carregando...',
      spinner: 'circles'
    });
    await loading.present();

    this.categoriaService.listarCategorias().subscribe((res) => {
      loading.dismiss();
      this.categorias.splice(0)
      this.categorias.push(...res.dados);
    })
  }

  async atualizarCategorias(data: any){
    this.categorias.push(data)
  }

  async mostrarCarrinho(){
    const modal = await this.modalCtrl.create({
      component: CarrinhoPage,
      breakpoints: [0.5, 1],
      initialBreakpoint: 0.5,
      handle: false
    })
    await modal.present()
  }

  async criarCategoriaAlert(){
    const alert = await this.alertCtrl.create({
      header: 'Criar categoria',
      inputs: [
        {  
          name: 'Nome',  
          type: 'text',  
          placeholder: 'Nome da categoria'
        }
      ],
      buttons: [  
        {  
          text: 'CANCELAR',  
          role: 'cancel',  
          handler: () => {  
          }  
        },  
        {  
          text: 'CONFIRMAR',  
          handler: async (data: any) => { 
            if(data.Nome != '') {this.categoriaService.adicionarCategoria(data); this.ngOnInit()}
          }
        }  
      ],
    });

    await alert.present();
  }

}
