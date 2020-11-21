import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { FirebaseConfiguracao } from 'src/environments/firebase';
import { LoginModule } from './login-module/login.module';
import { MainComponent } from './geral-module/main/main.component';
import { AnalyticsModule } from './analytics-module/analytics.module';
import { GeralModuleModule } from './geral-module/geral-module.module';
import { JuizModule } from './juiz/juiz.module';
import { SrlModule } from './srl/srl.module';
import { AuthGuard } from './guards/auth.guard';
import { CsclModule } from './cscl/cscl.module';
import { BrowserModule } from '@angular/platform-browser';
import { DocumentModule } from './model/firestore/document.module';
import { TurmaModule } from './turma/turma.module';
import { TurmaGuard } from './guards/acessoTurma.guard';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExperimentoModule } from './experimento/experimento.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LivroModule } from './livro/livro.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { GameBasedLearningModule } from './game-based-learning/game-based-learning.module';
import { ParsonProblemModule } from './parson-problem/parson-problem.module';
import { GamificationModule } from './gamification/gamification.module';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AdminModule } from './admin/admin.module';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AppComponent, MainComponent],
  imports: [
    AdminModule,
    SrlModule,
    GamificationModule,
    ButtonModule,
    ToolbarModule,
    GameBasedLearningModule,
    LivroModule,
    TurmaModule,
    ExperimentoModule,
    CsclModule,
    DocumentModule,
    GeralModuleModule,
    AnalyticsModule,
    LoginModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(FirebaseConfiguracao),
    AngularFirestoreModule,
    InputTextModule,
    MenubarModule,
    BrowserAnimationsModule,
    AngularFireAuthModule,
    SharedPipesModule,
    ParsonProblemModule,
    ConfirmDialogModule
  ],
  providers: [AuthGuard, TurmaGuard, MessageService, ConfirmationService],
  bootstrap: [AppComponent],
  exports: [EscapeHtmlPipe],
})
export class AppModule {}
