import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Assunto } from 'src/app/model/questoes/assunto';

@Component({
  selector: 'app-cadastrar-assuntos',
  templateUrl: './cadastrar-assuntos.component.html',
  styleUrls: ['./cadastrar-assuntos.component.css']
})
export class CadastrarAssuntosComponent implements OnInit {

 assunto;
 id;
 isAlterar
  constructor(private router: Router, private route: ActivatedRoute, private messageService: MessageService) {

   }

  ngOnInit() {
    this.assunto = new Assunto(null, null);
    this.route.params.subscribe(params=> {this.id = params["id"];
      if(this.id!=undefined){
        this.isAlterar=true;
        Assunto.get(this.id).subscribe(resultado =>{
          this.assunto = resultado;

        })
      }

    });
  }

  messageCadastro() {
    this.messageService.add({severity:'success', summary:'Cadastrado!', detail: this.assunto.nome+"  foi adicionado"});
  }


  messageUpdate() {
    this.messageService.add({severity:'success', summary:'Alterado!', detail: " assunto alterado"});
  }

  messageErro() {
    this.messageService.add({severity:'warn', summary:'Falha ao cadastrar assunto', detail: 'O assunto não foi cadastrado'});
  }

  messageInformarDados(){
    this.messageService.add({severity:'warn', summary:'Falha ao cadastrar assunto', detail: 'É preciso informar todos os campos do formulário'});
  }

  cadastrarAssunto() {


    if (this.assunto.validar()) {
      this.messageCadastro();
      this.assunto.save().subscribe(resultado => {
        this.router.navigate(["main", { outlets: { principal: ['juiz', 'listar-assuntos'] } }]);



      }, err => {
       this.messageErro();

      });
    } else {
     this.messageInformarDados();
    }

  }

}


