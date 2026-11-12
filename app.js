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
  
  // Cambia forma de falda a pantalón corto según género
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

function cambiarRopa() {
  idxRopa = (idxRopa + 1) % conjuntosRopa.length;
  document.getElementById('prenda-superior').setAttribute('fill', conjuntosRopa[idxRopa].sup);
  document.getElementById('prenda-inferior').setAttribute('fill', conjuntosRopa[idxRopa].inf);
}

// Inicializar peinado al cargar
actualizarPelo();

// --- 2. SISTEMA DE ARRASTRAR Y SOLTAR ---
document.querySelectorAll('.arrastrable').forEach(elemento => {
  let offsetX = 0, offsetY = 0, arrastrando = false;

  elemento.addEventListener('pointerdown', (e) => {
    arrastrando = true;
    // Si agarramos al avatar mientras duerme, se despierta
    if (elemento.id === 'avatar') despertarAvatar();
    
    const rect = elemento.getBoundingClientRect();
    const casaRect = document.getElementById('casa').getBoundingClientRect();
    offsetX = e.clientX - (rect.left - casaRect.left);
    offsetY = e.clientY - (rect.top - casaRect.top);
    elemento.setPointerCapture(e.pointerId);
  });

  elemento.addEventListener('pointermove', (e) => {
    if (!arrastrando) return;
    const casaRect = document.getElementById('casa').getBoundingClientRect();
    elemento.style.left = `${e.clientX - casaRect.left - offsetX}px`;
    elemento.style.top = `${e.clientY - casaRect.top - offsetY}px`;
  });

  elemento.addEventListener('pointerup', (e) => {
    arrastrando = false;
    elemento.releasePointerCapture(e.pointerId);

    if (elemento.id === 'avatar') comprobarSiAcuesta();
    if (elemento.classList.contains('comida')) comprobarInteraccionComida(elemento);
  });
});

// --- 3. MECÁNICAS DE DESCUBRIMIENTO E INTERACCIÓN ---

// A. Dormir en la cama
function comprobarSiAcuesta() {
  const avatar = document.getElementById('avatar');
  const cama = document.getElementById('cama').getBoundingClientRect();
  const avRect = avatar.getBoundingClientRect();

  const sobreCama = !(
    avRect.right < cama.left + 30 ||
    avRect.left > cama.right - 30 ||
    avRect.bottom < cama.top + 20 ||
    avRect.top > cama.bottom - 20
  );

  if (sobreCama) {
    avatar.classList.add('durmiendo');
    avatar.style.left = '90px';
    avatar.style.top = '205px';
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

// C. Nevera que se abre y cierra
function alternarNevera() {
  document.getElementById('puerta-nevera').classList.toggle('abierta');
  tocarNota(440, 0.1);
}

// D. Cocinar en la sartén y dar de comer al avatar
function comprobarInteraccionComida(comida) {
  const comidaRect = comida.getBoundingClientRect();
  const sartenRect = document.getElementById('sarten').getBoundingClientRect();
  const avatarRect = document.getElementById('avatar').getBoundingClientRect();

  // 1. ¿Está el huevo crudo sobre la sartén? -> ¡Se cocina!
  if (comida.id === 'huevo' && comida.dataset.estado === 'crudo') {
    const enSarten = !(
      comidaRect.right < sartenRect.left ||
      comidaRect.left > sartenRect.right ||
      comidaRect.bottom < sartenRect.top ||
      comidaRect.top > sartenRect.bottom
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

  // 2. ¿Está cerca de la cara del avatar? -> ¡Se lo come!
  const cercaCara = !(
    comidaRect.right < avatarRect.left + 20 ||
    comidaRect.left > avatarRect.right - 20 ||
    comidaRect.bottom < avatarRect.top ||
    comidaRect.top > avatarRect.top + 110
  );

  if (cercaCara) {
    comida.style.display = 'none';
    tocarNota(520, 0.15);
    setTimeout(() => tocarNota(680, 0.15), 120);
  }
}

function reponerNevera() {
  const huevo = document.getElementById('huevo');
  huevo.style.display = 'block';
  huevo.style.left = '760px';
  huevo.style.top = '230px';
  huevo.dataset.estado = 'crudo';
  huevo.innerHTML = `<svg width="42" height="48" viewBox="0 0 42 48"><ellipse cx="21" cy="26" rx="15" ry="19" fill="#FFF3E0" stroke="#E0C097" stroke-width="2"/></svg>`;

  const fresa = document.getElementById('fresa');
  fresa.style.display = 'block';
  fresa.style.left = '810px';
  fresa.style.top = '235px';

  const leche = document.getElementById('leche');
  leche.style.display = 'block';
  leche.style.left = '775px';
  leche.style.top = '305px';
}

// E. Radio musical (Melodía infantil sintetizada sin archivos externos)
let intervaloMusica = null;
const melodia = [523, 587, 659, 523, 659, 587, 523]; // Do Re Mi Do Mi Re Do
let notaIdx = 0;

function alternarRadio() {
  const notasVis = document.getElementById('notas-musicales');
  if (intervaloMusica) {
    clearInterval(intervaloMusica);
    intervaloMusica = null;
    notasVis.classList.add('oculto');
  } else {
    notasVis.classList.remove('oculto');
    intervaloMusica = setInterval(() => {
      tocarNota(melodia[notaIdx], 0.22);
      notaIdx = (notaIdx + 1) % melodia.length;
    }, 350);
  }
}

function tocarNota(frecuencia, duracion) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
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
