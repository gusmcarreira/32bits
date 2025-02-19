import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { TestBed, inject } from '@angular/core/testing';
import { DocumentModule } from '../firestore/document.module';
import { AngularFireModule, FirebaseApp } from '@angular/fire';
import { FirebaseConfiguracao } from 'src/environments/firebase';
import { Assunto } from '../sistema-aprendizagem/assunto';
import { QuestaoProgramacao } from '../sistema-aprendizagem/questoes/questaoProgramacao';
import { AutoInstrucao } from '../srl/autoInstrucao';

describe('Testes de Auto instrução', () => {
  let app: firebase.app.App;
  let afs: AngularFirestore;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1200000;
    TestBed.configureTestingModule({
      imports: [
        DocumentModule,
        AngularFireModule.initializeApp(FirebaseConfiguracao),
        AngularFirestoreModule, //.enablePersistence()
      ],
    });
    inject([FirebaseApp, AngularFirestore], (_app: firebase.app.App, _afs: AngularFirestore) => {
      app = _app;
      afs = _afs;
    })();
  });

  /*it("deve salvar uma Autoinstrução", (done)=>{
        let e = new Estudante("12345", null);
        let q = new Questao("123456", "nomeCurto", "enunciado", Dificuldade.facil, 1, [], [], null);
        let autoInstrucao = new AutoInstrucao(null, e, q, "problema", "variaveis", "condicoes", "repeticoes", "funcoes", "vetores");
        autoInstrucao.save().subscribe(resposta=>{
            expect(resposta["id"]).toBeDefined();
            AutoInstrucao.deleteAll().subscribe(resposta=>{
                done();
            })
        })
    })

    it("Deve gerar um document a partir de um objeto", ()=>{
        let e = new Estudante("12345", null);
        let q = new Questao("123456", "nomeCurto", "enunciado", Dificuldade.facil, 1, [], [], null);
        let autoInstrucao = new AutoInstrucao(null, e, q, "problema", "variaveis", "condicoes", "repeticoes", "funcoes", "vetores");
        expect(autoInstrucao.objectToDocument()).toEqual({estudanteId:"12345", questaoId:"123456", problema:"problema", variaveis:"variaveis", condicoes:"condicoes", repeticoes:"repeticoes", funcoes:"funcoes", vetores:"vetores"})
    })*/

  it('Deve validar se uma autoinstrução é válida, ou seja, está com os dados preenchidos corretamente', () => {
    let ac: Assunto = new Assunto(null, 'Condições');
    let af: Assunto = new Assunto(null, 'Funções');
    let ar: Assunto = new Assunto(null, 'Repetições');
    let q: QuestaoProgramacao = new QuestaoProgramacao(null, '', '', null, '', [ac, af], null, null, null);
    ar.questoesProgramacao.push(q);
    let autoinstrucao1: AutoInstrucao = new AutoInstrucao(null, null, q, '', '', '', '', '', '');
    expect(autoinstrucao1.validar(ar)).toBeFalse();
    let autoinstrucao2: AutoInstrucao = new AutoInstrucao(
      null,
      null,
      q,
      'a',
      'b',
      'c',
      'd',
      'e',
      'f'
    );
    expect(autoinstrucao2.validar(ar)).toBeTrue();

    let q2: QuestaoProgramacao = new QuestaoProgramacao(null, '', '', null, '', [ac], null, null, null);
    ar.questoesProgramacao.push(q2);

    let autoinstrucao3: AutoInstrucao = new AutoInstrucao(
      null,
      null,
      q2,
      'a',
      'b',
      'c',
      'd',
      '',
      ''
    );
    expect(autoinstrucao3.validar(ar)).toBeTrue();

    let autoinstrucao4: AutoInstrucao = new AutoInstrucao(
      null,
      null,
      q2,
      'a',
      'b',
      'c',
      '',
      '',
      ''
    );
    expect(autoinstrucao4.validar(ar)).toBeFalsy();
  });
});
