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

    const nuevoEstudiante = { dni, nombre, apellido, email };
    await agregarEstudiante(nuevoEstudiante);
    formEstudiante.reset();
  });
});

// Obtener la lista de estudiantes
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

    if (Array.isArray(estudiantes)) {
      estudiantes.forEach((estudiante) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${estudiante.id}</td>
                <td>${estudiante.dni}</td>
                <td>${estudiante.nombre}</td>
                <td>${estudiante.apellido}</td>
                <td>${estudiante.email}</td>
                <td class= "tabla-accion">
                    <button onclick="eliminarEstudiante(${estudiante.id})">Eliminar</button>
                    <button onclick="mostrarFormularioModificar(${estudiante.id})">Modificar</button>
                </td>
            `;
        tbody.appendChild(row);
      });
    } else {
      console.error("La respuesta no es un array de estudiantes", estudiantes);
    }
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
  }
}

// Agregar un nuevo estudiante
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
      obtenerEstudiantes(); // Actualizar la lista de estudiantes
    } else {
      console.error("Error al agregar estudiante");
    }
  } catch (error) {
    console.error("Error al agregar estudiante:", error);
  }
}

// Eliminar un estudiante
async function eliminarEstudiante(id) {
  try {
    const response = await fetch(`http://localhost:3000/estudiantes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      obtenerEstudiantes(); // Actualizar la lista después de eliminar
    } else {
      console.error("Error al eliminar estudiante");
    }
  } catch (error) {
    console.error("Error al eliminar estudiante:", error);
  }
}

// Abrir el modal y rellenar el formulario con los datos del estudiante
async function mostrarFormularioModificar(id) {
  try {
    const response = await fetch(`http://localhost:3000/estudiantes/${id}`);
    const estudiante = await response.json();

    // Rellenar los campos del modal
    document.getElementById("modificar-id").value = estudiante.id;
    document.getElementById("modificar-dni").value = estudiante.dni;
    document.getElementById("modificar-nombre").value = estudiante.nombre;
    document.getElementById("modificar-apellido").value = estudiante.apellido;
    document.getElementById("modificar-email").value = estudiante.email;

    // Abrir el modal
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

    const estudianteModificado = { dni, nombre, apellido, email };

    await modificarEstudiante(id, estudianteModificado);
  });

// HModificar el estudiante
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
      // Cerrar el modal y actualizar la lista de estudiantes
      document.getElementById("modal-modificar").style.display = "none";
      await obtenerEstudiantes();
    } else {
      console.error("Error al modificar estudiante");
    }
  } catch (error) {
    console.error("Error al modificar estudiante:", error);
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
