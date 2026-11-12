// --- 1. CONFIGURACIÓN INICIAL DEL AVATAR (NIÑA / NIÑO) ---
let generoActual = 'nina';
let idxPiel = 0;
let idxPelo = 0;
let idxRopa = 0;

const tonosPiel = ['#F8C8A0', '#E0AC69', '#C68642', '#8D5524', '#FFDBAC'];

const peinadosNina = [
  {
    trasero: '<rect x="30" y="45" width="90" height="75" rx="35" fill="#5C3A21"/>',
    frontal: '<path d="M32 58 C32 15, 118 15, 118 58 C95 38, 55 38, 32 58 Z" fill="#5C3A21"/>'
  },
  {
    trasero: '<circle cx="28" cy="35" r="18" fill="#E07A5F"/><circle cx="122" cy="35" r="18" fill="#E07A5F"/>',
    frontal: '<path d="M32 58 C32 15, 118 15, 118 58 C95 35, 55 35, 32 58 Z" fill="#E07A5F"/>'
  },
  {
    trasero: '<path d="M26 50 L20 125 H130 L124 50 Z" fill="#FFB703"/>',
    frontal: '<path d="M32 58 C32 15, 118 15, 118 58 C90 42, 60 42, 32 58 Z" fill="#FFB703"/>'
  }
];

const peinadosNino = [
  {
    trasero: '',
    frontal: '<path d="M32 55 C32 12, 118 12, 118 55 C105 32, 45 32, 32 55 Z" fill="#2B2D42"/>'
  },
  {
    trasero: '',
    frontal: '<path d="M32 55 L42 18 L60 32 L75 12 L92 32 L110 18 L118 55 C95 35, 55 35, 32 55 Z" fill="#8D5524"/>'
  },
  {
    trasero: '',
    frontal: '<path d="M32 55 C32 15, 118 15, 118 55 C95 38, 55 38, 32 55 Z" fill="#D62828"/>'
  }
];

const conjuntosRopa = [
  { sup: '#FF8FA3', inf: '#4EA8DE' },
  { sup: '#FFD166', inf: '#06D6A0' },
  { sup: '#9B5DE5', inf: '#F15BB5' },
  { sup: '#00BBF9', inf: '#2B2D42' }
];

function cambiarGenero(genero) {
  generoActual = genero;
  idxPelo = 0;
  document.getElementById('btn-nina').classList.toggle('activo', genero === 'nina');
  document.getElementById('btn-nino').classList.toggle('activo', genero === 'nino');

  const prendaInf = document.getElementById('prenda-inferior');
  if (prendaInf) {
    if (genero === 'nina') {
      prendaInf.setAttribute('d', 'M43 160 H107 L113 188 H37 Z');
    } else {
      prendaInf.setAttribute('d', 'M43 160 H107 V188 H78 V174 H72 V188 H43 Z');
    }
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
  const trasero = document.getElementById('capa-pelo-trasero');
  const frontal = document.getElementById('capa-pelo-frontal');
  if (trasero) trasero.innerHTML = lista[idxPelo].trasero;
  if (frontal) frontal.innerHTML = lista[idxPelo].frontal;
}

function cambiarRopa() {
  idxRopa = (idxRopa + 1) % conjuntosRopa.length;
  const sup = document.getElementById('prenda-superior');
  const inf = document.getElementById('prenda-inferior');
  if (sup) sup.setAttribute('fill', conjuntosRopa[idxRopa].sup);
  if (inf) inf.setAttribute('fill', conjuntosRopa[idxRopa].inf);
}

actualizarPelo();

// --- 2. SISTEMA DE ARRASTRAR Y SOLTAR ESTABLE (Ratón y Táctil) ---
let elementoActivo = null;
let offsetX = 0;
let offsetY = 0;

document.querySelectorAll('.arrastrable').forEach(elemento => {
  elemento.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    elementoActivo = elemento;

    if (elemento.id === 'avatar') {
      despertarAvatar();
    }

    const casa = document.getElementById('casa');
    const casaRect = casa.getBoundingClientRect();
    const elemLeft = parseFloat(elemento.style.left) || 0;
    const elemTop = parseFloat(elemento.style.top) || 0;

    offsetX = (e.clientX - casaRect.left) - elemLeft;
    offsetY = (e.clientY - casaRect.top) - elemTop;
    elemento.style.zIndex = '100';
  });
});

window.addEventListener('pointermove', (e) => {
  if (!elementoActivo) return;
  const casa = document.getElementById('casa');
  const casaRect = casa.getBoundingClientRect();

  const nuevaX = (e.clientX - casaRect.left) - offsetX;
  const nuevaY = (e.clientY - casaRect.top) - offsetY;

  elementoActivo.style.left = `${nuevaX}px`;
  elementoActivo.style.top = `${nuevaY}px`;
});

window.addEventListener('pointerup', () => {
  if (!elementoActivo) return;
  const soltado = elementoActivo;
  elementoActivo = null;
  soltado.style.zIndex = '20';

  if (soltado.id === 'avatar') {
    comprobarSiAcuesta();
  } else if (soltado.classList.contains('comida')) {
    comprobarInteraccionComida(soltado);
  }
});

// --- 3. MECÁNICAS DE DESCUBRIMIENTO E INTERACCIÓN ---

function comprobarSiAcuesta() {
  const avatar = document.getElementById('avatar');
  const cama = document.getElementById('cama');
  if (!avatar || !cama) return;

  const camaRect = cama.getBoundingClientRect();
  const avRect = avatar.getBoundingClientRect();

  const sobreCama = !(
    avRect.right < camaRect.left + 20 ||
    avRect.left > camaRect.right - 20 ||
    avRect.bottom < camaRect.top + 10 ||
    avRect.top > camaRect.bottom - 10
  );

  if (sobreCama) {
    avatar.classList.add('durmiendo');
    avatar.style.left = '95px';
    avatar.style.top = '215px';
    avatar.style.zIndex = '40';
    document.getElementById('ojos-abiertos').style.display = 'none';
    document.getElementById('ojos-cerrados').style.display = 'block';
    document.getElementById('zzz').classList.remove('oculto');
  }
}

function despertarAvatar() {
  const avatar = document.getElementById('avatar');
  if (!avatar) return;
  avatar.classList.remove('durmiendo');
  document.getElementById('ojos-abiertos').style.display = 'block';
  document.getElementById('ojos-cerrados').style.display = 'none';
  document.getElementById('zzz').classList.add('oculto');
}

function alternarDiaNoche() {
  const cielo = document.getElementById('cielo-ventana');
  if (cielo) cielo.classList.toggle('noche');
}

function alternarNevera() {
  const puerta = document.getElementById('puerta-nevera');
  if (puerta) {
    puerta.classList.toggle('abierta');
    tocarNota(440, 0.1);
  }
}

function comprobarInteraccionComida(comida) {
  const comidaRect = comida.getBoundingClientRect();
  const sarten = document.getElementById('sarten');
  const avatar = document.getElementById('avatar');

  if (sarten && comida.id === 'huevo' && comida.dataset.estado === 'crudo') {
    const sartenRect = sarten.getBoundingClientRect();
    const enSarten = !(
      comidaRect.right < sartenRect.left - 10 ||
      comidaRect.left > sartenRect.right + 10 ||
      comidaRect.bottom < sartenRect.top - 15 ||
      comidaRect.top > sartenRect.bottom + 15
    );

    if (enSarten) {
      comida.dataset.estado = 'frito';
      comida.innerHTML = `
        <svg width="52" height="45" viewBox="0 0 52 45">
          <path d="M10 22 Q5 10 25 8 Q45 6 46 22 Q48 38 26 37 Q8 38 10 22 Z" fill="#FFFFFF" stroke="#E9ECEF" stroke-width="2"/>
          <circle cx="27" cy="22" r="9" fill="#FFB703"/>
        </svg>`;
      tocarNota(600, 0.25);
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

function reponerNevera() {
  const huevo = document.getElementById('huevo');
  if (huevo) {
    huevo.style.display = 'block';
    huevo.style.left = '760px';
    huevo.style.top = '230px';
    huevo.dataset.estado = 'crudo';
    huevo.innerHTML = `<svg width="42" height="48" viewBox="0 0 42 48"><ellipse cx="21" cy="26" rx="15" ry="19" fill="#FFF3E0" stroke="#E0C097" stroke-width="2"/></svg>`;
  }

  const fresa = document.getElementById('fresa');
  if (fresa) {
    fresa.style.display = 'block';
    fresa.style.left = '810px';
    fresa.style.top = '235px';
  }

  const leche = document.getElementById('leche');
  if (leche) {
    leche.style.display = 'block';
    leche.style.left = '775px';
    leche.style.top = '305px';
  }
}

// --- 4. AUDIO ÚNICO (Evita bloqueo del navegador) ---
let audioCtx = null;
let intervaloMusica = null;
const melodia = [523, 587, 659, 523, 659, 587, 523];
let notaIdx = 0;

function obtenerAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function alternarRadio() {
  const notasVis = document.getElementById('notas-musicales');
  if (intervaloMusica) {
    clearInterval(intervaloMusica);
    intervaloMusica = null;
    if (notasVis) notasVis.classList.add('oculto');
  } else {
    if (notasVis) notasVis.classList.remove('oculto');
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
