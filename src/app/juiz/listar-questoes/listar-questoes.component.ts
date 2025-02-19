import { Component, OnInit, Input, OnChanges, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import TestCase from 'src/app/model/testCase';
import { Router, ActivatedRoute } from '@angular/router';
import Usuario from 'src/app/model/usuario';
import { LoginService } from '../../login-module/login.service';
import { Groups } from 'src/app/model/experimento/groups';
import { ApresentacaoService } from 'src/app/geral-module/apresentacao.service';
import { Assunto } from 'src/app/model/questoes/assunto';
import { QuestaoProgramacao } from 'src/app/model/questoes/questaoProgramacao';

@Component({
  selector: 'app-listar-questoes',
  templateUrl: './listar-questoes.component.html',
  styleUrls: ['./listar-questoes.component.css'],
})
export class ListarQuestoesComponent implements OnInit, OnChanges, AfterViewInit {
  ngAfterViewInit(): void {
    this.apresentacao.apresentarAssunto(this.usuario);
  }
  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    this.isQuestaoFinalizada();
  }

  @Input('assunto') assunto?;

  selectedQuestao: QuestaoProgramacao;
  items: MenuItem[];
  usuario;

  questoes: QuestaoProgramacao[] = [];
  statusQuestoes: any[];

  constructor(
    private messageService: MessageService,
    private router: Router,
    private login: LoginService,
    private apresentacao: ApresentacaoService
  ) {
    this.statusQuestoes = [];
  }

  ngOnInit() {
    Assunto.getAll().subscribe((assunto) => {
      this.ordernarPorSequencia(this.assunto.questoesProgramacao);
    });

    this.usuario = this.login.getUsuarioLogado();
    this.isQuestaoFinalizada();

    if (this.usuario.perfil == 3) {
      this.items = [
        {
          label: 'Alterar',
          icon: 'pi pi-check',
          command: (event) => this.alterar(this.selectedQuestao),
        },
        {
          label: 'Deletar',
          icon: 'pi pi-times',
          command: (event) => this.deletar(this.selectedQuestao),
        },
      ];
    }
  }

  ordernarPorSequencia(questoes) {
    questoes.sort((a, b) => a.sequencia - b.sequencia);
    this.questoes = questoes;
  }

  visualizar(questao) {
    if (this.login.getUsuarioLogado().grupoExperimento == Groups.control) {
      this.router.navigate([
        'geral/main',
        { outlets: { principal: ['editor', this.assunto.pk(), questao.id] } },
      ]);
      return;
    }

    this.router.navigate([
      'geral/main',
      { outlets: { principal: ['self-instruction', this.assunto.pk(), questao.id] } },
    ]);
  }

  alterar(questao: QuestaoProgramacao) {
    if (questao != undefined) {
      this.router.navigate([
        'geral/main',
        { outlets: { principal: ['cadastro-questao', this.assunto.pk(), questao.id] } },
      ]);
    }
  }

  deletar(questao: QuestaoProgramacao) {
    let index = -1;
    for (let i = 0; i < this.assunto.questoesProgramacao; i++) {
      if (this.assunto.questoeProgramacao[i].id == questao.id) {
        index = i;
        break;
      }
    }

    Assunto.delete(this.assunto.questoesProgramacao[index]).subscribe((resultado) => {
      this.messageDelete();
    });
  }

  messageDelete() {
    this.messageService.add({
      severity: 'error',
      summary: 'Deletado!',
      detail: ' foi excluido do banco de questões',
    });
  }
  messageView() {
    this.messageService.add({
      severity: 'info',
      summary: 'Questao visualizado',
      detail: 'informações sobre a questão',
    });
  }

  isQuestaoFinalizada() {
    if (this.usuario != undefined) {
      for (let i = 0; i < this.assunto.questoesProgramacao.length; i++) {
        if (this.statusQuestoes[this.assunto.questoesProgramacao[i].id] == undefined) {
          this.statusQuestoes[
            this.assunto.questoesProgramacao[i].id
          ] = QuestaoProgramacao.isFinalizada(this.assunto.questoesProgramacao[i], this.usuario);
        }
      }
    }
  }
}
