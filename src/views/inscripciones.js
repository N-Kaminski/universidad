document.getElementById("modal-modificar-nota").style.display = "none";

document.addEventListener("DOMContentLoaded", () => {
  // Cargar cursos y estudiantes al cargar la página
  cargarCursosConsultas();
  cargarEstudiantesConsultas();
  cargarCursosInscribir();
  cargarEstudiantesInscribir();

  // INSCRIBIR ALUMNO
  document
    .getElementById("form-inscripcion")
    .addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevenir que el formulario recargue la página

      // Obtener los valores seleccionados del formulario
      const estudiante_id = document.getElementById("estudiante").value;
      const curso_id = document.getElementById("curso").value;
      const nota = document.getElementById("nota").value;

      // Preparar el objeto con los datos de inscripción
      const inscripcion = { estudiante_id, curso_id, nota };

      await inscribirEstudiante(inscripcion);
      document.getElementById("form-inscripcion").reset();
    });

  // CONSULTAR INSCRIPCIONES boton
  const botonConsultarTodas = document.getElementById("consultar-todas");
  botonConsultarTodas.addEventListener("click", obtenerInscripciones);

  // CONSULTAR ALUMNOS por curso
  document
    .getElementById("form-consultar-curso")
    .addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevenir que el formulario recargue la página
      const curso_id = document.getElementById("consulta-curso").value;
      await obtenerInscripcionesPorCurso(curso_id);
    });

  // CONSULTAR CURSOS por estudiante
  document
    .getElementById("form-consultar-estudiante")
    .addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevenir que el formulario recargue la página
      const estudiante_id = document.getElementById(
        "consulta-estudiante"
      ).value;
      await obtenerInscripcionesPorEstudiante(estudiante_id);
    });
});

// OBTENER Y MOSTRAR LAS INSCRIPCIONES
async function obtenerInscripciones() {
  try {
    const response = await fetch("http://localhost:3000/inscripciones"); // URL de tu backend
    const inscripciones = await response.json();
    llenarTablaInscripciones(inscripciones);
  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
  }
}

// CARGAR CURSOS EN CONSULTAS
async function cargarCursosConsultas() {
  try {
    const response = await fetch("http://localhost:3000/cursos"); // URL de tu backend
    const cursos = await response.json();

    const selectCurso = document.getElementById("consulta-curso");

    cursos.forEach((curso) => {
      const option = document.createElement("option");
      option.value = curso.id;
      option.textContent = curso.nombre;
      selectCurso.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar cursos:", error);
  }
}

// CARGAR ESTUDIANTES EN CONSULTAS
async function cargarEstudiantesConsultas() {
  try {
    const response = await fetch("http://localhost:3000/estudiantes"); // URL de tu backend
    const estudiantes = await response.json();

    const selectEstudiante = document.getElementById("consulta-estudiante");
    estudiantes.forEach((estudiante) => {
      const option = document.createElement("option");
      option.value = estudiante.id;
      option.textContent = `${estudiante.nombre} ${estudiante.apellido}`;
      selectEstudiante.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar estudiantes:", error);
  }
}

// CARGAR CURSOS EN INSCRIPCIONES
async function cargarCursosInscribir() {
  try {
    const response = await fetch("http://localhost:3000/cursos"); // URL de tu backend
    const cursos = await response.json();

    const selectCurso = document.getElementById("curso");

    cursos.forEach((curso) => {
      const option = document.createElement("option");
      option.value = curso.id;
      option.textContent = curso.nombre;
      selectCurso.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar cursos:", error);
  }
}

// CARGAR ESTUDIANTES EN INSCRIPCIONES
async function cargarEstudiantesInscribir() {
  try {
    const response = await fetch("http://localhost:3000/estudiantes"); // URL de tu backend
    const estudiantes = await response.json();

    const selectEstudiante = document.getElementById("estudiante");
    estudiantes.forEach((estudiante) => {
      const option = document.createElement("option");
      option.value = estudiante.id;
      option.textContent = `${estudiante.nombre} ${estudiante.apellido}`;
      selectEstudiante.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar estudiantes:", error);
  }
}

// LLENAR TABLA DE INSCRIPCIONES
function llenarTablaInscripciones(inscripciones) {
  const tablaInscripciones = document.getElementById("tabla-inscripciones");
  tablaInscripciones.innerHTML = ""; // Limpiar la tabla antes de rellenarla

  inscripciones.forEach((inscripcion) => {
    const curso_id = inscripcion.curso ? inscripcion.curso.id : undefined;
    const estudiante_id = inscripcion.estudiante
      ? inscripcion.estudiante.id
      : undefined;

    // Si curso_id o estudiante_id están indefinidos, haz un log de error para depurar
    if (!curso_id || !estudiante_id) {
      console.error(
        "Falta curso_id o estudiante_id en la inscripción:",
        inscripcion
      );
    }

    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${inscripcion.curso.nombre}</td>
      <td>${inscripcion.estudiante.nombre} ${
      inscripcion.estudiante.apellido
    }</td>
      <td>${inscripcion.nota || "No asignada"}</td>
      <td class="tabla-accion">
        <button onclick="modificarNota(${curso_id}, ${estudiante_id})">Modificar Nota</button>
        <button onclick="eliminarInscripcion(${curso_id}, ${estudiante_id})">Eliminar</button>
      </td>
    `;

    tablaInscripciones.appendChild(fila);
  });
}

// OBTENER ALUMNOS POR CURSO
async function obtenerInscripcionesPorCurso(curso_id) {
  try {
    const response = await fetch(
      // `http://localhost:3000/inscripciones?curso_id=${curso_id}`
      `http://localhost:3000/inscripciones/curso/${curso_id}`
    );
    if (response.ok) {
      const inscripciones = await response.json();
      llenarTablaInscripciones(inscripciones);
    } else if (response.status === 404) {
      // Si el curso no tiene inscripciones, llenamos la tabla con un array vacío
      console.warn("No se encontraron inscripciones para este curso.");
      llenarTablaInscripciones([]); // Pasar un array vacío
    } else {
      throw new Error("Error inesperado al obtener inscripciones.");
    }
  } catch (error) {
    console.error("Error al obtener inscripciones por curso:", error);
  }
}

// OBTENER CURSOS POR ESTUDIANTE
async function obtenerInscripcionesPorEstudiante(estudiante_id) {
  try {
    const response = await fetch(
      // `http://localhost:3000/inscripciones?estudiante_id=${estudiante_id}`
      `http://localhost:3000/inscripciones/estudiante/${estudiante_id}`
    );
    if (response.ok) {
      const inscripciones = await response.json();
      llenarTablaInscripciones(inscripciones);
    } else if (response.status === 404) {
      console.warn("No se encontraron inscripciones para este estudiante.");
      llenarTablaInscripciones([]); // Pasar un array vacío
    } else {
      throw new Error("Error inesperado al obtener inscripciones.");
    }
  } catch (error) {
    console.error("Error al obtener inscripciones por estudiante:", error);
  }
}

// INSCRIBIR ALUMNO POST
async function inscribirEstudiante(inscripcion) {
  try {
    const response = await fetch("http://localhost:3000/inscripciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inscripcion), // Convertir los datos a JSON
    });

    if (response.ok) {
      alert("Inscripción realizada correctamente.");
      obtenerInscripciones(); // Recargar la lista de inscripciones
    } else {
      console.error("Error al inscribir estudiante");
      alert("Hubo un problema al inscribir al estudiante.");
    }
  } catch (error) {
    console.error("Error al inscribir estudiante:", error);
    alert("Hubo un error al intentar inscribir al estudiante.");
  }
}

// ELIMINAR INSCRIPCION DELETE
async function eliminarInscripcion(curso_id, estudiante_id) {
  try {
    const response = await fetch(
      `http://localhost:3000/inscripciones/curso/${curso_id}/estudiante/${estudiante_id}`,
      {
        method: "DELETE",
        /*headers: {
        "Content-Type": "application/json",
      },*/
      }
    );
    if (response.ok) {
      alert("Inscripción eliminada correctamente.");
      obtenerInscripciones(); // Recargar la lista de inscripciones
    } else {
      console.error("Error al eliminar inscripción");
      alert("Hubo un problema al eliminar la inscripción.");
    }
  } catch (error) {
    console.error("Error al eliminar inscripción:", error);
    alert("Hubo un error al intentar eliminar la inscripción.");
  }
}

/*-------------------------- */
// ABRIR POPAP Y MODIFICAR NOTA
function modificarNota(curso_id, estudiante_id) {
  // Abrir el modal
  const modal = document.getElementById("modal-modificar-nota");
  modal.style.display = "block";

  // Cargar datos en los inputs ocultos
  document.getElementById("modificar-inscripcion-id").value = JSON.stringify({
    curso_id,
    estudiante_id,
  });

  // Obtener la inscripción actual
  fetch(
    `http://localhost:3000/inscripciones/curso/${curso_id}/estudiante/${estudiante_id}`
  )
    .then((response) => response.json())
    .then((data) => {
      // Cargar la nota actual en el campo de nota
      document.getElementById("modificar-nota").value = data.nota || "";
    })
    .catch((error) => {
      console.error("Error al cargar la inscripción:", error);
    });
}

// Cerrar el modal cuando se hace click en la "X"
document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("modal-modificar-nota").style.display = "none";
});

//MODIFICAR NOTA PUT
document
  .getElementById("form-modificar-nota")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const { curso_id, estudiante_id } = JSON.parse(
      document.getElementById("modificar-inscripcion-id").value
    );
    const nuevaNota = document.getElementById("modificar-nota").value;

    const data = {
      curso_id,
      estudiante_id,
      nota: nuevaNota,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/inscripciones/curso/${curso_id}/estudiante/${estudiante_id}`,
        {
          method: "PUT", // Método PUT para actualizar
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        alert("Nota modificada correctamente.");
        document.getElementById("modal-modificar-nota").style.display = "none"; // Cerrar modal
        obtenerInscripciones(); // Refrescar tabla de inscripciones
      } else {
        console.error("Error al modificar la nota.");
        alert("Hubo un problema al modificar la nota.");
      }
    } catch (error) {
      console.error("Error en la solicitud de modificación:", error);
      alert("Hubo un error al intentar modificar la nota.");
    }
  });
