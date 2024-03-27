/*
document.addEventListener('keydown', function(event) {
  // Verifica se a tecla 'Ctrl' está pressionada e a tecla pressionada não é 'Control'
  if (event.ctrlKey && event.key !== 'Control') {
    // Captura a tecla pressionada
    let tecla = event.key;

    // Previne a ação padrão para a combinação de teclas
    event.preventDefault();

    // Exibe um alerta com a tecla pressionada juntamente com o 'Ctrl'
    alert('Ctrl + ' + tecla.toUpperCase() + ' foi pressionado!');
  }
});
*/


document.addEventListener('keydown', function(event) {
  if (event.ctrlKey) {
    switch (event.key.toLowerCase()) {
    case 'a':
      abreArquivoExistente();
      break;
    case 'b':
      convertToPDFWithText();
      break;
    case 'c':
      copiaTexto();
      break;
    case 'd':
      alteraFormatacaoCaracteres();
      break;
      // Adicione mais casos conforme necessário
    }
  } else if (event.altKey && event.ctrlKey) {
    switch (event.key.toLowerCase()) {
    case 'd':
      insereNotaFim();
      break;
    case 'f':
      insereNotaRodape();
      break;
    case 's':
      divideJanelaDocumento();
      break;
      // Adicione mais casos conforme necessário
    }
  } else if (event.altKey && event.shiftKey) {
    switch (event.key.toLowerCase()) {
    case 'c':
      removeDivisaoJanela();
      break;
      // Adicione mais casos conforme necessário
    }
  }
  // Prevenir ação padrão para combinações específicas
  if (event.ctrlKey || (event.altKey && event.ctrlKey) || (event.altKey && event.shiftKey)) {
    event.preventDefault();
  }
});

function abreArquivoExistente() {
  alert('Abrir arquivo existente');
}

function salvaDocumento() {
  alert('Salvar documento');
}

function copiaTexto() {
  alert('Copiar texto');
}

function alteraFormatacaoCaracteres() {
  alert('Alterar formatação dos caracteres');
}
// Defina mais funções conforme necessário



async function convertToPDFWithText() {
  // Solicita o nome do arquivo antes de iniciar a conversão
  let fileName = await promptForFileName();
  if (!fileName) {
    // Se o fileName for nulo ou vazio, o usuário cancelou ou não forneceu um nome, então não prosseguir.
    return;
  }

  const element = document.getElementById('textDocument');
  // Inicia a conversão com o nome do arquivo fornecido
  html2pdf().from(element).set({
    margin: 0,
    filename: `${fileName}.pdf`,
    html2canvas: { scale: 1 },
    jsPDF: {orientation: 'portrait', unit: 'in', format: 'letter', compressPDF: true}
  }).save();
}

async function promptForFileName() {
  let fileName = null; // Inicialize como null para detectar o clique em "Cancelar"
  // Continua pedindo um nome até que um valor válido seja fornecido ou o usuário clique em "Cancelar"
  while (fileName === null) {
    fileName = prompt("Por favor, insira o nome do arquivo:");

    if (fileName) {
      // Um nome foi fornecido
      return fileName; // Retorna o nome fornecido
    } else if (fileName === "") {
      // Nenhum nome foi fornecido; alerte o usuário.
      alert("Você deve fornecer um nome para o arquivo antes de salvá-lo.");
      fileName = null; // Reset para continuar o loop.
    } else {
      // O usuário clicou em "Cancelar"; retorna nulo.
      return null;
    }
  }
}


