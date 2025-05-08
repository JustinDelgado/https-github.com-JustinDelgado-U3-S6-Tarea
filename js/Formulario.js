const campos = document.querySelectorAll('.campo');
const radios = document.querySelectorAll('.campo-radio');
const checks = document.querySelectorAll('.campo-check');
const barra = document.getElementById('barraProgreso');
const archivo = document.getElementById('imagen').files[0];

// Total de campos obligatorios a monitorear:
const totalCampos = campos.length + 1 + 1 + 1;  // +1 por radio, +1 por check

function actualizarProgreso() {
  let completados = 0;

  // Revisa inputs y selects
  campos.forEach(campo => {
    if (campo.value.trim() !== '') {
      completados++;
    }
  });

  // Revisa radio buttons (al menos uno seleccionado)
  const generoSeleccionado = document.querySelector('input[name="genero"]:checked');
  if (generoSeleccionado) {
    completados++;
  }

  // Revisa checkboxes (al menos uno seleccionado)
  const algunCheck = Array.from(checks).some(check => check.checked);
  if (algunCheck) {
    completados++;
  }

  const imagenSeleccionada = document.getElementById('imagen').files.length > 0;
  if (imagenSeleccionada) {
    completados++;
  }

  const porcentaje = Math.round((completados / totalCampos) * 100);

  barra.style.width = porcentaje + '%';
  barra.setAttribute('aria-valuenow', porcentaje);
  barra.textContent = porcentaje + '%';
}

// Asigna eventos
campos.forEach(campo => campo.addEventListener('input', actualizarProgreso));
radios.forEach(radio => radio.addEventListener('change', actualizarProgreso));
checks.forEach(check => check.addEventListener('change', actualizarProgreso));

document.getElementById('imagen').addEventListener('change', function(event) {
  const archivo = event.target.files[0];

  if (archivo) {
	// Mostrar la información completa en la consola
    console.log('Información del archivo seleccionado:');
    console.log('Nombre:', archivo.name);
    console.log('Tipo MIME:', archivo.type);
    console.log('Tamaño (bytes):', archivo.size);
    console.log('Última modificación:', new Date(archivo.lastModified));
    
	// Validamos que sea una imagen
    if (!archivo.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    const lector = new FileReader();

    lector.onload = function(e) {
      const preview = document.getElementById('preview');
      preview.innerHTML = `
        <p class="text-muted">Vista previa:</p>
        <img src="${e.target.result}" class="img-thumbnail mb-3" style="max-width: 300px;">
      `;
    };

    lector.readAsDataURL(archivo);
  } else {
    // Si no hay archivo seleccionado, limpiar la vista previa y ocultar el botón de descarga
    document.getElementById('preview').innerHTML = '<p class="text-muted">Aquí aparecerá la miniatura de la imagen seleccionada.</p>';
  }
  actualizarProgreso(); // Actualiza la barra de progreso al seleccionar una imagen
});
function validarFormulario(event) {
  event.preventDefault(); // Evita el envío del formulario por defecto

  // Validar campos obligatorios
  let valido = true;
  campos.forEach(campo => {
    if (campo.value.trim() === '') {
      campo.classList.add('is-invalid');
      valido = false;
    } else {
      campo.classList.remove('is-invalid');
    }
  });

  // Validar radio buttons
  const generoSeleccionado = document.querySelector('input[name="genero"]:checked');
  if (!generoSeleccionado) {
    document.querySelector('.campo-radio').classList.add('is-invalid');
    valido = false;
  } else {
    document.querySelector('.campo-radio').classList.remove('is-invalid');
  }

  // Validar checkboxes
  const algunCheck = Array.from(checks).some(check => check.checked);
  if (!algunCheck) {
    document.querySelector('.campo-check').classList.add('is-invalid');
    valido = false;
  } else {
    document.querySelector('.campo-check').classList.remove('is-invalid');
  }

  // Validar imagen
  if (!archivo) {
    alert('Por favor selecciona una imagen.');
    valido = false;
  }

  if (valido) {
    alert('Formulario enviado correctamente.');
    // Aquí puedes enviar el formulario o realizar otras acciones
  }
}
function limpiarFormulario() {
  campos.forEach(campo => {
    campo.value = '';
    campo.classList.remove('is-invalid');
  });

  radios.forEach(radio => {
    radio.checked = false;
  });

  checks.forEach(check => {
    check.checked = false;
  });

  barra.style.width = '0%';
  barra.setAttribute('aria-valuenow', '0');
  barra.textContent = '0%';
  document.getElementById('preview').innerHTML = '<p class="text-muted">Aquí aparecerá la miniatura de la imagen seleccionada.</p>';
  document.getElementById('imagen').value = ''; // Limpiar el input de imagen
}
function agregarFila() {
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const comentario = document.getElementById('comentario').value.trim();
    const colorFavorito = document.getElementById('colorFavorito').value;
    const edad = document.getElementById('edad').value;
    
    // Validar campos obligatorios
    if (!nombre || !apellido || !correo || !comentario || !colorFavorito || !edad) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }
  
    // Validar género
    const generoSeleccionado = document.querySelector('input[name="genero"]:checked');
    if (!generoSeleccionado) {
      alert('Por favor seleccione un género');
      return;
    }
    const genero = generoSeleccionado.value;
  
    // Validar intereses
    const interesesSeleccionados = Array.from(document.querySelectorAll('.campo-check:checked'));
    if (interesesSeleccionados.length === 0) {
      alert('Por favor seleccione al menos un interés');
      return;
    }
    const intereses = interesesSeleccionados.map(check => check.value).join(', ');
  
    // Validar imagen
    const imagenInput = document.getElementById('imagen');
    if (imagenInput.files.length === 0) {
      alert('Por favor seleccione una imagen');
      return;
    }
    const imagen = imagenInput.files[0];
    const imagenUrl = URL.createObjectURL(imagen);
  
    // Crear nueva fila en la tabla
    const tabla = document.getElementById('tablaDatos').getElementsByTagName('tbody')[0];
    const fila = tabla.insertRow(-1);
    
    fila.innerHTML = `
      <td>${nombre}</td>
      <td>${apellido}</td>
      <td>${correo}</td>
      <td>${comentario}</td>
      <td>${colorFavorito}</td>
      <td>${genero}</td>
      <td>${intereses}</td>
      <td>${edad}</td>
      <td><img src="${imagenUrl}" class="img-thumbnail" style="max-width: 100px;"></td>
    `;
  
    limpiarFormulario();
  }