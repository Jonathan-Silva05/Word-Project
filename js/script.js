function updateUndoRedoButtons() {
  const canUndo = document.queryCommandEnabled('undo');
  const canRedo = document.queryCommandEnabled('redo');

  document.getElementById('undo').disabled = !canUndo;
  document.getElementById('redo').disabled = !canRedo;
}

document.querySelectorAll('.textDocument').forEach(textDocument => {
  textDocument.addEventListener('input', updateUndoRedoButtons);
});

function toggleTheme() {
  const rootElement = document.documentElement; // Acessa o elemento raiz do documento
  const currentTheme = rootElement.getAttribute('data-theme') || (localStorage.getItem('theme') || 'light'); // Obtém o tema atual

  if (currentTheme === 'dark') {
    rootElement.setAttribute('data-theme', 'light'); // Muda para o tema claro
    localStorage.setItem('theme', 'light'); // Armazena o tema claro no armazenamento local
  } else {
    rootElement.setAttribute('data-theme', 'dark'); // Muda para o tema escuro
    localStorage.setItem('theme', 'dark'); // Armazena o tema escuro no armazenamento local
  }
}

function applyInitialTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light'; // Obtém o tema salvo ou padrão para 'light'
  document.documentElement.setAttribute('data-theme', savedTheme);
}

applyInitialTheme(); // Aplica o tema salvo quando a página é carregada

document.addEventListener('DOMContentLoaded', updateUndoRedoButtons);

document.addEventListener('DOMContentLoaded', function() {
  const buttonIdToDivSelector = {
    btnInicial: '.contentInicial',
    btnInserir: '.contentInserir',
    btnDesenhar: '.contentDesenhar',
    btnDesign: '.contentDesign',
    btnLayout: '.contentLayout',
    btnReferencia: '.contentReferencia',
    btnCorresp: '.contentCorresp',
    btnRevisao: '.contentRevisao',
    btnExibir: '.contentExibir',
  };

  function toggleContentDisplay(buttonId) {
    // Esconde todas as divs
    Object.values(buttonIdToDivSelector).forEach(selector => {
      const div = document.querySelector(selector);
      if (div) div.style.display = 'none';
    });

    // Mostra a div correspondente ao botão ativo
    const selector = buttonIdToDivSelector[buttonId];
    const divToShow = document.querySelector(selector);
    if (divToShow) divToShow.style.display = 'flex';

    // Atualiza a classe btnActive
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('btnActive'));
    document.querySelector(`nav button[id="${buttonId}"]`).classList.add('btnActive');
  }

  // Event listener para o botão na div .final
  document.querySelector('.final button').addEventListener('click', () => {
    toggleContentDisplay(''); // Esconde todas as divs
  });

  // Event listener para botões de navegação
  document.querySelectorAll('nav button[id^="btn"]').forEach(button => {
    button.addEventListener('click', () => toggleContentDisplay(button.id));
  });

  // Configuração inicial: Mostra a div do botão ativo ou o estado inicial
  const activeBtnId = document.querySelector('nav button.btnActive')?.id || 'btnInicial';
  toggleContentDisplay(activeBtnId);

  // Função para remover a classe 'active' de todos os títulos
  function removeActiveTitleStyle() {
    document.querySelectorAll('.titleStyle').forEach(titleStyle => {
      titleStyle.classList.remove('active');
    });
  }

  // Adiciona evento de clique que remove 'active' de todos e adiciona ao clicado
  document.querySelectorAll('.titleStyle').forEach(titleStyle => {
    titleStyle.addEventListener('click', function() {
      removeActiveTitleStyle();
      this.classList.add('active');
    });
  });

  var btnScrollUp = document.getElementById('btnScrollUp');
  var btnScrollDown = document.getElementById('btnScrollDown');
  var expandableContainer = document.getElementById('expandableContainer');

  // Função para atualizar o estado dos botões de scroll
  function updateScrollButtons() {
    // Desabilita btnScrollUp se o scrollTop for 0
    btnScrollUp.disabled = expandableContainer.scrollTop === 0;

    // Desabilita btnScrollDown se o scrollTop + altura visível >= altura total do conteúdo
    var maxScrollTop = expandableContainer.scrollHeight - expandableContainer.clientHeight;
    btnScrollDown.disabled = expandableContainer.scrollTop >= maxScrollTop;
  }

  // Inicialmente atualiza o estado dos botões
  updateScrollButtons();

  // Event listener para scrolling up
  btnScrollUp.addEventListener('click', function() {
    expandableContainer.scrollTop -= 55;
    updateScrollButtons();
  });

  // Event listener para scrolling down
  btnScrollDown.addEventListener('click', function() {
    expandableContainer.scrollTop += 55;
    updateScrollButtons();
  });

  // Opcional: Atualizar botões ao scroll manual do usuário
  expandableContainer.addEventListener('scroll', updateScrollButtons);

  // Função para manipulação do texto e outros controles
  const modifyText = (command, defaultUi, value) => {
    document.execCommand(command, defaultUi, value);
  };

  document.getElementById('removeFormatting').addEventListener('click', function() {
    document.execCommand('removeFormat', false, null);

    document.querySelectorAll('.option-button.format.active').forEach(button => {
      button.classList.remove('active');
    });
  });

  // Event listeners para botões de opção e opções avançadas
  const optionButton = document.querySelectorAll(".option-button");
  optionButton.forEach(button => {
    button.addEventListener("click", () => {
      modifyText(button.id, false, null);
      const containerNull = button.closest('.btnsBackOff');
      const containerList = button.closest('.btnList');
      const containerAlign = button.closest('.align');
      const containerFormat = button.closest('.textFormat');
      const containerScriptFormat = button.closest('.btnScriptFormat');
      
      // Função para remover a classe 'active' de todos os botões no container especificado
      function deactivateButtonsInContainer(container) {
        container.querySelectorAll('.option-button').forEach(button => {
          button.classList.remove('active');
        });
      }

      // Se o botão estiver em containerList e não em containerNull, ou for scriptFormat em containerFormat
      if ((containerList && !containerNull) || (containerScriptFormat)) {
        button.classList.toggle("active"); // Toggle para o próprio botão
        // Desativa outros botões se este estiver ativo agora
        if (button.classList.contains("active")) {
          deactivateButtonsInContainer(containerList || containerScriptFormat);
          button.classList.add("active"); // Garante que o botão clicado fique ativo após a desativação dos outros
        }
      } else if (containerAlign && !containerList && !containerNull) { // Caso específico para alinhamento
        deactivateButtonsInContainer(containerAlign);
        button.classList.toggle("active");
      } else if (containerFormat && !button.classList.contains("scriptFormat")) { // Para outros formatos que não são scriptFormat
        button.classList.toggle("active");
      }
    });
  });

  const alignButtons = document.querySelectorAll('.align button');
  const justifyLeftButton = document.getElementById('justifyLeft');
  const clickCount = {};

  // Inicializa o contador de cliques para cada botão de alinhamento
  alignButtons.forEach(button => {
    clickCount[button.id] = 0;
    button.addEventListener('click', function() {
      // Incrementa o contador para o botão clicado
      clickCount[button.id]++;

      // Verifica se este é o segundo clique para qualquer botão
      if (clickCount[button.id] === 2) {
        // Simula o clique no botão justifyLeft
        justifyLeftButton.click();
        // Reseta o contador após a ação
        clickCount[button.id] = 0;
      }
    });
  });

  // Adiciona o evento de clique no botão justifyLeft para resetar os contadores
  justifyLeftButton.addEventListener('click', function() {
    // Reseta os contadores para todos os botões quando justifyLeft é clicado diretamente
    Object.keys(clickCount).forEach(key => {
      clickCount[key] = 0;
    });
  });

  // Função para ordenar o conteúdo da div
  function sortContent() {
    document.querySelectorAll('.textDocument').forEach(div => {
      var lines = div.innerText.split('\n');
      lines.sort();
      div.innerText = lines.join('\n');
    });
  }

  // Adiciona um ouvinte de eventos ao botão para chamar a função de ordenação
  document.getElementById('sortButton').addEventListener('click', sortContent);

  const advancedOptionButton = document.querySelectorAll(".adv-option-button");
  advancedOptionButton.forEach(button => {
    button.addEventListener("change", () => {
      modifyText(button.id, false, button.value);
    });
  });

  // Função para adicionar fontes ao seletor de fontes
  const fontList = ["Arial", "Verdana", "Times New Roman", "Garamond", "Georgia", "Courier New", "cursive"];
  const fontNameSelect = document.getElementById("fontName");
  fontList.forEach(font => {
    let option = document.createElement("option");
    option.value = font;
    option.textContent = font;
    fontNameSelect.appendChild(option);
  });

  function applyInitialFont() {
    const selectedFont = document.getElementById('fontName').value;
    document.querySelector('.contentText').style.fontFamily = selectedFont;
  }

  applyInitialFont();

  // Inicializador para tamanhos de fonte
  const fontSizeSelect = document.getElementById("fontSize");
  for (let i = 1; i <= 7; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    fontSizeSelect.appendChild(option);
  }
  fontSizeSelect.value = 3;  // Definir valor inicial fora do loop

  // Funcionalidade para aumentar e diminuir o tamanho da fonte
  let currentFontSize = parseInt(fontSizeSelect.value); // Começa com o valor médio da seleção de tamanho de fonte

  function updateFontSize() {
    fontSizeSelect.value = currentFontSize;
    document.execCommand('fontSize', false, currentFontSize);
  }

  document.getElementById('increaseFontSize').addEventListener('click', function() {
    if (currentFontSize < 7) {
      currentFontSize++;
      updateFontSize();
    }
  });

  document.getElementById('decreaseFontSize').addEventListener('click', function() {
    if (currentFontSize > 1) {
      currentFontSize--;
      updateFontSize();
    }
  });

  fontSizeSelect.addEventListener('change', function() {
    currentFontSize = parseInt(fontSizeSelect.value);
    updateFontSize();
  });

  document.getElementById('makeTextUppercase').addEventListener('click', function() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return; // Sai se não houver seleção

    // Função para processar cada nó de texto dentro do range
    const processTextNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const isAlreadyUppercase = node.nodeValue === node.nodeValue.toUpperCase();
        node.nodeValue = isAlreadyUppercase ? node.nodeValue.toLowerCase() : node.nodeValue.toUpperCase();
      }
    };

    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;

    // Caminho especial se a seleção estiver toda dentro do mesmo nó de texto
    if (startContainer === endContainer && startContainer.nodeType === Node.TEXT_NODE) {
      processTextNode(startContainer);
    } else {
        // Cria um iterador para percorrer todos os nós dentro do range
      const documentFragment = range.cloneContents();
      const iterator = document.createNodeIterator(documentFragment, NodeFilter.SHOW_TEXT);

      let currentNode;
      while ((currentNode = iterator.nextNode())) {
        processTextNode(currentNode);
      }

        // Substitui o conteúdo do range pelo fragmento processado
      range.deleteContents();
      range.insertNode(documentFragment);
    }

    // Manter a seleção após a transformação
    selection.removeAllRanges();
    selection.addRange(range);
  });

  const textDocument = document.getElementById('textDocument');

  // Garante que textDocument é editável.
  document.querySelectorAll('.textDocument').forEach(textDocument => {
    textDocument.setAttribute('contenteditable', true);
  });

  // Função para verificar e restaurar o estado 'contenteditable' da div textDocument.
  function ensureEditable() {
    const isEditable = textDocument.getAttribute('contenteditable');
    if (isEditable !== 'true') {
      textDocument.setAttribute('contenteditable', true);
    }
  }

  // Verifica periodicamente para garantir que a div permaneça editável.
  setInterval(ensureEditable, 1000);

  // Re-foca na div textDocument após qualquer interação com botões.
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
      // Aguarda qualquer ação de UI concluir antes de re-focar.
      setTimeout(() => {
        if (document.activeElement !== textDocument) {
          textDocument.focus();
        }
      }, 0);
    });
  });

  // Exemplo de função que pode ser chamada após ações específicas para garantir o foco.
  function refocusTextDocument() {
    if (document.activeElement !== textDocument) {
      textDocument.focus();
    }
  }

  let clipboardData = ''; // Armazena o conteúdo da área de transferência

  // Função para copiar o conteúdo selecionado e armazenar
  document.getElementById('copyButton').addEventListener('click', function() {
    clipboardData = window.getSelection().toString();
    navigator.clipboard.writeText(clipboardData).then(() => {
      console.log('Conteúdo copiado para a área de transferência');
    });
  });

  // Função para recortar o conteúdo selecionado e armazenar
  document.getElementById('cutButton').addEventListener('click', function() {
    clipboardData = window.getSelection().toString();
    navigator.clipboard.writeText(clipboardData).then(() => {
      console.log('Conteúdo recortado para a área de transferência');
      document.execCommand('delete'); // Remove o texto selecionado
    });
  });

  // Função para colar o último conteúdo armazenado
  document.getElementById('pasteButton').addEventListener('click', function() {
    navigator.clipboard.readText().then(text => {
      document.execCommand('insertText', false, text);
    });
  });

  // Objeto para armazenar os estilos a serem aplicados
  let styleToApply = {};

  // Mapeia comandos para estados para simplificar a verificação e aplicação
  const styleCommands = [
    'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript',
    'insertUnorderedList', 'insertOrderedList', 'indent', 'outdent',
    'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'
    ];

  // Função para copiar os estilos do texto selecionado
  function copyTextFormat() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      styleCommands.forEach(command => {
        styleToApply[command] = document.queryCommandState(command);
      });
    }
  }

  // Função para aplicar os estilos copiados ao texto selecionado
  function applyTextFormat() {
    Object.keys(styleToApply).forEach(style => {
      if (styleToApply[style]) {
        document.execCommand(style, false, null);
      }
    });
    // Limpa o objeto para futuras operações
    styleToApply = {};
  }

  // Função para alternar estado de ativação da formatação
  function toggleFormatting() {
    const brushButton = document.getElementById('brushButton');
    brushButton.classList.toggle('active');
    if (brushButton.classList.contains('active')) {
      copyTextFormat();
    }
  }

  // Evento de clique para copiar a formatação e alternar estado de ativação
  document.getElementById('brushButton').addEventListener('click', toggleFormatting);

  // Aplica a formatação ao texto quando um elemento dentro de 'textDocument' é clicado
  document.getElementById('textDocument').addEventListener('click', function() {
    if (document.getElementById('brushButton').classList.contains('active')) {
      applyTextFormat();
      document.getElementById('brushButton').classList.remove('active');
    }
  });

  // Função para desabilitar os botões
  function disableAllButtons() {
    document.getElementById('btnScrollUp').disabled = true;
    document.getElementById('btnScrollDown').disabled = true;
  }

  // Função para habilitar os botões
  function enableAllButtons() {
    document.getElementById('btnScrollUp').disabled = false;
    document.getElementById('btnScrollDown').disabled = false;
  }

  // Modificar a função de clique do botão de expansão de títulos para alternar entre expandir e contrair
  function expandTitles() {
    var container = document.getElementById('expandableContainer');
    container.classList.toggle('expanded');
    // Se o container estiver expandido, desativar todos os botões
    if (container.classList.contains('expanded')) {
      disableAllButtons();
    } else { // Caso contrário, habilitar todos os botões
      enableAllButtons();
    }
  }

  // Adicionando o evento de clique ao botão de expansão de títulos
  document.getElementById('expandTitlesBtn').addEventListener('click', expandTitles);

  document.getElementById('mic').addEventListener('click', function() {
    const icon = this.querySelector('i');
    
    // Verifica se o ícone atual é 'fa-microphone-lines'
    const isMicLines = icon.classList.contains('fa-microphone-lines');
    
    // Alterna entre 'fa-microphone-lines' e 'fa-microphone-lines-slash'
    icon.classList.toggle('fa-microphone-lines', !isMicLines);
    icon.classList.toggle('fa-microphone-lines-slash', isMicLines);
  });

  let zoomLevel = 100;
  const zoomable = document.querySelectorAll('.textDocument');
  const zoomSlider = document.getElementById('zoomSlider');
  const zoomIn = document.getElementById('zoomIn');
  const zoomOut = document.getElementById('zoomOut');
  const zoomValue = document.getElementById('value');

  function updateZoom() {
    zoomable.forEach(element => {
      element.style.transform = `scale(${zoomLevel / 100})`;
      const additionalMargin = Math.max(0, (zoomLevel - 100) * 6);
      element.style.margin = `${additionalMargin}px auto`;
    });
    zoomSlider.value = zoomLevel;
    zoomValue.textContent = `${zoomLevel}%`;
  }

  zoomSlider.oninput = () => {
    zoomLevel = parseInt(zoomSlider.value);
    updateZoom();
  };

  zoomIn.onclick = () => {
    if (zoomLevel < 140) {
      zoomLevel += 10;
      updateZoom();
    }
  };

  zoomOut.onclick = () => {
    if (zoomLevel > 60) {
      zoomLevel -= 10;
      updateZoom();
    }
  };

  updateZoom();
});

function updateFormattingButtonsState() {
  const formattingCommands = [
    { command: 'bold', elementId: 'bold' },
    { command: 'italic', elementId: 'italic' },
    { command: 'underline', elementId: 'underline' },
    { command: 'strikethrough', elementId: 'strikethrough' },
    { command: 'superscript', elementId: 'superscript' },
    { command: 'subscript', elementId: 'subscript' },
    { command: 'insertUnorderedList', elementId: 'insertUnorderedList' },
    { command: 'insertOrderedList', elementId: 'insertOrderedList' },
    { command: 'justifyLeft', elementId: 'justifyLeft' },
    { command: 'justifyCenter', elementId: 'justifyCenter' },
    { command: 'justifyRight', elementId: 'justifyRight' },
    { command: 'justifyFull', elementId: 'justifyFull' }
    ];

  document.querySelectorAll('.textDocument').forEach(textDocument => {
    formattingCommands.forEach(({ command, elementId }) => {
      const button = document.getElementById(elementId);
      if (button) {
        if (document.queryCommandState(command)) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      }
    });
  });
}

// Chama a função quando ocorrerem eventos que possam alterar o estado da formatação
document.addEventListener('click', updateFormattingButtonsState);
document.addEventListener('keyup', updateFormattingButtonsState);
document.addEventListener('mouseup', updateFormattingButtonsState);

function updateFontSelectors() {
  const fontNameSelect = document.getElementById("fontName");
  const fontSizeSelect = document.getElementById("fontSize");

  // Obtenha a fonte e o tamanho da fonte no local do cursor ou na seleção
  const fontFamily = document.queryCommandValue("fontName").replace(/['"]/g, ''); // Remove aspas
  const fontSize = document.queryCommandValue("fontSize"); // Retorna 1-7 para o tamanho HTML

  // Atualize o selector de nome de fonte
  fontNameSelect.value = fontFamily || fontNameSelect.options[0].value;

  // Atualiza o selector de tamanho de fonte
  fontSizeSelect.value = fontSize || fontSizeSelect.options[2].value; // 3 é normalmente tamanho médio
}
// Adicionar listeners para atualizar os selectors quando o usuário altera a seleção ou edita o texto
document.addEventListener('click', updateFontSelectors);
document.addEventListener('keyup', updateFontSelectors);
document.addEventListener('mouseup', updateFontSelectors);

// Chama a função na carga da página para definir os valores iniciais
document.addEventListener('DOMContentLoaded', updateFontSelectors);

// Função para atualizar as cores dos inputs de acordo com a seleção
function updateColorInputs() {
  const selection = window.getSelection();
  if (!selection.rangeCount) {
    // Define as cores iniciais se não houver seleção
    document.getElementById('backColor').value = '#FFFC00'; // Amarelo
    document.getElementById('foreColor').value = '#FB0000'; // Vermelho
    return;
  }

  const range = selection.getRangeAt(0);
  const textElement = range.commonAncestorContainer.parentElement;

  // Obter a cor de fundo e de texto do elemento que contém o texto selecionado
  const backgroundColor = getComputedStyle(textElement, null).backgroundColor;
  const textColor = getComputedStyle(textElement, null).color;

  // Atualiza os inputs com as cores encontradas, convertendo de RGB para Hex se necessário
  document.getElementById('backColor').value = rgbToHex(backgroundColor);
  document.getElementById('foreColor').value = rgbToHex(textColor);
}

// Função auxiliar para converter cores RGB para Hex
function rgbToHex(rgb) {
  if (!rgb || rgb.indexOf('rgb') !== 0) return '#FFFFFF'; // Retornar branco como padrão se não for RGB

  var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!parts) return '#FFFFFF';  // Em caso de falha na correspondência, retornar branco

  parts = parts.map(part => parseInt(part).toString(16).padStart(2, '0'));
  return '#' + parts.slice(1).join('');
}

// Adiciona listeners para atualizar as cores quando o usuário altera a seleção ou edita o texto
document.addEventListener('click', updateColorInputs);
document.addEventListener('keyup', updateColorInputs);
document.addEventListener('mouseup', updateColorInputs);

// Chama a função na carga da página para definir as cores iniciais
document.addEventListener('DOMContentLoaded', updateColorInputs);
