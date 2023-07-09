export function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

export function jogo (parOuImparJogador,numeroJogador){
   const numeroPc = getRndInteger(0, 10)
   let parOuImparComputador = ""
   parOuImparJogador==="par"? parOuImparComputador="impar" : parOuImparComputador="par"

   const soma = numeroPc + numeroJogador;
   let resultado = ""
    if (soma%2===0){
        if (parOuImparJogador==="par"){resultado = "ganhou"}
        else{resultado = "perdeu"}
    }
    else{
        if (parOuImparJogador==="par"){resultado = "perdeu"}
        else{resultado = "ganhou"}
    }
    
    console.log(`Você escolheu ${parOuImparJogador} e o computador escolheu ${parOuImparComputador}. O resultado foi ${soma}. Você ${resultado}!`)
}

jogo(process.argv[2],Number(process.argv[3]))
