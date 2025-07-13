// Requisitos por materia
const prerequisitos = {
  'refe': ['algebra'],
  'anyp': ['AM1', 'algebra'],
  'AM2': ['AM1','algebra'],
  'fisica1': ['AM1'],
  'mates1': ['AM2'],
  'fisica2': ['fisica1'],
  'geoest': ['fundamentos', 'geogral'],
  'mates2': ['mates1'],
  'fisica3': ['AM2','fisica2'],
  'estadistica': ['AM2'],
  'geodesia': ['geogral','refe','fisica2','mates2','estadistica'],
  'mecanica': ['anyp','AM2','fisica2'],
  'analisisseñales': ['anyp', 'mates2', 'estadistica'],
};

// Funciones para guardar y cargar progreso en localStorage
function obtenerAprobados() {
  const data = localStorage.getItem('mallaAprobados');
  return data ? JSON.parse(data) : [];
}

function guardarAprobados(aprobados) {
  localStorage.setItem('mallaAprobados', JSON.stringify(aprobados));
}

// Actualiza desbloqueo de materias
function actualizarDesbloqueos() {
  const aprobados = obtenerAprobados();

  for (const [ramo, requisitos] of Object.entries(prerequisitos)) {
    const elemento = document.getElementById(ramo);
    if (!elemento) continue;

    const habilitado = requisitos.every(req => aprobados.includes(req));

    if (!elemento.classList.contains('aprobado')) {
      if (habilitado) {
        elemento.classList.remove('bloqueado');
      } else {
        elemento.classList.add('bloqueado');
      }
    } else {
      elemento.classList.remove('bloqueado');
    }
  }
}

// Aprobar/desaprobar materias
function aprobar(evento) {
  const ramo = evento.currentTarget;
  if (ramo.classList.contains('bloqueado')) return;

  ramo.classList.toggle('aprobado');

  const aprobados = obtenerAprobados();
  if (ramo.classList.contains('aprobado')) {
    if (!aprobados.includes(ramo.id)) aprobados.push(ramo.id);
  } else {
    const index = aprobados.indexOf(ramo.id);
    if (index !== -1) aprobados.splice(index, 1);
  }

  guardarAprobados(aprobados);
  actualizarDesbloqueos();
}

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
  const todos = document.querySelectorAll('.ramo');
  const aprobados = obtenerAprobados();

  todos.forEach(ramo => {
    if (aprobados.includes(ramo.id)) {
      ramo.classList.add('aprobado');
    }
    ramo.addEventListener('click', aprobar);
  });

  actualizarDesbloqueos();
});
