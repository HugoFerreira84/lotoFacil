document.addEventListener("DOMContentLoaded", function () {
    let jogosGerados = [];
    let jogosArquivo = [];
    const numberQuentes = [1, 3, 5, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 23, 25];
    const numberFrios = [2, 4, 6, 7, 8, 14, 15, 21, 22, 24];
    const valorPorAcerto = {
        15: 1500000,
        14: 2000,
        13: 30,
        12: 12,
        11: 6
    };

    // Função para gerar um jogo misturando números quentes e frios
    function generateGame() {
        const game = [];
        // Seleciona 10 números quentes
        while (game.length < 10) {
            const randomNumber = numberQuentes[Math.floor(Math.random() * numberQuentes.length)];
            if (!game.includes(randomNumber)) {
                game.push(randomNumber);
            }
        }
        // Seleciona 5 números frios
        while (game.length < 15) {
            const randomNumber = numberFrios[Math.floor(Math.random() * numberFrios.length)];
            if (!game.includes(randomNumber)) {
                game.push(randomNumber);
            }
        }
        return game.sort((a, b) => a - b); // Retorna o jogo ordenado
    }

    // Atualizar o valor gasto por jogo ao alterar o número de jogos
    document.getElementById('gameCount').addEventListener('change', function () {
        const gameCount = parseInt(this.value);
        const costPerGame = gameCount === 5 ? 3.00 : 3.00; // Exemplo de valores para 5 ou 10 jogos
        document.getElementById('gameCost').textContent = costPerGame.toFixed(2);
    });

    // Gerar jogos e exibir
    document.getElementById('generateGames').addEventListener('click', () => {
        const gameCount = parseInt(document.getElementById('gameCount').value);
        jogosGerados = [];
        const gameList = document.getElementById('gameList');
        gameList.innerHTML = ''; // Limpa a lista anterior

        // Gerar a quantidade de jogos baseada na seleção
        for (let i = 0; i < gameCount; i++) {
            const game = generateGame();
            jogosGerados.push(game);
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `Jogo ${i + 1}: ${game.join(', ')}`;
            gameList.appendChild(listItem);
        }

        document.getElementById('downloadGames').disabled = false;
        document.getElementById('checkResults').disabled = false;

        // Exibindo o Swal de sucesso
        Swal.fire({
            icon: 'success',
            title: 'Jogos Gerados!',
            text: `${gameCount} jogos foram gerados com sucesso!`,
        });

        // Calculando o valor investido e exibindo no resumo
        const valorInvestido = gameCount * 3.00; // Custo fixo de 3 reais por jogo
        const summaryDiv = document.getElementById('summary');
        summaryDiv.innerHTML = `
            <p>Valor investido: <b>R$ ${valorInvestido.toFixed(2)}</b></p>
        `;
    });

    // Baixar jogos em um arquivo .txt
    document.getElementById('downloadGames').addEventListener('click', () => {
        let content = jogosGerados.map(jogo => jogo.join(', ')).join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'jogos_lotofacil.txt';
        link.click();

        Swal.fire({
            icon: 'info',
            title: 'Download Iniciado',
            text: 'Os jogos foram baixados em um arquivo .txt!',
        });
    });

    // Verificar resultados
    document.getElementById('checkResults').addEventListener('click', () => {
        const drawNumbers = document.getElementById('drawNumbers').value
            .split(',')
            .map(num => parseInt(num.trim()))
            .filter(num => !isNaN(num));

        if (drawNumbers.length !== 15) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Por favor, insira exatamente 15 números válidos separados por vírgula.',
            });
            return;
        }

        const jogosParaVerificar = [...jogosGerados, ...jogosArquivo];
        verificarJogos(jogosParaVerificar, drawNumbers);
    });

    // Função para verificar os jogos e exibir os acertos
    function verificarJogos(jogos, drawNumbers) {
        const resultList = document.getElementById('resultList');
        resultList.innerHTML = ''; // Limpa os resultados anteriores

        let totalAcertos = {
            15: 0,
            14: 0,
            13: 0,
            12: 0,
            11: 0
        };

        let totalArrecadado = 0;

        jogos.forEach((jogo, index) => {
            const matches = jogo.filter(num => drawNumbers.includes(num)).length;

            if (matches >= 11) {
                totalAcertos[matches] += 1;
                totalArrecadado += valorPorAcerto[matches];
            }

            const resultItem = document.createElement('li');
            resultItem.className = `list-group-item ${matches >= 11 ? 'list-group-item-success' : ''}`;
            resultItem.textContent = `Jogo ${index + 1}: ${jogo.join(', ')} - Acertos: ${matches}`;
            resultList.appendChild(resultItem);
        });

        // Exibir o resumo dos resultados na div #summary
        let message = '';
        for (let acertos in totalAcertos) {
            if (totalAcertos[acertos] > 0) {
                message += `<p>${acertos} acertos: ${totalAcertos[acertos]} jogos - R$ ${(totalAcertos[acertos] * valorPorAcerto[acertos]).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>`;
            }
        }

        document.getElementById('summary').innerHTML = `
            <p>Total arrecadado: <b>${totalArrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b></p>
            ${message || '<p>Nenhum jogo com 11 ou mais acertos.</p>'}
        `;

        // Exibindo o Swal de sucesso após a verificação
        Swal.fire({
            icon: 'success',
            title: 'Resultados Verificados!',
            text: 'Os resultados dos jogos foram verificados com sucesso!',
        });
    }

    // Limpar tudo
    document.getElementById('clearAll').addEventListener('click', () => {
        document.getElementById('gameList').innerHTML = '';
        document.getElementById('resultList').innerHTML = '';
        document.getElementById('drawNumbers').value = '';
        jogosGerados = [];
        jogosArquivo = [];

        document.getElementById('downloadGames').disabled = true;
        document.getElementById('checkResults').disabled = true;

        Swal.fire({
            icon: 'success',
            title: 'Limpeza Completa',
            text: 'Todos os campos e listas foram limpos!',
        });
    });
    // Função de Impressão
    document.getElementById('printGames').addEventListener('click', () => {
        const gameList = document.getElementById('gameList');
        let content = '<h1 style="text-align: center;">Jogos Gerados</h1>';

        // Para cada jogo gerado
        jogosGerados.forEach((game, index) => {
            content += `<h2>Jogo ${index + 1}</h2>`;
            content += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">';
            content += '<tr>';

            // Organiza os números do jogo em 5 colunas
            game.forEach((num, idx) => {
                // Cada número será inserido dentro de uma célula de tabela
                content += `<td style="width: 20%; text-align: center; padding: 10px; border: 1px solid #000; font-size: 18px; font-weight: bold;">${num}</td>`;
                // A cada 5 números, cria uma nova linha para a próxima coluna
                if ((idx + 1) % 5 === 0 && idx !== 0) {
                    content += '</tr><tr>';
                }
            });

            content += '</tr>';
            content += '</table>';
        });

        // Criar uma nova janela para imprimir
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Imprimir Jogos</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('body { font-family: Arial, sans-serif; font-size: 14px; margin: 20px; }');
        printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }');
        printWindow.document.write('td { width: 20%; text-align: center; padding: 10px; border: 1px solid #000; font-size: 18px; font-weight: bold; }');
        printWindow.document.write('h1, h2 { text-align: center; }');
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(content);  // Adiciona os jogos ao conteúdo
        printWindow.document.write('</body></html>');

        printWindow.document.close();
        printWindow.print();  // Inicia a impressão
    });



});
