import Erro from '../erro';
import Submissao from '../../submissao';

export default abstract class ErroSintaxe {
  static erros(submissao: Submissao): Erro[] {
    return [];
  }

  static isLinhaProgramacaoValida(linha) {
    if (linha != undefined && linha != null && linha != '' && typeof linha == 'string') return true;

    return false;
  }

  static faltaDoisPontos(linha) {
    if (this.isLinhaProgramacaoValida(linha)) {
      if (this.isFunction(linha) || this.isConditional(linha) || this.isLoop(linha)) {
        return (linha.match(/:/g) || []).length == 0 ? true : false;
      }

      return false;
    }

    return false;
  }

  static isFunction(linha) {
    return (linha.match(/def/g) || []).length == 0 ? false : true;
  }

  static isChamadaFunction(linha) {
    return (linha.match(/\w+\(.*\)/g) || []).length == 0 ? false : true;
  }

  static isConditional(linha) {
    return (linha.match(/if|else|elif/g) || []).length == 0 ? false : true;
  }

  static isLoop(linha) {
    return (linha.match(/for|while/g) || []).length == 0 ? false : true;
  }
}
