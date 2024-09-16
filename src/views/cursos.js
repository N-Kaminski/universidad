document.getElementById("modal-modificar").style.display = "none";

// Se ejecuta cuando el documento está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Cargar la lista de cursos

  obtenerCursos();

  // Cargar la lista de profesores en el formulario de agregar curso
  obtenerProfesoresParaFormulario();

  // Evento para manejar el envío del formulario de agregar curso
  const formCurso = document.getElementById("form-curso");
  formCurso.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evitar que se recargue la página
    const nombre = document.getElementById("nombre").value; // Obtener el nombre del curso
    const descripcion = document.getElementById("descripcion").value; // Obtener la descripción del curso
    const profesor_id = document.getElementById("profesor").value; // Obtener el id del profesor seleccionado

    // Crear un objeto con los datos del curso nuevo
    const nuevoCurso = { nombre, descripcion, profesor_id };
    // Llamar a la función agregarCurso, que se encarga de enviarlo al backend
    await agregarCurso(nuevoCurso);
    formCurso.reset(); // Reiniciar el formulario después de agregar
  });
});

// Obtener la lista de cursos desde el servidor
async function obtenerCursos() {
  try {
    // Realizar una solicitud GET al servidor
    const response = await fetch("http://localhost:3000/cursos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const cursos = await response.json(); // Parsear la respuesta a JSON
    const tbody = document.querySelector("#tabla-cursos"); // Obtener el cuerpo de la tabla
    tbody.innerHTML = ""; // Limpiar la tabla antes de insertar nuevos datos

    // Iterar sobre cada curso recibido y agregar una fila a la tabla
    cursos.forEach((curso) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${curso.id}</td>
            <td>${curso.nombre}</td>
            <td>${curso.descripcion}</td>
            <td>${curso.profesor.nombre} ${curso.profesor.apellido}</td>
            <td class= "tabla-accion">
                <button onclick="eliminarCurso(${curso.id})">Eliminar</button>
                <button onclick="mostrarFormularioModificar(${curso.id})">Modificar</button>
            </td>
          `;
      tbody.appendChild(row); // Agregar la fila a la tabla
    });
  } catch (error) {
    console.error("Error al obtener cursos:", error);
  }
}

// Obtener la lista de profesores para el formulario de agregar curso
async function obtenerProfesoresParaFormulario() {
  try {
    const response = await fetch("http://localhost:3000/profesores");
    const profesores = await response.json(); // Parsear la respuesta a JSON
    const selectProfesor = document.getElementById("profesor"); // Select del formulario de profesores

    // Poblar el select con los profesores obtenidos
    profesores.forEach((profesor) => {
      const option = document.createElement("option");
      option.value = profesor.id;
      option.text = `${profesor.nombre} ${profesor.apellido}`;
      selectProfesor.appendChild(option); // Añadir el profesor como opción
    });
  } catch (error) {
    console.error("Error al obtener profesores:", error);
  }
}

// Agregar un nuevo curso al backend
async function agregarCurso(curso) {
  try {
    const response = await fetch("http://localhost:3000/cursos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(curso), // Convertir el objeto curso a JSON para enviarlo
    });

    if (response.ok) {
      alert("Curso agregado correctamente.");
      obtenerCursos(); // Volver a cargar la lista de cursos
    } else {
      console.error("Error al agregar curso");
    }
  } catch (error) {
    console.error("Error al agregar curso:", error);
  }
}

// Eliminar un curso
async function eliminarCurso(id) {
  try {
    const response = await fetch(`http://localhost:3000/cursos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Curso eliminado correctamente.");
      obtenerCursos(); // Volver a cargar la lista de cursos después de eliminar
    } else {
      console.error("Error al eliminar curso");
    }
  } catch (error) {
    console.error("Error al eliminar curso:", error);
  }
}

// Mostrar el formulario para modificar un curso
async function mostrarFormularioModificar(id) {
  try {
    const response = await fetch(`http://localhost:3000/cursos/${id}`);
    const curso = await response.json(); // Obtener los datos del curso

    // Llenar los campos del formulario con los datos actuales del curso
    document.getElementById("modificar-id").value = curso.id;
    document.getElementById("modificar-nombre").value = curso.nombre;
    document.getElementById("modificar-descripcion").value = curso.descripcion;

    // Obtener lista de profesores para el formulario de modificar
    const profesoresResponse = await fetch("http://localhost:3000/profesores");
    const profesores = await profesoresResponse.json();
    const selectProfesorModificar =
      document.getElementById("modificar-profesor");

    // Limpiar el select de profesores antes de poblarlo
    selectProfesorModificar.innerHTML = "";

    // Poblar el select con los profesores y seleccionar el que corresponde al curso
    profesores.forEach((profesor) => {
      const option = document.createElement("option");
      option.value = profesor.id;
      option.text = `${profesor.nombre} ${profesor.apellido}`;
      // Seleccionar el profesor correcto que corresponde al curso
      if (profesor.id === curso.profesor.id) {
        // Aquí usamos el campo profesor_id
        option.selected = true; // Marcamos el profesor asignado como seleccionado
      }
      selectProfesorModificar.appendChild(option);
    });

    // Mostrar el modal de modificar
    document.getElementById("modal-modificar").style.display = "block";
  } catch (error) {
    console.error("Error al cargar los datos del curso:", error);
  }
}

// Evento para manejar el envío del formulario de modificación
document
  .getElementById("form-modificar")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar el comportamiento predeterminado del formulario

    // Obtener los nuevos valores del formulario de modificación
    const id = document.getElementById("modificar-id").value;
    const nombre = document.getElementById("modificar-nombre").value;
    const descripcion = document.getElementById("modificar-descripcion").value;
    const profesor_id = document.getElementById("modificar-profesor").value;

    // Crear un objeto con los nuevos valores del curso
    const cursoModificado = { nombre, descripcion, profesor_id };

    // Llamar a la función que envía los nuevos datos al servidor
    await modificarCurso(id, cursoModificado);
  });

// Enviar la solicitud de modificación del curso al servidor
async function modificarCurso(id, cursoModificado) {
  try {
    const response = await fetch(`http://localhost:3000/cursos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cursoModificado), // Convertir el curso modificado a JSON
    });

    if (response.ok) {
      alert("Curso modificado correctamente.");
      document.getElementById("modal-modificar").style.display = "none"; // Cerrar el modal
      obtenerCursos(); // Recargar la lista de cursos
    } else {
      console.error("Error al modificar curso");
    }
  } catch (error) {
    console.error("Error al modificar curso:", error);
  }
}

// Cerrar el modal cuando el usuario haga clic fuera del modal
window.onclick = function (event) {
  const modal = document.getElementById("modal-modificar");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Cerrar el modal cuando el usuario haga clic en la 'X'
document.querySelector(".close").onclick = function () {
  document.getElementById("modal-modificar").style.display = "none";
};
