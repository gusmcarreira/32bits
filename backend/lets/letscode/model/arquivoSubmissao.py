import random
import string
import os


class ArquivoSubmissao():

    def __init__(self, codigo):
        self.arquivo = self.criarArquivo()
        self.escreverCodigoNoArquivo(codigo)

    def criarArquivo(self):
        nomeArquivo = self.gerarNomeArquivo()
        arquivo = open(nomeArquivo,"w+")

        return arquivo

    def nome(self):
        return self.arquivo.name

    def apagarArquivo(self):
        #TODO: verificar se o arquivo existe
        if self.arquivo != None:
            self.arquivo.close()
            try:
                os.remove(os.path.realpath(self.arquivo.name))
                self.arquivo = None
            except (OSError):
                print("disparou")

    def is_arquivo_valido(self):
        if self.arquivo == None:
            return False

        return True
    
    def escreverCodigoNoArquivo(self, codigo):
        codigo = codigo.split("\n")

        for linha in codigo:
            
            # TODO: verificar antes se o arquivo está aberto
            self.arquivo.write(linha+"\n")

        self.arquivo.flush()

        print(self.arquivo.read())
        

        return True

    # obtido em: https://stackoverflow.com/questions/2257441/random-string-generation-with-upper-case-letters-and-digits-in-python
    def gerarNomeArquivo(self, size=6, chars=string.ascii_uppercase + string.digits):
        return ''.join(random.choice(chars) for _ in range(size))+".py"