import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewChecked,
  AfterViewInit,
  OnChanges,
} from "@angular/core";
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from "@angular/common/http";
import Submissao from "src/app/model/submissao";
import Editor from "src/app/model/editor";
import { LoginService } from "src/app/login-module/login.service";

import { catchError, retry, timeout } from "rxjs/operators";

/**
 * Executa um javascript ide.js para acoplar o editor VStudio.
 */
// declare var editor: any;
declare var monaco: any;
declare function carregarIde(
  readOnly,
  callback,
  instance,
  callbackOnEditorLoad,
  codigo
): any;

@Component({
  selector: "app-editor-programacao",
  templateUrl: "./editor-programacao.component.html",
  styleUrls: ["./editor-programacao.component.css"],
})
export class EditorProgramacaoComponent implements AfterViewInit, OnChanges {
  URL = "http://35.208.64.26:8000/";
  // URL = "http://localhost:8000/"

  processandoSubmissao;

  editor; // instância do Mônaco Editor. Carregado por meio do arquivo ide.js

  @Input()
  console;
  @Input()
  questao;
  @Input()
  assunto;
  @Input()
  liteMode; // define que o editor executará em um modo de aparência menor.
  @Input()
  modoVisualizacao;

  @Input() set submissao(value) {
    this._submissao = value;
    this.atualizarEditorComSubmissao();
  }

  get submissao() {
    return this._submissao;
  }

  _submissao;

  editorCodigo?: Editor;

  @Output()
  onError: EventEmitter<any>;
  @Output()
  onSubmit: EventEmitter<any>;
  @Output()
  onServidorError: EventEmitter<any>;
  @Output()
  onVisualization: EventEmitter<any>;

  constructor(private http: HttpClient, public login: LoginService) {
    this.onError = new EventEmitter();
    this.onSubmit = new EventEmitter();
    this.onVisualization = new EventEmitter();
    this.onServidorError = new EventEmitter();
    this.processandoSubmissao = false;
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.atualizarEditorComSubmissao();
  }

  ngAfterViewInit(): void {
    this.editorCodigo = Editor.getInstance();
    if (
      this.questao != null &&
      this.questao.algoritmoInicial !== null &&
      this.questao.algoritmoInicial !== "" &&
      Array.isArray(this.questao.algoritmoInicial)
    ) {
      this.editorCodigo.codigo = this.questao.algoritmoInicial.join("\n");
    } else {
      this.editorCodigo.codigo = "";
    }

    const usuario = this.login.getUsuarioLogado();
    carregarIde(
      false,
      null,
      this,
      this.carregarEditor,
      this.editorCodigo.codigo
    );
  }

  atualizarEditorComSubmissao() {
    if (this._submissao != null) {
      this.editorCodigo.codigo = this._submissao["codigo"];
      if (this.editor != null) {
        this.editor.setValue(this.editorCodigo.codigo);
      }
    }
  }

  carregarEditor(editorProgramacaoComponentInstance, editor) {
    editorProgramacaoComponentInstance.editor = editor;
    editorProgramacaoComponentInstance.atualizarEditorComSubmissao();
  }

  visualizarExecucacao(modoVisualizacao, trace) {
    this.onVisualization.emit({
      modoVisualizacao: modoVisualizacao,
      trace: trace,
    });
  }

  voltarParaModoExecucao() {
    this.onVisualization.emit(false);
  }

  visualizar(status) {
    if (status) {
      this.prepararSubmissao();
      this.submissao.save().subscribe((resultado) => {
        this.submissao = resultado;
        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
        };
        // TODO: definir um timedout
        const json = this.submissao.construirJson(this.questao, "visualização");

        this.http.post(this.URL + "codigo/", json, httpOptions).subscribe(
          (resposta) => {
            const respostaParser: string = String(resposta).replace(
              "script str",
              ""
            );

            this.visualizarExecucacao(true, JSON.parse(respostaParser)); // TODO:
          },
          (err) => {
            // this.prepararMensagemExceptionHttp(err);
          }
        );
      });
    } else {
      this.editorCodigo.limparCores();
      this.visualizarExecucacao(false, null);
    }
  }

  gerenciarErro(erro){

  }

  executar() {
    // this.pausaIde = true; // TODO: esse código está comentado, pois a função de pausar a IDE durante o envio não está funcionando.

    const submissao = this.prepararSubmissao();

    if (submissao.validar()) {
      // this.submissao.analisarErros(); // TODO: esse código está comentado, pois a função de analisar os erros do estudante está com bugs.

      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
      };

      /*if (this.submissao.hasErrors()) {
        this.destacarErros(this.submissao);
        this.onError.emit(this.submissao);
      } else {*/
      const tipoExecucao = Editor.getTipoExecucao(this.questao);

      const json = submissao.construirJson(this.questao, tipoExecucao);

      const url = this.URL + "codigo/";
      this.processandoSubmissao = true;

      this.http
        .post<any>(url, json, httpOptions)
        .pipe(timeout(6000))
        .subscribe({
          next: (resposta) => {
            submissao
              .processarRespostaServidor(resposta)
              .subscribe((resultado) => {
                this.submissao = resultado;
                this.onSubmit.emit(this._submissao);
                this.editorCodigo.limparCores();
              });
          },
          error: (erro) => {
            if (erro.name === 'TimeoutError' || erro.error.mensagem == null) {
              this.onServidorError.emit(erro);
            } else {
              submissao
                .processarErroServidor(erro.error.mensagem)
                .subscribe((resultado) => {
                  this.submissao = resultado;
                  this.destacarErros(this.submissao);
                  this.onError.emit(this._submissao);
                });
            }
          },
          complete: () => {
            this.processandoSubmissao = false;
          },
        });
    } else {
      this.processandoSubmissao = false;
      alert("Não há algoritmo a ser executado.");
    }
  }

  /**
   * Constrói uma submissão que será salva no banco de dados.
   */
  prepararSubmissao() {
    this.editorCodigo.codigo = this.editor.getValue();
    const submissao = new Submissao(
      null,
      this.editor.getValue(),
      this.login.getUsuarioLogado(),
      this.questao
    );
    return submissao;
  }

  /**
   * Salva o código do estudante automaticamente a cada 5 minutos.
   * OBS: Não está em uso, será refatorado para evitar overhead no BD.
   */
  salvarAutomaticamente() {
    const __this = this;
    setInterval(function () {
      __this.prepararSubmissao();
      this.submissao.save().subscribe((resultado) => {
        // TODO: mostrar mensagem que o código foi salvo automaticamente.
      });
    }, 300000);
  }

  destacarErros(erros) {
    this.editorCodigo.limparCores();
    this.editorCodigo.destacarErros(this.submissao.erros);
  }
}
