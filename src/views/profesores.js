document.getElementById("modal-modificar").style.display = "none";

document.addEventListener("DOMContentLoaded", () => {
  obtenerProfesores();

  // Agregar profesor
  const formProfesor = document.getElementById("form-profesor");
  formProfesor.addEventListener("submit", async (event) => {
    event.preventDefault();
    const dni = document.getElementById("dni").value;
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const profesion = document.getElementById("profesion").value;
    const telefono = document.getElementById("telefono").value;

    const nuevoProfesor = { dni, nombre, apellido, email, profesion, telefono };
    await agregarProfesor(nuevoProfesor);
    formProfesor.reset();
  });
});

// Obtener la lista de profesores
async function obtenerProfesores() {
  try {
    const response = await fetch("http://localhost:3000/profesores", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const profesores = await response.json();
    const tbody = document.querySelector("#tabla-profesores");
    tbody.innerHTML = "";

    profesores.forEach((profesor) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${profesor.id}</td>
                <td>${profesor.dni}</td>
                <td>${profesor.nombre}</td>
                <td>${profesor.apellido}</td>
                <td>${profesor.email}</td>
                <td>${profesor.profesion}</td>
                <td>${profesor.telefono}</td>
                <td class= "tabla-accion">
                    <button onclick="eliminarProfesor(${profesor.id})">Eliminar</button>
                    <button onclick="mostrarFormularioModificar(${profesor.id})">Modificar</button>
                </td>
            `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error al obtener profesores:", error);
  }
}

// Agregar un nuevo profesor
async function agregarProfesor(profesor) {
  try {
    const response = await fetch("http://localhost:3000/profesores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profesor),
    });

    if (response.ok) {
      obtenerProfesores(); // Actualizar la lista de profesores
    } else {
      console.error("Error al agregar profesor");
    }
  } catch (error) {
    console.error("Error al agregar profesor:", error);
  }
}

// Eliminar un profesor
async function eliminarProfesor(id) {
  try {
    const response = await fetch(`http://localhost:3000/profesores/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      obtenerProfesores(); // Actualizar la lista después de eliminar
    } else {
      console.error("Error al eliminar profesor");
    }
  } catch (error) {
    console.error("Error al eliminar profesor:", error);
  }
}

// Mostrar el formulario de modificación de profesor con los datos cargados
async function mostrarFormularioModificar(id) {
  try {
    const response = await fetch(`http://localhost:3000/profesores/${id}`);
    const profesor = await response.json();

    document.getElementById("modificar-id").value = profesor.id;
    document.getElementById("modificar-dni").value = profesor.dni;
    document.getElementById("modificar-nombre").value = profesor.nombre;
    document.getElementById("modificar-apellido").value = profesor.apellido;
    document.getElementById("modificar-email").value = profesor.email;
    document.getElementById("modificar-profesion").value = profesor.profesion;
    document.getElementById("modificar-telefono").value = profesor.telefono;

    document.getElementById("modal-modificar").style.display = "block";
  } catch (error) {
    console.error("Error al cargar los datos del profesor:", error);
  }
}

// Manejar la modificación de un profesor
document
  .getElementById("form-modificar")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("modificar-id").value;
    const dni = document.getElementById("modificar-dni").value;
    const nombre = document.getElementById("modificar-nombre").value;
    const apellido = document.getElementById("modificar-apellido").value;
    const email = document.getElementById("modificar-email").value;
    const profesion = document.getElementById("modificar-profesion").value;
    const telefono = document.getElementById("modificar-telefono").value;

    const profesorModificado = {
      dni,
      nombre,
      apellido,
      email,
      profesion,
      telefono,
    };

    await modificarProfesor(id, profesorModificado);
  });

// Modificar un profesor
async function modificarProfesor(id, profesorModificado) {
  try {
    const response = await fetch(`http://localhost:3000/profesores/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profesorModificado),
    });

    if (response.ok) {
      document.getElementById("modal-modificar").style.display = "none";
      await obtenerProfesores(); // Actualizar la lista de profesores
    } else {
      console.error("Error al modificar el profesor");
    }
  } catch (error) {
    console.error("Error al modificar el profesor:", error);
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
