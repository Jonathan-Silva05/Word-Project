// Seleciona a div onde o valor será exibido
const containerMenu = document.querySelector('.containerMenu');

// Função para atualizar o conteúdo da div
function updateContent(value) {
  containerMenu.innerHTML = value;
}

// Seleciona todos os botões
const buttons = document.querySelectorAll('button[id^="btn"]'); // Seleciona botões cujo id começa com 'btn'

// Função para remover a classe 'btnActive' de todos os botões
function removeActiveClassFromAllButtons() {
  buttons.forEach(button => {
    button.classList.remove('btnActive');
  });
}

// Função para adicionar a classe 'btnActive' ao botão clicado, remover de outros e atualizar o conteúdo
function addButtonClickListener(button, content) {
  button.addEventListener('click', function() {
    removeActiveClassFromAllButtons(); // Remove a classe 'btnActive' de todos os botões
    this.classList.add('btnActive'); // Adiciona a classe ao botão clicado
    updateContent(content);
  });
}

// Adicionando evento de clique e conteúdo específico para cada botão
addButtonClickListener(document.getElementById('btnInicial'), `<h2> Bem-vindo! </h2>`);
addButtonClickListener(document.getElementById('btnInserir'), `<h2> Inserir Dados </h2>`);
addButtonClickListener(document.getElementById('btnDesenhar'), `<h2> Ferramentas de Desenho </h2>`);
addButtonClickListener(document.getElementById('btnDesign'), `<h2> Opções de Design </h2>`);
addButtonClickListener(document.getElementById('btnLayout'), `<h2> Configurações de Layout </h2>`);
addButtonClickListener(document.getElementById('btnReferencia'), `<h2> Referências e Fontes </h2>`);
addButtonClickListener(document.getElementById('btnCorresp'), `<h2> Correspondências </h2>`);
addButtonClickListener(document.getElementById('btnRevisao'), `<h2> Revisar Conteúdo </h2>`);
addButtonClickListener(document.getElementById('btnExibir'), `<h2> Exibir Resultados </h2>`);

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

  // Event listeners para botões de opção e opções avançadas
  const optionButtons = document.querySelectorAll(".option-button");

  // Função modificada para desativar botões
  function deactivateButtons(container) {
    container.querySelectorAll('.option-button').forEach(button => {
      button.classList.remove('active');
    });
  }

  optionButtons.forEach(button => {
    button.addEventListener("click", () => {
      modifyText(button.id, false, null);
      const containerNull = button.closest('.btnsBackOff');
      const containerList = button.closest('.btnList');
      const containerAlign = button.closest('.align');
      const containerFormat = button.closest('.textFormat');

      // Verifica se o botão está dentro do containerList, mas não no containerNull
      if (containerList && !containerNull) {
        // Se o botão já estiver ativo, a classe 'active' será removida
        if (button.classList.contains("active")) {
          button.classList.remove("active");
        } else {
          // Desativa todos os botões no container e ativa o clicado
          deactivateButtons(containerList);
          button.classList.add("active");
        }
      } else if (containerAlign && !containerList && !containerNull) {
        if (containerAlign) {
          deactivateButtons(containerAlign);
          button.classList.toggle("active");
        } else {
          button.classList.toggle("active");
        }
      } else if (containerFormat) {
        if (button.classList.contains("active")) {
          button.classList.remove("active");
        } else {
          button.classList.add("active");
        }
      }
    });
  });

  const advancedOptionButtons = document.querySelectorAll(".adv-option-button");
  advancedOptionButtons.forEach(button => {
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
  }

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

  /*// Função para adicionar eventos aos botões Desfazer e Refazer
  function addUndoRedoListeners() {
    const undoButton = document.getElementById('undo');
    const redoButton = document.getElementById('redo');

    undoButton.addEventListener('click', function() {
      document.execCommand('undo', false, null);
    });

    redoButton.addEventListener('click', function() {
      document.execCommand('redo', false, null);
    });
  }

  addUndoRedoListeners();*/
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

