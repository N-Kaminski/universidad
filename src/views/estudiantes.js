document.getElementById("modal-modificar").style.display = "none";

document.addEventListener("DOMContentLoaded", () => {
  // Obtener y mostrar la lista de estudiantes al cargar la página
  obtenerEstudiantes();

  // Agregar estudiante
  const formEstudiante = document.getElementById("form-estudiante");
  formEstudiante.addEventListener("submit", async (event) => {
    event.preventDefault();
    const dni = document.getElementById("dni").value;
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;

    if (!validarEstudiante(dni, nombre, apellido, email)) {
      return;
    } else {
      const nuevoEstudiante = { dni, nombre, apellido, email };
      await agregarEstudiante(nuevoEstudiante);
      formEstudiante.reset();
    }
  });
});

/**** VALIDACION ****/
function validarEstudiante(dni, nombre, apellido, email) {
  const dniVal = /^\d{8,8}$/; // Solo números, 8 dígitos
  const nombreApellidoVal = /^[a-zA-Z\s]{3,50}$/; // Solo letras y espacios
  const emailVal = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email con formato correcto

  // Validación de campos vacíos
  if (!dni || !nombre || !apellido || !email) {
    Swal.fire({
      icon: "error",
      title: "Campos incompletos",
      text: "Por favor, complete todos los campos.",
    });
    return false;
  }

  // Validación de DNI (numérico y de 8 dígitos)
  if (!dniVal.test(dni)) {
    Swal.fire({
      icon: "error",
      title: "Error en el DNI",
      text: "El DNI debe ser numérico y tener 8 dígitos.",
    });
    return false;
  }

  // Validación de Nombre (alfabético y no vacío)
  if (!nombreApellidoVal.test(nombre) || nombre.length < 2) {
    Swal.fire({
      icon: "error",
      title: "Error en el Nombre",
      text: "El nombre debe ser mas largo",
    });
    return false;
  }

  // Validación de Apellido (igual que Nombre)
  if (!nombreApellidoVal.test(apellido) || apellido.length < 2) {
    Swal.fire({
      icon: "error",
      title: "Error en el Apellido",
      text: "El apellido debe ser mas largo",
    });
    return false;
  }

  if (!emailVal.test(email)) {
    Swal.fire({
      icon: "error",
      title: "Error en el Email",
      text: "Debes ingresar un correo electrónico válido.",
    });
    return false;
  }

  // Si todo está correcto
  return true;
}

/**** OBTENER LISTA DE ESTUDIANTES ****/
async function obtenerEstudiantes() {
  try {
    const response = await fetch("http://localhost:3000/estudiantes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const estudiantes = await response.json();
    const tbody = document.querySelector("#tabla-estudiantes");
    tbody.innerHTML = ""; // Limpiar la tabla antes de añadir nuevos datos

    estudiantes.forEach((estudiante) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${estudiante.id}</td>
                <td>${estudiante.dni}</td>
                <td>${estudiante.nombre}</td>
                <td>${estudiante.apellido}</td>
                <td>${estudiante.email}</td>
                <td class= "tabla-accion">
                  <button class="btn-modificar" onclick="mostrarFormularioModificar(${estudiante.id})"> <i class="fas fa-pencil-alt"></i>  </button>
                  <button class="btn-eliminar" onclick="eliminarEstudiante(${estudiante.id})"> <i class="fas fa-times"></i>  </button>
                </td>
            `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
  }
}

/**** AGREGAR NUEVO ESTUDIANTE ****/
async function agregarEstudiante(estudiante) {
  try {
    const response = await fetch("http://localhost:3000/estudiantes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(estudiante),
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Estudiante agregado",
        text: "El estudiante ha sido agregado exitosamente.",
      });
      obtenerEstudiantes(); // Actualizar la lista de estudiantes
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al agregar estudiante",
        text: "No se pudo agregar el estudiante.",
      });
    }
  } catch (error) {
    console.error("Error al agregar estudiante:", error);
  }
}

/**** ELIMINAR ESTUDIANTE ****/
async function eliminarEstudiante(id) {
  Swal.fire({
    title: "¿Está seguro?",
    text: "No podrá revertir esta acción. ¿Desea eliminar al estudiante?",
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
          `http://localhost:3000/estudiantes/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Estudiante eliminado",
            text: "El estudiante ha sido eliminado exitosamente.",
            timer: 1500,
          });
          obtenerEstudiantes(); // Actualizar la lista después de eliminar
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: "No se pudo eliminar el estudiante.",
            footer: "Verifique si el alumno se encuentra inscripto a un curso",
          });
        }
      } catch (error) {
        console.error("Error al eliminar estudiante:", error);
      }
    }
  });
}

/**** MODIFICAR ESTUDIANTE ****/
async function mostrarFormularioModificar(id) {
  try {
    const response = await fetch(`http://localhost:3000/estudiantes/${id}`);
    const estudiante = await response.json();

    // Rellenar los campos del pop up
    document.getElementById("modificar-id").value = estudiante.id;
    document.getElementById("modificar-dni").value = estudiante.dni;
    document.getElementById("modificar-nombre").value = estudiante.nombre;
    document.getElementById("modificar-apellido").value = estudiante.apellido;
    document.getElementById("modificar-email").value = estudiante.email;

    // Abrir el pop up
    document.getElementById("modal-modificar").style.display = "block";
  } catch (error) {
    console.error("Error al obtener estudiante:", error);
  }
}

// Manejar la modificación de un estudiante
document
  .getElementById("form-modificar")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("modificar-id").value;
    const dni = document.getElementById("modificar-dni").value;
    const nombre = document.getElementById("modificar-nombre").value;
    const apellido = document.getElementById("modificar-apellido").value;
    const email = document.getElementById("modificar-email").value;

    // Llamar a la función de validación
    const validacionExitosa = validarEstudiante(dni, nombre, apellido, email);

    if (!validacionExitosa) {
      return; // Detener la ejecución si hay errores de validación
    }
    const estudianteModificado = { dni, nombre, apellido, email };
    await modificarEstudiante(id, estudianteModificado);
  });

// Modificar el estudiante
async function modificarEstudiante(id, estudianteModificado) {
  try {
    const response = await fetch(`http://localhost:3000/estudiantes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(estudianteModificado),
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Estudiante modificado",
        text: "El estudiante ha sido modificado exitosamente.",
      });
      document.getElementById("modal-modificar").style.display = "none";
      await obtenerEstudiantes();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al modificar",
        text: "No se pudo modificar el estudiante.",
      });
    }
  } catch (error) {
    console.error("Error al modificar estudiante:", error);
  }
}

// Cerrar el pop up cuando el usuario haga clic fuera
window.onclick = function (event) {
  const modal = document.getElementById("modal-modificar");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Cerrar el pop up cuando el usuario haga clic en la 'X'
document.querySelector(".close").onclick = function () {
  document.getElementById("modal-modificar").style.display = "none";
};
