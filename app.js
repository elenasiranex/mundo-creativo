// --- 1. CONFIGURACIÓN DEL AVATAR ---
let generoActual = 'nina';
let idxPiel = 0;
let idxPelo = 0;
let idxCara = 0;

const tonosPiel = ['#F8C8A0', '#E0AC69', '#C68642', '#8D5524', '#FFDBAC'];

const peinadosNina = [
  {
    trasero: '<rect x="28" y="42" width="94" height="80" rx="35" fill="#5C3A21"/>',
    frontal: '<path d="M32 58 C32 10, 118 10, 118 58 C95 32, 55 32, 32 58 Z" fill="#5C3A21"/>'
  },
  {
    trasero: '<circle cx="28" cy="35" r="18" fill="#E07A5F"/><circle cx="122" cy="35" r="18" fill="#E07A5F"/>',
    frontal: '<path d="M32 58 C32 10, 118 10, 118 58 C95 30, 55 30, 32 58 Z" fill="#E07A5F"/>'
  },
  {
    trasero: '<path d="M26 48 L20 125 H130 L124 48 Z" fill="#FFB703"/>',
    frontal: '<path d="M32 58 C32 10, 118 10, 118 58 C90 36, 60 36, 32 58 Z" fill="#FFB703"/>'
  }
];

const peinadosNino = [
  {
    trasero: '',
    frontal: '<path d="M32 55 C32 8, 118 8, 118 55 C105 28, 45 28, 32 55 Z" fill="#2B2D42"/>'
  },
  {
    trasero: '',
    frontal: '<path d="M32 55 L42 14 L60 28 L75 8 L92 28 L110 14 L118 55 C95 30, 55 30, 32 55 Z" fill="#8D5524"/>'
  },
  {
    trasero: '',
    frontal: '<path d="M32 55 C32 10, 118 10, 118 55 C95 32, 55 32, 32 55 Z" fill="#D62828"/>'
  }
];

const expresionesBoca = [
  'M67 76 Q75 85 83 76', // Sonrisa
  'M68 78 Q75 92 82 78 Z', // Muy feliz / riendo
  'M71 80 A4 4 0 1 0 79 80 A4 4 0 1 0 71 80', // Sorpresa (O)
  'M67 82 Q75 74 83 82' // Triste / puchero
];

function cambiarGenero(genero) {
  generoActual = genero;
  idxPelo = 0;
  document.getElementById('btn-nina').classList.toggle('activo', genero === 'nina');
  document.getElementById('btn-nino').classList.toggle('activo', genero === 'nino');

  const prendaInf = document.getElementById('prenda-inferior');
  if (genero === 'nina') {
    prendaInf.setAttribute('d', 'M43 160 H107 L113 188 H37 Z');
  } else {
    prendaInf.setAttribute('d', 'M43 160 H107 V188 H78 V174 H72 V188 H43 Z');
  }
  actualizarPelo();
}

function cambiarPiel() {
  idxPiel = (idxPiel + 1) % tonosPiel.length;
  document.querySelectorAll('.piel').forEach(p => p.setAttribute('fill', tonosPiel[idxPiel]));
}

function cambiarPelo() {
  const lista = generoActual === 'nina' ? peinadosNina : peinadosNino;
  idxPelo = (idxPelo + 1) % lista.length;
  actualizarPelo();
}

function actualizarPelo() {
  const lista = generoActual === 'nina' ? peinadosNina : peinadosNino;
  document.getElementById('capa-pelo-trasero').innerHTML = lista[idxPelo].trasero;
  document.getElementById('capa-pelo-frontal').innerHTML = lista[idxPelo].frontal;
}

function cambiarExpresion() {
  idxCara = (idxCara + 1) % expresionesBoca.length;
  document.getElementById('boca').setAttribute('d', expresionesBoca[idxCara]);
}

actualizarPelo();

// --- 2. SISTEMA DE ARRASTRAR Y SOLTAR ---
let elementoActivo = null;
let offsetX = 0;
let offsetY = 0;

document.querySelectorAll('.arrastrable').forEach(elemento => {
  elemento.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    elementoActivo = elemento;

    if (elemento.id === 'avatar') despertarAvatar();

    const casaRect = document.getElementById('casa').getBoundingClientRect();
    const elemLeft = parseFloat(elemento.style.left) || 0;
    const elemTop = parseFloat(elemento.style.top) || 0;

    offsetX = (e.clientX - casaRect.left) - elemLeft;
    offsetY = (e.clientY - casaRect.top) - elemTop;
    elemento.style.zIndex = '100';
  });
});

window.addEventListener('pointermove', (e) => {
  if (!elementoActivo) return;
  const casaRect = document.getElementById('casa').getBoundingClientRect();
  elementoActivo.style.left = `${(e.clientX - casaRect.left) - offsetX}px`;
  elementoActivo.style.top = `${(e.clientY - casaRect.top) - offsetY}px`;
});

window.addEventListener('pointerup', () => {
  if (!elementoActivo) return;
  const soltado = elementoActivo;
  elementoActivo = null;
  soltado.style.zIndex = '20';

  if (soltado.id === 'avatar') comprobarSiAcuesta();
  if (soltado.classList.contains('comida')) comprobarInteraccionComida(soltado);
  if (soltado.classList.contains('prenda') || soltado.classList.contains('accesorio')) {
    comprobarVestirAvatar(soltado);
  }
});

// --- 3. MECÁNICAS DE DESCUBRIMIENTO ---

// A. Dormir en la cama (Cabeza a la izquierda en la almohada)
function comprobarSiAcuesta() {
  const avatar = document.getElementById('avatar');
  const camaRect = document.getElementById('cama').getBoundingClientRect();
  const avRect = avatar.getBoundingClientRect();

  const sobreCama = !(
    avRect.right < camaRect.left + 20 ||
    avRect.left > camaRect.right - 20 ||
    avRect.bottom < camaRect.top + 10 ||
    avRect.top > camaRect.bottom - 10
  );

  if (sobreCama) {
    avatar.classList.add('durmiendo');
    avatar.style.left = '80px';
    avatar.style.top = '205px';
    avatar.style.zIndex = '40';
    document.getElementById('ojos-abiertos').style.display = 'none';
    document.getElementById('ojos-cerrados').style.display = 'block';
    document.getElementById('zzz').classList.remove('oculto');
  }
}

function despertarAvatar() {
  const avatar = document.getElementById('avatar');
  avatar.classList.remove('durmiendo');
  document.getElementById('ojos-abiertos').style.display = 'block';
  document.getElementById('ojos-cerrados').style.display = 'none';
  document.getElementById('zzz').classList.add('oculto');
}

// B. Ventana Día / Noche
function alternarDiaNoche() {
  document.getElementById('cielo-ventana').classList.toggle('noche');
}

// C. Nevera que se abre y muestra la comida
function alternarNevera() {
  const puerta = document.getElementById('puerta-nevera');
  puerta.classList.add('abierta');
  document.querySelectorAll('.oculto-nevera').forEach(el => {
    el.style.display = 'block';
  });
  tocarNota(440, 0.12);
}

// D. Armario que se abre y muestra ropa y corona
function alternarArmario() {
  const puerta = document.getElementById('puerta-armario');
  puerta.classList.add('abierta');
  document.querySelectorAll('.oculto-puerta').forEach(el => {
    el.style.display = 'block';
  });
  tocarNota(520, 0.12);
}

// E. Vestir al avatar arrastrando ropa o corona encima
function comprobarVestirAvatar(objeto) {
  const objRect = objeto.getBoundingClientRect();
  const avRect = document.getElementById('avatar').getBoundingClientRect();

  const tocaAvatar = !(
    objRect.right < avRect.left ||
    objRect.left > avRect.right ||
    objRect.bottom < avRect.top ||
    objRect.top > avRect.bottom
  );

  if (tocaAvatar) {
    if (objeto.classList.contains('prenda')) {
      document.getElementById('prenda-superior').setAttribute('fill', objeto.dataset.sup);
      document.getElementById('prenda-inferior').setAttribute('fill', objeto.dataset.inf);
      objeto.style.display = 'none';
      tocarNota(600, 0.15);
    } else if (objeto.id === 'corona') {
      document.getElementById('corona-puesta').style.display = 'block';
      objeto.style.display = 'none';
      tocarNota(780, 0.2);
    }
  }
}

// F. Pintar cuadros en el caballete
let dibujoIdx = 0;
const dibujosLienzo = [
  '<circle cx="55" cy="52" r="14" fill="#FFD166"/><path d="M22 86 L45 55 L68 86 Z" fill="#06D6A0"/><path d="M48 86 L70 50 L88 86 Z" fill="#118AB2"/>',
  '<path d="M55 75 C35 55, 35 38, 55 48 C75 38, 75 55, 55 75 Z" fill="#EF476F"/>',
  '<circle cx="55" cy="58" r="10" fill="#FFB703"/><circle cx="55" cy="40" r="8" fill="#FF8FA3"/><circle cx="55" cy="76" r="8" fill="#FF8FA3"/><circle cx="37" cy="58" r="8" fill="#FF8FA3"/><circle cx="73" cy="58" r="8" fill="#FF8FA3"/>',
  ''
];

function pintarCuadro() {
  document.getElementById('dibujo-lienzo').innerHTML = dibujosLienzo[dibujoIdx];
  dibujoIdx = (dibujoIdx + 1) % dibujosLienzo.length;
  tocarNota(660, 0.1);
}

// G. Cocinar en la sartén y comer
function comprobarInteraccionComida(comida) {
  const comidaRect = comida.getBoundingClientRect();
  const sarten = document.getElementById('sarten');
  const avatar = document.getElementById('avatar');

  if (sarten && comida.id === 'huevo' && comida.dataset.estado === 'crudo') {
    const sartenRect = sarten.getBoundingClientRect();
    const margen = 50;

    const enSarten = !(
      comidaRect.right < sartenRect.left - margen ||
      comidaRect.left > sartenRect.right + margen ||
      comidaRect.bottom < sartenRect.top - margen ||
      comidaRect.top > sartenRect.bottom + margen
    );

    if (enSarten) {
      comida.dataset.estado = 'frito';
      document.getElementById('llama-fogon').classList.add('encendida');
      // Coloca el huevo frito encima de la sartén
      comida.style.left = '760px';
      comida.style.top = '210px';
      comida.innerHTML = `
        <svg width="52" height="45" viewBox="0 0 52 45">
          <path d="M10 22 Q5 10 25 8 Q45 6 46 22 Q48 38 26 37 Q8 38 10 22 Z" fill="#FFFFFF" stroke="#E9ECEF" stroke-width="2"/>
          <circle cx="27" cy="22" r="9" fill="#FFB703"/>
        </svg>`;
      tocarNota(500, 0.12);
      setTimeout(() => tocarNota(700, 0.18), 110);
      return;
    }
  }

  if (avatar) {
    const avatarRect = avatar.getBoundingClientRect();
    const cercaCara = !(
      comidaRect.right < avatarRect.left + 15 ||
      comidaRect.left > avatarRect.right - 15 ||
      comidaRect.bottom < avatarRect.top ||
      comidaRect.top > avatarRect.top + 115
    );

    if (cercaCara) {
      comida.style.display = 'none';
      tocarNota(520, 0.15);
      setTimeout(() => tocarNota(680, 0.15), 120);
    }
  }
}

// H. Reiniciar casa
function reiniciarTodo() {
  document.getElementById('llama-fogon').classList.remove('encendida');
  document.getElementById('corona-puesta').style.display = 'none';

  const huevo = document.getElementById('huevo');
  huevo.style.left = '965px';
  huevo.style.top = '165px';
  huevo.dataset.estado = 'crudo';
  huevo.innerHTML = `<svg width="42" height="48" viewBox="0 0 42 48"><ellipse cx="21" cy="26" rx="15" ry="19" fill="#FFF3E0" stroke="#E0C097" stroke-width="2"/></svg>`;

  const fresa = document.getElementById('fresa');
  fresa.style.left = '1015px';
  fresa.style.top = '170px';

  const leche = document.getElementById('leche');
  leche.style.left = '980px';
  leche.style.top = '245px';

  const manzana = document.getElementById('manzana');
  manzana.style.display = 'block';
  manzana.style.left = '1160px';
  manzana.style.top = '265px';

  document.getElementById('vestido-rojo').style.left = '445px';
  document.getElementById('vestido-rojo').style.top = '185px';
  document.getElementById('conjunto-verde').style.left = '505px';
  document.getElementById('conjunto-verde').style.top = '185px';
  document.getElementById('corona').style.left = '470px';
  document.getElementById('corona').style.top = '270px';

  // Si las puertas están abiertas, mantiene visibles los objetos
  if (document.getElementById('puerta-nevera').classList.contains('abierta')) {
    document.querySelectorAll('.oculto-nevera').forEach(el => el.style.display = 'block');
  }
  if (document.getElementById('puerta-armario').classList.contains('abierta')) {
    document.querySelectorAll('.oculto-puerta').forEach(el => el.style.display = 'block');
  }
}

// --- 4. RADIO MUSICAL ---
let audioCtx = null;
let intervaloMusica = null;
const melodia = [523, 587, 659, 523, 659, 587, 523];
let notaIdx = 0;

function obtenerAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function alternarRadio() {
  const notasVis = document.getElementById('notas-musicales');
  if (intervaloMusica) {
    clearInterval(intervaloMusica);
    intervaloMusica = null;
    notasVis.classList.add('oculto');
  } else {
    notasVis.classList.remove('oculto');
    tocarNota(melodia[0], 0.22);
    notaIdx = 1;
    intervaloMusica = setInterval(() => {
      tocarNota(melodia[notaIdx], 0.22);
      notaIdx = (notaIdx + 1) % melodia.length;
    }, 350);
  }
}

function tocarNota(frecuencia, duracion) {
  const ctx = obtenerAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(frecuencia, ctx.currentTime);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duracion);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duracion);
}
