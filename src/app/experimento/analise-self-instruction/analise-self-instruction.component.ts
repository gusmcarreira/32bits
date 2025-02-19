import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Query from 'src/app/model/firestore/query';
import { Assunto } from 'src/app/model/questoes/assunto';
import { QuestaoProgramacao } from 'src/app/model/questoes/questaoProgramacao';
import { AutoInstrucao } from 'src/app/model/srl/autoInstrucao';

@Component({
  selector: 'app-analise-self-instruction',
  templateUrl: './analise-self-instruction.component.html',
  styleUrls: ['./analise-self-instruction.component.css']
})
export class AnaliseSelfInstructionComponent implements OnChanges {

  @Input()
  estudante;

  planejamentos;

  constructor(private route:ActivatedRoute, private router: Router) { }

  ngOnChanges(): void {
    this.planejamentos = [];
    if(this.estudante != null && this.estudante.pk() != null){
      Assunto.getAll(new Query('isAtivo', '==', true)).subscribe((assuntos) => {
        AutoInstrucao.getAll(new Query('estudanteId', '==', this.estudante.pk())).subscribe(
          (instrucoes) => {
            assuntos.forEach((assunto) => {
              assunto.questoesProgramacao.forEach((questao) => {
                for (let i = 0; i < instrucoes.length; i++) {
                  if (instrucoes[i]['questaoId'] == questao.id) {




                    let autoInstrucao = {
                      problema: instrucoes[i].problema,
                      variaveis: instrucoes[i].variaveis,
                      status:false
                    };

                    QuestaoProgramacao.isFinalizada(questao, this.estudante).subscribe(percentual=>{
                      autoInstrucao.status = percentual >= 0.75? true:false;
                    })


                    if (instrucoes[i].condicoes != null) {
                      autoInstrucao['condicoes'] = instrucoes[i].condicoes;
                    }

                    if (instrucoes[i].repeticoes != null) {
                      autoInstrucao['repeticoes'] = instrucoes[i].repeticoes;
                    }

                    if (instrucoes[i].funcoes != null) {
                      autoInstrucao['funcoes'] = instrucoes[i].funcoes;
                    }

                    questao["assunto"] = assunto.nome;

                    this.planejamentos.push({
                      assunto:assunto,
                      questao: questao,
                      autoInstrucao: autoInstrucao,
                    });
                  }
                }
              });
            });
          }
        );
      });
    }

    this.route.params.subscribe(params=>{

    })

  }

  abrirSubmissao(estudante, assunto, questao){
    this.router.navigate(['geral/main', { outlets: { principal: ['professor', 'visualizar-submissao-recente', estudante.pk(), assunto.pk(), questao.id, ] } }]);
  }

}
