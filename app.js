// --- 1. CONFIGURACIÓN DEL AVATAR (Con pelo cubriendo toda la cabeza) ---
let generoActual = 'nina';
let idxPiel = 0;
let idxPelo = 0;
let idxCara = 0;

const tonosPiel = ['#F8C8A0', '#E0AC69', '#C68642', '#8D5524', '#FFDBAC'];

const peinadosNina = [
  {
    trasero: '<rect x="26" y="38" width="98" height="86" rx="38" fill="#5C3A21"/>',
    frontal: '<path d="M30 60 C30 8, 120 8, 120 60 C96 36, 54 36, 30 60 Z" fill="#5C3A21"/>'
  },
  {
    trasero: '<circle cx="28" cy="32" r="19" fill="#E07A5F"/><circle cx="122" cy="32" r="19" fill="#E07A5F"/>',
    frontal: '<path d="M30 60 C30 8, 120 8, 120 60 C96 34, 54 34, 30 60 Z" fill="#E07A5F"/>'
  },
  {
    trasero: '<path d="M24 44 L18 126 H132 L126 44 Z" fill="#FFB703"/>',
    frontal: '<path d="M30 60 C30 8, 120 8, 120 60 C92 38, 58 38, 30 60 Z" fill="#FFB703"/>'
  }
];

const peinadosNino = [
  {
    trasero: '',
    frontal: '<path d="M30 58 C30 6, 120 6, 120 58 C104 32, 46 32, 30 58 Z" fill="#2B2D42"/>'
  },
  {
    trasero: '',
    frontal: '<path d="M30 58 L40 12 L58 28 L75 6 L92 28 L110 12 L120 58 C95 34, 55 34, 30 58 Z" fill="#8D5524"/>'
  },
  {
    trasero: '',
    frontal: '<path d="M30 58 C30 8, 120 8, 120 58 C95 36, 55 36, 30 58 Z" fill="#D62828"/>'
  }
];

const expresionesBoca = [
  'M67 78 Q75 87 83 78',
  'M68 79 Q75 93 82 79 Z',
  'M71 81 A4 4 0 1 0 79 81 A4 4 0 1 0 71 81',
  'M67 84 Q75 76 83 84'
];

function cambiarGenero(genero) {
  generoActual = genero;
  idxPelo = 0;
  document.getElementById('btn-nina').classList.toggle('activo', genero === 'nina');
  document.getElementById('btn-nino').classList.toggle('activo', genero === 'nino');

  const prendaInf = document.getElementById('prenda-inferior');
  prendaInf.setAttribute('d', genero === 'nina'
    ? 'M43 160 H107 L113 188 H37 Z'
    : 'M43 160 H107 V188 H78 V174 H72 V188 H43 Z'
  );
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

// --- 2. COLOCAR OBJETOS EXACTAMENTE DENTRO DE SUS MUEBLES SEGÚN EL TAMAÑO DE PANTALLA ---
function colocarElementosEnMuebles() {
  const casaRect = document.getElementById('casa').getBoundingClientRect();

  // Avatar en el dormitorio
  const avatar = document.getElementById('avatar');
  avatar.style.left = `${casaRect.width * 0.30}px`;
  avatar.style.top = `${casaRect.height * 0.42}px`;

  // Peluche en la alfombra
  const alfombra = document.querySelector('.alfombra').getBoundingClientRect();
  const peluche = document.getElementById('peluche');
  peluche.style.left = `${alfombra.left - casaRect.left + 160}px`;
  peluche.style.top = `${alfombra.top - casaRect.top - 10}px`;

  // Ropa y corona dentro del armario
  const armario = document.getElementById('armario').getBoundingClientRect();
  const armX = armario.left - casaRect.left;
  const armY = armario.top - casaRect.top;

  const vestido = document.getElementById('vestido-rojo');
  vestido.style.left = `${armX + 16}px`;
  vestido.style.top = `${armY + 42}px`;

  const conjunto = document.getElementById('conjunto-verde');
  conjunto.style.left = `${armX + 70}px`;
  conjunto.style.top = `${armY + 42}px`;

  const corona = document.getElementById('corona');
  corona.style.left = `${armX + 42}px`;
  corona.style.top = `${armY + 125}px`;

  // Comida dentro de la nevera
  const nevera = document.getElementById('nevera').getBoundingClientRect();
  const nevX = nevera.left - casaRect.left;
  const nevY = nevera.top - casaRect.top;

  const huevo = document.getElementById('huevo');
  huevo.style.left = `${nevX + 20}px`;
  huevo.style.top = `${nevY + 22}px`;

  const fresa = document.getElementById('fresa');
  fresa.style.left = `${nevX + 70}px`;
  fresa.style.top = `${nevY + 26}px`;

  const leche = document.getElementById('leche');
  leche.style.left = `${nevX + 44}px`;
  leche.style.top = `${nevY + 75}px`;

  // Manzana sobre la mesa
  const mesa = document.querySelector('.mesa-cocina').getBoundingClientRect();
  const manzana = document.getElementById('manzana');
  manzana.style.left = `${mesa.left - casaRect.left + 48}px`;
  manzana.style.top = `${mesa.top - casaRect.top - 38}px`;
}

window.addEventListener('load', () => {
  actualizarPelo();
  colocarElementosEnMuebles();
});
window.addEventListener('resize', colocarElementosEnMuebles);

// --- 3. ARRASTRAR Y SOLTAR ---
let elementoActivo = null;
let offsetX = 0;
let offsetY = 0;

document.querySelectorAll('.arrastrable').forEach(elemento => {
  elemento.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    elementoActivo = elemento;
    if (elemento.id === 'avatar') despertarAvatar();

    const casaRect = document.getElementById('casa').getBoundingClientRect();
    offsetX = (e.clientX - casaRect.left) - (parseFloat(elemento.style.left) || 0);
    offsetY = (e.clientY - casaRect.top) - (parseFloat(elemento.style.top) || 0);
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

// --- 4. INTERACCIONES ---
function comprobarSiAcuesta() {
  const avatar = document.getElementById('avatar');
  const camaRect = document.getElementById('cama').getBoundingClientRect();
  const avRect = avatar.getBoundingClientRect();
  const casaRect = document.getElementById('casa').getBoundingClientRect();

  const sobreCama = !(
    avRect.right < camaRect.left + 20 ||
    avRect.left > camaRect.right - 20 ||
    avRect.bottom < camaRect.top + 10 ||
    avRect.top > camaRect.bottom - 10
  );

  if (sobreCama) {
    avatar.classList.add('durmiendo');
    avatar.style.left = `${camaRect.left - casaRect.left + 48}px`;
    avatar.style.top = `${camaRect.top - casaRect.top - 52}px`;
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

function alternarDiaNoche() {
  document.getElementById('cielo-ventana').classList.toggle('noche');
}

function alternarNevera() {
  document.getElementById('puerta-nevera').classList.add('abierta');
  document.querySelectorAll('.item-nevera').forEach(el => el.style.display = 'block');
  tocarNota(440, 0.12);
}

function alternarArmario() {
  document.getElementById('puerta-armario').classList.add('abierta');
  document.querySelectorAll('.item-armario').forEach(el => el.style.display = 'block');
  tocarNota(520, 0.12);
}

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

function comprobarInteraccionComida(comida) {
  const comidaRect = comida.getBoundingClientRect();
  const sartenRect = document.getElementById('sarten').getBoundingClientRect();
  const avatarRect = document.getElementById('avatar').getBoundingClientRect();
  const casaRect = document.getElementById('casa').getBoundingClientRect();

  if (comida.id === 'huevo' && comida.dataset.estado === 'crudo') {
    const margen = 45;
    const enSarten = !(
      comidaRect.right < sartenRect.left - margen ||
      comidaRect.left > sartenRect.right + margen ||
      comidaRect.bottom < sartenRect.top - margen ||
      comidaRect.top > sartenRect.bottom + margen
    );

    if (enSarten) {
      comida.dataset.estado = 'frito';
      document.getElementById('llama-fogon').classList.add('encendida');
      comida.style.left = `${sartenRect.left - casaRect.left + 20}px`;
      comida.style.top = `${sartenRect.top - casaRect.top - 8}px`;
      comida.innerHTML = `
        <svg width="50" height="42" viewBox="0 0 52 45">
          <path d="M10 22 Q5 10 25 8 Q45 6 46 22 Q48 38 26 37 Q8 38 10 22 Z" fill="#FFFFFF" stroke="#E9ECEF" stroke-width="2"/>
          <circle cx="27" cy="22" r="9" fill="#FFB703"/>
        </svg>`;
      tocarNota(500, 0.12);
      setTimeout(() => tocarNota(700, 0.18), 110);
      return;
    }
  }

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

function reiniciarTodo() {
  despertarAvatar();
  document.getElementById('llama-fogon').classList.remove('encendida');
  document.getElementById('corona-puesta').style.display = 'none';

  const huevo = document.getElementById('huevo');
  huevo.dataset.estado = 'crudo';
  huevo.innerHTML = `<svg width="38" height="44" viewBox="0 0 42 48"><ellipse cx="21" cy="26" rx="15" ry="19" fill="#FFF3E0" stroke="#E0C097" stroke-width="2"/></svg>`;

  document.getElementById('manzana').style.display = 'block';
  if (document.getElementById('puerta-nevera').classList.contains('abierta')) {
    document.querySelectorAll('.item-nevera').forEach(el => el.style.display = 'block');
  }
  if (document.getElementById('puerta-armario').classList.contains('abierta')) {
    document.querySelectorAll('.item-armario').forEach(el => el.style.display = 'block');
  }
  colocarElementosEnMuebles();
}

// --- 5. RADIO MUSICAL ---
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
