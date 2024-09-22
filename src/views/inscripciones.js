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
      event.preventDefault();

      // Obtener los valores seleccionados del formulario
      const estudiante_id = document.getElementById("estudiante").value;
      const curso_id = document.getElementById("curso").value;
      const nota = document.getElementById("nota").value;

      // Validar los campos del formulario de inscripción
      const validacionExitosa = validarInscripcion(
        estudiante_id,
        curso_id,
        nota
      );
      if (!validacionExitosa) {
        return;
      } else {
        // Preparar el objeto con los datos de inscripción
        const inscripcion = {
          estudiante_id,
          curso_id,
          nota: nota ? nota : null,
        };
        await inscribirEstudiante(inscripcion);
        document.getElementById("form-inscripcion").reset();
      }
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

/**** VALIDACION ****/
function validarInscripcion(estudiante_id, curso_id, nota) {
  const estudianteVal = /^\d+$/;
  const cursoVal = /^\d+$/;
  const notaVal = /^\d+$/;

  if (!estudianteVal.test(estudiante_id)) {
    Swal.fire({
      icon: "error",
      title: "Estudiante inválido",
      text: "El estudiante no existe.",
    });
    return false;
  }

  if (!cursoVal.test(curso_id)) {
    Swal.fire({
      icon: "error",
      title: "Curso inválido",
      text: "El curso no existe.",
    });
    return false;
  }

  // if (!notaVal.test(nota) || nota !== null) {
  if (nota && (isNaN(nota) || nota < 1 || nota > 10)) {
    Swal.fire({
      icon: "error",
      title: "Error en la inscripción",
      text: "La nota, si se proporciona, debe estar entre 1 y 10.",
    });
    return false;
  }

  return true;
}

function validarNota(nota) {
  const notaVal = /^\d+$/;

  if (!nota || isNaN(nota) || nota < 1 || nota > 10 || !notaVal.test(nota)) {
    Swal.fire({
      icon: "error",
      title: "Nota inválida",
      text: "La nota debe estar entre 1 y 10.",
    });
    return;
  }
  return true;
}

/**** OBTENER INSCRIPCIONES ****/
async function obtenerInscripciones() {
  try {
    const response = await fetch("http://localhost:3000/inscripciones"); // URL de tu backend
    const inscripciones = await response.json();
    llenarTablaInscripciones(inscripciones);
  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
  }
}

/**** CARGAR CURSOS EN CONSULTAS ****/
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

/**** CARGAR ESTUDIANTES EN CONSULTAS ****/
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

/**** CARGAR CURSOS EN INSCRIPCIONES ****/
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

/**** CARGAR ESTUDIANTES EN INSCRIPCIONES ****/
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

/**** LLENAR TABLA DE INSCRIPCIONES ****/
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
        <button class="btn-modificar" onclick="modificarNota(${curso_id}, ${estudiante_id})"><i class="fas fa-pencil-alt"></i></button>
        <button class="btn-eliminar" onclick="eliminarInscripcion(${curso_id}, ${estudiante_id})"><i class="fas fa-times"></i></button>
      </td>
    `;

    tablaInscripciones.appendChild(fila);
  });
}

/**** OBTENER INSCRIPCIONES POR CURSO ****/
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
      Swal.fire({
        icon: "warning",
        title: "Sin inscripciones",
        text: "No se encontraron alumnos inscriptos para este curso.",
      });
      llenarTablaInscripciones([]); // Pasar un array vacío
    } else {
      throw new Error("Error inesperado al obtener inscripciones.");
    }
  } catch (error) {
    console.error("Error al obtener inscripciones por curso:", error);
  }
}

/**** OBTENER INSCRIPCIONES POR ESTUDIANTE ****/
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
      Swal.fire({
        icon: "warning",
        title: "Sin inscripciones",
        text: "No se encontraron inscripciones para este estudiante.",
      });
      llenarTablaInscripciones([]); // Pasar un array vacío
    } else {
      throw new Error("Error inesperado al obtener inscripciones.");
    }
  } catch (error) {
    console.error("Error al obtener inscripciones por estudiante:", error);
  }
}

/**** INSCRIBIR ESTUDIANTE ****/
async function inscribirEstudiante(inscripcion) {
  try {
    const response = await fetch("http://localhost:3000/inscripciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inscripcion), // Convertir los datos a JSON
    });

    const result = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Inscripción realizada",
        text: "La inscripción ha sido realizada correctamente.",
      });
      obtenerInscripciones(); // Recargar la lista de inscripciones
    } else if (
      result.message === "El estudiante ya está inscrito en este curso."
    ) {
      Swal.fire({
        icon: "warning",
        title: "No se puede inscribir",
        text: "El estudiante ya está inscrito en este curso.",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al inscribir",
        text: "Hubo un problema al inscribir al estudiante.",
      });
    }
  } catch (error) {
    console.error("Error al inscribir estudiante:", error);
  }
}

/**** ELIMINAR INSCRIPCION ****/
async function eliminarInscripcion(curso_id, estudiante_id) {
  Swal.fire({
    title: "¿Está seguro?",
    text: "No podrá revertir esta acción. ¿Desea eliminar la inscripción?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#145c17",
    cancelButtonColor: "#6b1515",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3000/inscripciones/curso/${curso_id}/estudiante/${estudiante_id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Inscripción eliminada",
            text: "La inscripción ha sido eliminada correctamente.",
          });
          obtenerInscripciones(); // Recargar la lista de inscripciones
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: "Hubo un problema al eliminar la inscripción.",
          });
        }
      } catch (error) {
        console.error("Error al eliminar inscripción:", error);
      }
    }
  });
}

/*-------------------------- */
/**** MODIFICAR NOTA + POP UP ****/
function modificarNota(curso_id, estudiante_id) {
  // Abrir el pop up
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

// Cerrar el pop up cuando se hace click en la "X"
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

    // Validación: la nota no debe estar vacía y debe ser un número entre 1 y 10
    if (!validarNota(nuevaNota)) {
      return;
    }

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
        Swal.fire({
          icon: "success",
          title: "Nota modificada",
          text: "La nota ha sido modificada correctamente.",
        });
        document.getElementById("modal-modificar-nota").style.display = "none"; // Cerrar el pop up
        obtenerInscripciones(); // Refrescar tabla de inscripciones
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al modificar la nota",
          text: "Hubo un problema al modificar la nota.",
        });
      }
    } catch (error) {
      console.error("Error en la solicitud de modificación:", error);
    }
  });
