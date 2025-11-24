import request from "supertest";
import app from "../app";

// Función auxiliar para crear un usuario, loguearlo y obtener su token.
export const getAuthToken = async () => {
  const userData = {
    nombre_usuario: "Test User",
    email: `test-${Date.now()}@example.com`, // Email único
    password: "password123",
    fecha_nacimiento: "1990-01-01T00:00:00.000Z",
  };

  // 1. Registramos al usuario
  await request(app).post("/api/v1/auth/register").send(userData);

  // 2. Iniciamos sesión
  const res = await request(app).post("/api/v1/auth/login").send({
    email: userData.email,
    password: userData.password,
  });

  // 3. Devolvemos el token para usarlo en los headers
  return res.body.token;
};
