let data = new Date()
let hora = data.getHours()
const saudacao = document.querySelector('#welcome')

const saudarUsuário = () => {
    if (hora > 0 && hora < 12) {
        saudacao.innerHTML = 'Bom dia!'
    } else if (hora >= 12 && hora < 18) {
        saudacao.innerHTML = 'Boa tarde!'
    } else {
        saudacao.innerHTML = 'Boa noite!'
    }
}

saudarUsuário()

const valorDaTransacao = document
    .querySelector('#transaction_value')
const selecionarConta = document
    .querySelector('#contas')
const ganho = document
    .querySelector('#ganho')
const despesa = document
    .querySelector('#despesa')
const botaoTransacoes = document
    .querySelector('#transaction_submit')

const transacoes = []

const contas = [
    { id: 0, saldo: 0 },
    { id: 1, saldo: 0 },
    { id: 2, saldo: 0 },
]

const checarInputs = () => {
    if (valorDaTransacao.value && selecionarConta.value
        && (ganho.checked || despesa.checked)) {
        botaoTransacoes.removeAttribute('disabled')
    } else {
        botaoTransacoes.setAttribute('disabled', true)
    }
}

botaoTransacoes
    .addEventListener('click',
        () => registrarTransacao())

const registrarTransacao = () => {
    let valor = Number(valorDaTransacao.value)
    if (valor == 0) {
        alert('O valor 0 não é aceito!')
        valorDaTransacao.value = ''
        checarInputs()
        return
    }
    let transacaoTipo
    let contaNome = Number(selecionarConta.value)
    if (ganho.checked) {
        transacaoTipo = 'Ganho'
    } else if (despesa.checked) {
        transacaoTipo = 'Despesa'
        valor = valor * -1
    }
    transacoes.push({
        valor: valor,
        tipo: transacaoTipo,
        id: contas[contaNome].id
    })
    calcularSaldoDaConta(contaNome)
    valorDaTransacao.value = ''
    definirSaldoAtual()
    criarTransacaoDOM()
    limitarTransacoesDOM()
    checarInputs()
}

const calcularSaldoDaConta = contaNome => {
    const transacoesFiltradas = transacoes
        .filter(transacao =>
            transacao.id == contaNome)
    const valoresCapturados = transacoesFiltradas
        .map(transacao =>
            transacao.valor)
    const saldoFinal = valoresCapturados
        .reduce((acc, valor) =>
            acc + valor)
    contas[contaNome].saldo = saldoFinal
    alterarSaldoDaContaDOM(saldoFinal, contaNome)
}

const saldosDOM = document
    .querySelectorAll('.account_saldo')

const alterarSaldoDaContaDOM =
    (valor, contaNome) => {
        let valorString = valor < 10 & valor > -10
            ? '0' + Math.abs(valor).toFixed(2)
            : Math.abs(valor).toFixed(2)
        if (valor < 0) {
            saldosDOM[contaNome].innerHTML =
                '- R$ ' + valorString
        } else {
            saldosDOM[contaNome].innerHTML =
                'R$ ' + valorString
        }
    }

const saldoTotalDOM = document
    .querySelector('#current_balance')

const definirSaldoAtual = () => {
    const saldosDasContas = contas
        .map(conta => conta.saldo)
    const saldoTotal = saldosDasContas
        .reduce((acc, saldo) => acc + saldo)
    let saldoTotalString = saldoTotal < 10 & saldoTotal > -10
        ? '0' + Math.abs(saldoTotal).toFixed(2)
        : Math.abs(saldoTotal).toFixed(2)
    if (saldoTotal < 0) {
        saldoTotalDOM.innerHTML =
            '- R$ ' + saldoTotalString
    } else {
        saldoTotalDOM.innerHTML =
            'R$ ' + saldoTotalString
    }
}

const ultimasTransacoes = document
    .querySelector('#last_transactions')

// FIXME:
const criarTransacaoDOM = () => {
    const semTransacoes = document
        .querySelector('#not_transactions')
    if (transacoes.length == 1) {
        ultimasTransacoes
            .removeChild(semTransacoes)
    }
    const transacaoDOM = document
        .createElement('li')
    const tipoDaTransacaoDOM =
        transacoes[transacoes.length - 1].tipo
    const valorDaTransacaoDOM =
        transacoes[transacoes.length - 1].valor
    const transacaoContaDOM =
        () => {
            if (transacoes[transacoes.length - 1].id
                == 0) return 'Carteira'
            else if (transacoes[transacoes.length - 1].id
                == 1) return 'Conta Corrente'
            else if (transacoes[transacoes.length - 1].id
                == 2) return 'Poupança'
        }
    let valorDaTransacaoDOMAbsoluto =
        Math.abs(valorDaTransacaoDOM).toFixed(2)
    if (tipoDaTransacaoDOM == 'Despesa') {
        transacaoDOM.classList.add('despesa')
        valorDaTransacaoDOMAbsoluto =
            '- R$ ' + valorDaTransacaoDOMAbsoluto
    }
    else {
        transacaoDOM.classList.add('ganho')
        valorDaTransacaoDOMAbsoluto =
            '+ R$ ' + valorDaTransacaoDOMAbsoluto
    }
    transacaoDOM.innerHTML =
        `<div>
        <h4>${tipoDaTransacaoDOM}</h4>
        <h5>${transacaoContaDOM()}</h5>
    </div>
    <h3>${valorDaTransacaoDOMAbsoluto}</h3>`
    ultimasTransacoes.appendChild(transacaoDOM)
}

const limitarTransacoesDOM = () => {
    let ultimasTransacoesArray =
        [...ultimasTransacoes.children]
    if (ultimasTransacoesArray.length > 3) {
        let ultimasTresTransacoes =
            ultimasTransacoesArray.slice(-3)
        ultimasTransacoes
            .replaceChildren(...ultimasTresTransacoes)
    }
}