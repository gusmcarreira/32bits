import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';
import AtividadeGrupo from 'src/app/model/cscl/atividadeGrupo';
import SubmissaoGrupo from 'src/app/model/cscl/submissaoGrupo';
import Query from 'src/app/model/firestore/query';
import { Util } from 'src/app/model/util';

@Component({
  selector: 'app-visualizar-solucoes-atividade-grupo',
  templateUrl: './visualizar-solucoes-atividade-grupo.component.html',
  styleUrls: ['./visualizar-solucoes-atividade-grupo.component.css']
})
export class VisualizarSolucoesAtividadeGrupoComponent implements OnInit {


  atividadeGrupo;
  submissoesGrupo;

  constructor(private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['atividadeGrupoId'] != null && params['grupoId'] != null) {
        AtividadeGrupo.get(params['atividadeGrupoId']).subscribe((atividadeGrupo) => {
          this.atividadeGrupo = atividadeGrupo as AtividadeGrupo;
          SubmissaoGrupo.getAll(new Query("grupoId", "==", params['grupoId'])).subscribe(submissoes=>{
            this.submissoesGrupo = submissoes;
          })
        });
      }
    });
  }

  converterParaDate(data) {
    if(data != null){
      return Util.firestoreDateToDate(data);
    }
    
  }

  visualizarSubmissao(submissao){
    this.router.navigate(["main", { outlets: { principal: ['visualizar-submissao-questao', submissao, true] } }]);
  }

}
