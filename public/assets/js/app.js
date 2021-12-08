/* Funções de seleção das query */
const query = element => document.querySelector(element);
const queryAll = element => document.querySelectorAll(element);

/* Vaiáveis de controle de interfaces */
const seuVotoPara = query('.d-1--1 span');
const cargo = query('.d-1--2 span');
const description = query('.d-1--4');
const aviso = query('.d-2');
const lateral = query('.d-1--right');
const numeros = query('.d-1--3');

/* Variáveis de controle de ambiente */
let btn = null;
let etapaAtual = 0;
let numeroCandidato = '';
let votoEmBranco = false;
let qtClick = 0;

const votos = [];

const iniciaEtapa = () => {
  const etapa = etapas[etapaAtual];
  let numeroHtml = '';

  numeroCandidato = '';
  votoEmBranco = false;
  qtClick = 0;

  for (let index = 0; index < etapa.numeros; index++) {
    index === 0
      ? (numeroHtml += '<div class="number blink"></div>')
      : (numeroHtml += '<div class="number"></div>');
  }

  seuVotoPara.style.display = 'none';
  cargo.innerHTML = etapa.titulo;
  description.innerHTML = '';
  aviso.style.display = 'none';
  lateral.innerHTML = '';
  numeros.innerHTML = numeroHtml;
};

const atualizaInterface = () => {
  const etapa = etapas[etapaAtual];
  let candidato = etapa.candidatos.filter(elementProperty =>
    elementProperty.numero === numeroCandidato ? true : false
  );
  if (candidato.length > 0) {
    candidato = candidato[0];
    seuVotoPara.style.display = 'block';
    aviso.style.display = 'block';
    description.innerHTML = `Nome: ${candidato.nome}<br />Partido: ${candidato.partido}`;

    let fotosHtml = '';

    for (let index in candidato.fotos) {
      if (candidato.fotos[index].small) {
        fotosHtml += `<div class="d-1-img small"><img src="./assets/img/${candidato.fotos[index].url}" alt="" />${candidato.fotos[index].legenda}</div>`;
      } else {
        fotosHtml += `<div class="d-1-img"><img src="./assets/img/${candidato.fotos[index].url}" alt="" />${candidato.fotos[index].legenda}</div>`;
      }
    }

    lateral.innerHTML = fotosHtml;
  } else {
    seuVotoPara.style.display = 'block';
    aviso.style.display = 'block';
    description.innerHTML = '<div class="aviso--grande blink">VOTO NULO</div>';
  }
};

/* Evento clique dos botões */
queryAll('.keyboard--button').forEach(element => {
  element.addEventListener('click', e => {
    btn = e.target;
    let elementNumber = query('.number.blink');

    if (elementNumber !== null) {
      if (
        btn.textContent !== 'BRANCO' &&
        btn.textContent !== 'CORRIGE' &&
        btn.textContent !== 'CONFIRMA'
      ) {
        qtClick++;
        elementNumber.innerHTML = btn.textContent;
        numeroCandidato = `${numeroCandidato}${btn.textContent}`;
        elementNumber.classList.remove('blink');

        if (elementNumber.nextElementSibling !== null) {
          elementNumber.nextElementSibling.classList.add('blink');
        } else {
          atualizaInterface();
        }
      }
    }

    verificaNumeros(5, 7);
    verificaNumeros(2, 3);

    switch (btn.textContent) {
      case 'CORRIGE':
        try {
          iniciaEtapa();
        } catch (error) {
          console.log(`ERRO: ${error}`);
        }
        break;
      case 'BRANCO':
        btnBranco();
        break;
      case 'CONFIRMA':
        try {
          btnConfirma();
        } catch (error) {
          console.log(`ERRO: ${error}`);
        }
        break;
    }
  });
});

const btnBranco = () => {
  if (numeroCandidato === '') {
    votoEmBranco = true;
    seuVotoPara.style.display = 'block';
    aviso.style.display = 'block';
    numeros.innerHTML = '';
    description.innerHTML =
      '<div class="aviso--grande blink">VOTO EM BRANCO</div>';
  } else {
    alert(
      'Para votar em BRANCO, os campos terão que estar vazio!! Aperte CORRIGE para apagar o campo de voto.'
    );
  }
};

const btnConfirma = () => {
  const etapa = etapas[etapaAtual];
  let votoConfirmado = false;

  if (votoEmBranco === true) {
    votoConfirmado = true;
    votos.push({
      etapa: etapas[etapaAtual].titulo,
      voto: 'branco'
    });
  } else if (numeroCandidato.length === etapa.numeros) {
    votoConfirmado = true;
    votos.push({
      etapa: etapas[etapaAtual].titulo,
      voto: numeroCandidato
    });
  } else {
    alert(
      'Para CONFIRMAR é necessário digitar pelo menos o número do partido ou votar em BRANCO'
    );
  }

  if (votoConfirmado) {
    etapaAtual++;
    if (etapas[etapaAtual] !== undefined) {
      iniciaEtapa();
    } else {
      query('.content-screen').innerHTML =
        '<div class="aviso--big blink">FIM!</div>';
      console.log(votos);
    }
  }
};

const verificaNumeros = (numCandidato, numClicks) => {
  if (
    btn.textContent !== 'BRANCO' &&
    btn.textContent !== 'CORRIGE' &&
    btn.textContent !== 'CONFIRMA' &&
    numeroCandidato.length === numCandidato
  ) {
    qtClick += 1;
    if (qtClick > numClicks) {
      alert('O número do candidato já está completo.');
    }
  }
};

iniciaEtapa();
