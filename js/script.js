function updateUndoRedoButtons() {
  const canUndo = document.queryCommandEnabled('undo');
  const canRedo = document.queryCommandEnabled('redo');

  document.getElementById('undo').disabled = !canUndo;
  document.getElementById('redo').disabled = !canRedo;
}

document.getElementById('textDocument').addEventListener('input', updateUndoRedoButtons);
document.addEventListener('DOMContentLoaded', updateUndoRedoButtons);


document.addEventListener('DOMContentLoaded', function() {
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

    document.getElementById('backColor').value = '#FFFF00'; 
    document.getElementById('foreColor').value = '#FF0000';
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

  // Definir as cores iniciais para foreColor e backColor
  document.getElementById('backColor').value = '#FFFF00'; // Branco para backColor
  document.getElementById('foreColor').value = '#FF0000'; // Preto para foreColor

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

  // Inicializador para tamanhos de fonte
  const fontSizeSelect = document.getElementById("fontSize");
  for (let i = 1; i <= 7; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    fontSizeSelect.appendChild(option);
    fontSizeSelect.value = 3;
  }

  // Funcionalidade para aumentar e diminuir o tamanho da fonte
  let currentFontSize = 3; // Começa com o valor médio da seleção de tamanho de fonte

  document.getElementById('increaseFontSize').addEventListener('click', function() {
    if (currentFontSize < 7) {
      currentFontSize++;
      fontSizeSelect.value = currentFontSize;
      document.execCommand('fontSize', false, currentFontSize);
    }
  });

  document.getElementById('decreaseFontSize').addEventListener('click', function() {
    if (currentFontSize > 1) {
      currentFontSize--;
      fontSizeSelect.value = currentFontSize;
      document.execCommand('fontSize', false, currentFontSize);
    }
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
  textDocument.setAttribute('contenteditable', true);

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

  let zoomLevel = 100;
  const zoomable = document.getElementById('textDocument');
  const zoomSlider = document.getElementById('zoomSlider');
  const zoomIn = document.getElementById('zoomIn');
  const zoomOut = document.getElementById('zoomOut');
  const zoomValue = document.getElementById('value');

  function updateZoom() {
    zoomable.style.transform = `scale(${zoomLevel / 100})`;
    zoomSlider.value = zoomLevel;
    zoomValue.textContent = `${zoomLevel}%`;
  }
  function updateZoom() {
    zoomable.style.transform = `scale(${zoomLevel / 100})`;
    zoomSlider.value = zoomLevel;
    zoomValue.textContent = `${zoomLevel}%`;

    const additionalMargin = Math.max(0, (zoomLevel - 100) * 6);
    zoomable.style.margin = `${additionalMargin}px auto`;
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

