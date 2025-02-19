import { inject, TestBed } from "@angular/core/testing";
import { AngularFireModule, FirebaseApp } from "@angular/fire";
import { AngularFirestore, AngularFirestoreModule } from "@angular/fire/firestore";
import { FirebaseConfiguracao } from "src/environments/firebase";
import { Assunto } from "../../sistema-aprendizagem/assunto";
import { DocumentModule } from "../../firestore/document.module";
import { QuestaoProgramacao } from "../../sistema-aprendizagem/questoes/questaoProgramacao";
import Usuario from "../../usuario";
import AtividadeGrupo from "../atividadeGrupo";
import QuestaoColaborativa from "../questaoColaborativa";

describe('Testes de AtividadeGrupo', () => {

    let app: firebase.app.App;
    let afs: AngularFirestore;
  
    beforeAll(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 1200000;
      TestBed.configureTestingModule({
        imports: [
          DocumentModule,
          AngularFireModule.initializeApp(FirebaseConfiguracao),
          AngularFirestoreModule, // .enablePersistence()
        ],
      });
      inject([FirebaseApp, AngularFirestore], (_app: firebase.app.App, _afs: AngularFirestore) => {
        app = _app;
        afs = _afs;
      })();
    });

  it('Deve criar os grupos aleatoriamente', () => {

    let e1 = new Usuario("12345", null, null, null, null, null);
    let e2 = new Usuario("abc", null, null, null, null, null);
    let e3 = new Usuario("def", null, null, null, null, null);
    let e4 = new Usuario("xyz", null, null, null, null, null);
    let e5 = new Usuario("789", null, null, null, null, null);
    let e6 = new Usuario("910", null, null, null, null, null);
    let e7 = new Usuario("432", null, null, null, null, null);

    let atividade = AtividadeGrupo.criarGrupos([e1, e2, e3, e4, e5]);
    expect(atividade.length).toBe(2);

    atividade = AtividadeGrupo.criarGrupos([e1, e2, e3, e4, e5, e6]);
    expect(atividade.length).toBe(3);

    atividade = AtividadeGrupo.criarGrupos([e1, e2, e3, e4, e5, e7]);
    expect(atividade.length).toBe(3);
  });
});
