import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login-module/login.service';
import { Assunto } from 'src/app/model/assunto';
import { Groups } from 'src/app/model/experimento/groups';
import { QuestaoProgramacao } from 'src/app/model/questoes/questaoProgramacao';
import { forkJoin } from 'rxjs';
import QuestaoFechada from 'src/app/model/questoes/questaoFechada';
import QuestaoParsonProblem from 'src/app/model/questoes/parsonProblem';

@Component({
  selector: 'app-listar-questoes-sequencia',
  templateUrl: './listar-questoes-sequencia.component.html',
  styleUrls: ['./listar-questoes-sequencia.component.css'],
})
export class ListarQuestoesSequenciaComponent implements OnChanges {
  @Input()
  assunto?: Assunto;

  questoes;

  constructor(private router: Router, private login: LoginService) {}

  ngOnChanges(): void {
    if (
      this.assunto != null &&
      Array.isArray(this.assunto.questoesFechadas) &&
      Array.isArray(this.assunto.questoesProgramacao) &&
      this.assunto.questoesFechadas.length > 0 &&
      this.assunto.questoesProgramacao.length > 0
    ) {
      let consultas = {};
      consultas['questoesFechadas'] = QuestaoFechada.verificarQuestoesRespondidas(
        this.login.getUsuarioLogado(),
        this.assunto.questoesFechadas
      );

      consultas['questoesProgramacao'] = QuestaoProgramacao.verificarQuestoesRespondidas(
        this.login.getUsuarioLogado(),
        this.assunto.questoesProgramacao
      );

      consultas['questoesParson'] = QuestaoParsonProblem.verificarQuestoesRespondidas(
        this.login.getUsuarioLogado(),
        this.assunto.questoesParson
      );

      forkJoin(consultas).subscribe((respostas) => {
        this.assunto.questoesFechadas = respostas['questoesFechadas'];
        this.assunto.questoesProgramacao = respostas['questoesProgramacao'];
        this.assunto.questoesParson = respostas['questoesParson'];
        this.questoes = this.assunto.ordenarQuestoes();
      });
    }
  }

  abrirQuestao(questao) {
    if (questao instanceof QuestaoFechada) {
      this.router.navigate([
        'main',
        { outlets: { principal: ['visualizacao-questao-fechada', this.assunto.pk(), questao.id] } },
      ]);
    } else if (questao instanceof QuestaoParsonProblem) {
      this.router.navigate([
        'main',
        { outlets: { principal: ['visualizar-questao-parson', this.assunto.pk(), questao.id] } },
      ]);
    } else {
      if (this.login.getUsuarioLogado().grupoExperimento === Groups.control) {
        this.router.navigate([
          'main',
          { outlets: { principal: ['editor', this.assunto.pk(), questao.id] } },
        ]);
        return;
      }

      this.router.navigate([
        'main',
        { outlets: { principal: ['self-instruction', this.assunto.pk(), questao.id] } },
      ]);
    }
  }

  getCorQuestao(questao) {
    if (questao.respondida === true) {
      return '--my-color-var: rgb(103, 202, 103)';
    } else if (questao.respondida === false) {
      return '--my-color-var: rgb(220,20,60)';
    }

    return '--my-color-var: black';
  }
}
