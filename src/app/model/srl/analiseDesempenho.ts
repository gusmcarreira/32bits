import FrequenciaErro from '../errors/analise-compilacao/frequenciaErro';
import { CategoriaErro } from '../errors/enum/categoriasErro';

export default class AnaliseDesempenhoEstudante {
  static analisarDesempenho(frequenciaErros: FrequenciaErro[]) {
    if (frequenciaErros != null && Array.isArray(frequenciaErros) && frequenciaErros.length > 0) {
      const categoria = frequenciaErros[0].categoriaErro;
      if (categoria == CategoriaErro.nameError) {
        return "O erro que você mais cometeu durante os exercícios foi <span style='font-weight:bold'>NameError</span>. Isso significa que você está com alguma dificuldade com a criação e/ou uso de variáveis. As principais causas desse tipo de erro são: <br/> a) Declarar o valor de uma variável com dois sinais de igualdade, quando deveria utilizar apenas um. Para declarar uma variável de nome 'nomeDesenvolvedor' do tipo string, o correto seria: nomeDesenvolvedor = 'Leonardo'.; ou <br/> b) Você está tentando utilizar variáveis que ainda não foram criadas. Lembre-se, somente é possível utilizar o valor de uma variável após a sua criação (atribuição de valor), antes disso ela não existe. ";
      } else if (categoria == CategoriaErro.syntaxError) {
        return `O erro que você mais cometeu durante os exercícios foi <span style='font-weight:bold'>Syntaxerror</span>. Isto pode ter acontecido por que você cometeu um dos seguintes erros na programação: <br/> <br/>
                a) <span style='font-weight:bold'>Problema:</span> Utilizou apenas um sinal de igualdade na comparação de uma condição. Exemplo: if nomeDesenvolvedor = 'Leonardo':<br/>
                   <span style='font-weight:bold'>Comentário:</span> Quando dois valores ou variáveis serão comparados em uma condição devemos utilizar dois sinais de igualdade, por exemplo: if nomeDesenvolvedor == 'Leonardo':. ou <br/>
                   <span style='font-weight:bold'>Solução:</span> if nomeDesenvolvedor == 'Leonardo':. <br/>
                   ou <br/>
                b) <span style='font-weight:bold'>Problema:</span> Ao fazer uma comparação em uma condição você esqueceu de informar um dos sinais da comparação (maior que, menor que, igualdade, etc). Exemplo: if nomeDesenvolvedor leonardo:<br/> ou <br/>
                c) <span style='font-weight:bold'>Problema:</span> Você tentou utilizar um recurso da linguagem de programação, como if ou for, mas escreveu errado esses comandos. ou <br/>
                d) <span style='font-weight:bold'>Problema:</span> Esqueceu de utilizar parêntesis ou aspas, por exemplo, ao declarar uma string: nomeDesenvolvedor = Leonardo ou ao chamar uma função: executarFuncao(
                   <span style='font-weight:bold'>Solução:</span> No exemplo faltam as aspas, pois o valor Leonardo é uma string, e na chamada da função faltou um parêntesis de fechamento )"`;
      } else if (categoria == CategoriaErro.typeError) {
        return "O erro que você mais cometeu durante os exercícios foi <span style='font-weight:bold'>TypeError</span>. Ele ocorre, dentre outros motivos, quando você tenta realizar uma operação matemática em variáveis que não são números, por exemplo: '2'+2, está incorreto, pois o valor '2' representa uma string e não um número.";
      } else if (categoria == CategoriaErro.identationError) {
        return "O erro que você mais cometeu durante os exercícios foi <span style='font-weight:bold'>IndentantionError</span>. Ele ocorre pela falta de indentação (espaçamento antes do código). Lembre-se, códigos dentro de uma condição, função ou repetição, precisam ter um espaçamento de 4 espaços (ou um TAB).";
      }
    }
  }
}
