// --- 1. SISTEMA DE ARRASTRAR Y SOLTAR (Compatible con ratón y pantalla táctil) ---
const elementosArrastrables = document.querySelectorAll('.arrastrable');

elementosArrastrables.forEach(elemento => {
  let offsetX = 0, offsetY = 0, arrastrando = false;

  elemento.addEventListener('pointerdown', (e) => {
    arrastrando = true;
    offsetX = e.clientX - elemento.offsetLeft;
    offsetY = e.clientY - elemento.offsetTop;
    elemento.setPointerCapture(e.pointerId);
  });

  elemento.addEventListener('pointermove', (e) => {
    if (!arrastrando) return;
    elemento.style.left = `${e.clientX - offsetX}px`;
    elemento.style.top = `${e.clientY - offsetY}px`;
  });

  elemento.addEventListener('pointerup', (e) => {
    arrastrando = false;
    elemento.releasePointerCapture(e.pointerId);
    
    // Si soltamos la manzana, comprobamos si está cerca de la cara del avatar
    if (elemento.id === 'manzana') {
      comprobarSiCome(elemento);
    }
  });
});

// --- 2. INTERACCIONES DE DESCUBRIMIENTO ---
function comprobarSiCome(manzana) {
  const avatar = document.getElementById('avatar').getBoundingClientRect();
  const comida = manzana.getBoundingClientRect();

  // Detecta si la manzana toca la zona superior (cabeza) del avatar
  const cerca = !(
    comida.right < avatar.left ||
    comida.left > avatar.right ||
    comida.bottom < avatar.top ||
    comida.top > avatar.top + 100
  );

  if (cerca) {
    manzana.style.display = 'none'; // Desaparece al comerla
    hacerSonidoComer();
  }
}

function reiniciarObjetos() {
  const manzana = document.getElementById('manzana');
  manzana.style.display = 'block';
  manzana.style.left = '120px';
  manzana.style.top = '310px';
}

function alternarLuz() {
  const escenario = document.getElementById('escenario');
  escenario.classList.toggle('luz-apagada');
}

// --- 3. PERSONALIZACIÓN DEL AVATAR ---
const tonosPiel = ['#F4C29F', '#8D5524', '#C68642', '#FFDBAC', '#E0AC69'];
let idxPiel = 0;

function cambiarPiel() {
  idxPiel = (idxPiel + 1) % tonosPiel.length;
  const piezas = document.querySelectorAll('#capa-cuerpo rect, #capa-cuerpo circle');
  piezas.forEach(p => p.setAttribute('fill', tonosPiel[idxPiel]));
}

const estilosPelo = [
  '<path d="M32 55 C32 15, 108 15, 108 55 C108 35, 32 35, 32 55 Z" fill="#5C3A21"/>',
  '<circle cx="35" cy="35" r="16" fill="#2B2D42"/><circle cx="105" cy="35" r="16" fill="#2B2D42"/><path d="M32 55 C32 15, 108 15, 108 55 Z" fill="#2B2D42"/>',
  '<path d="M28 75 C28 10, 112 10, 112 75 L100 75 C100 35, 40 35, 40 75 Z" fill="#E07A5F"/>'
];
let idxPelo = 0;

function cambiarPelo() {
  idxPelo = (idxPelo + 1) % estilosPelo.length;
  document.getElementById('capa-pelo').innerHTML = estilosPelo[idxPelo];
}

const coloresRopa = ['#06D6A0', '#EF476F', '#FFD166', '#9B5DE5', '#00BBF9'];
let idxRopa = 0;

function cambiarRopa() {
  idxRopa = (idxRopa + 1) % coloresRopa.length;
  document.querySelector('#capa-ropa rect').setAttribute('fill', coloresRopa[idxRopa]);
}

// Sonido sintetizado sencillo (no requiere archivos mp3 externos)
function hacerSonidoComer() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
  osc.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}