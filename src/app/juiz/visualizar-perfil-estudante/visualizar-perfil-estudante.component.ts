import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Usuario from 'src/app/model/usuario';
import { Questao } from 'src/app/model/questao';
import { LoginService } from '../../login-module/login.service';
import { Assunto } from 'src/app/model/assunto';
import Submissao from 'src/app/model/submissao';
import Query from 'src/app/model/firestore/query';

@Component({
  selector: 'app-visualizar-perfil-estudante',
  templateUrl: './visualizar-perfil-estudante.component.html',
  styleUrls: ['./visualizar-perfil-estudante.component.css']
})
export class VisualizarPerfilEstudanteComponent implements OnInit {
  @Input("assunto") assunto?;
  estudante;
  questoes : Questao [] = [];
  submissoes: any[];
  respostaUsuario;
  


  constructor(private route: ActivatedRoute, private login:LoginService) {
    this.estudante = new Usuario(null,null,null); 
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
    Usuario.get(params['id']).subscribe (estudante =>{this.estudante = estudante
      });
      Submissao.getAll (new Query("estudanteId", "==", params['id'])).subscribe (resultado => {
        this.submissoes = resultado;
        this.buscarQuestoes(resultado); 
      })
    });
  }


  
  porcetagemEstudante(questoes){
    questoes.forEach(questao =>{
      Questao.isFinalizada(questao, this.login.getUsuarioLogado()).subscribe(porcentagem=>{
        //questao.respostaUsuario = porcentagem;
      });
    })
  
  }
  buscarQuestoes(submissoes=[]){
    submissoes.forEach(submissao=>{
      Assunto.getAll().subscribe(assuntos =>{
        assuntos.forEach(assunto => {
          assunto.questoesProgramacao.forEach (questao=>{
            if (questao.id == submissao.questaoId){
              this.questoes.push(questao);
              this.porcetagemEstudante(this.questoes);
            }
          });
        });
      });
    });
  }
  
  }
 
 

    
  
  

  



  


    
    




