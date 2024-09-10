import app from "./app";
import { initializeDatabase } from "./db/conexion";

// Inicializamos la base de datos y luego arrancamos el servidor
async function main() {
  try {
    await initializeDatabase();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`**Servidor activo en -> http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  }
}

main();
