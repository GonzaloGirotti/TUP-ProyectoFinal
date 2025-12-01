import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../app";
import { getAuthToken } from "./helpers";

describe("Módulo de Comidas (API)", () => {
  // Datos de prueba
  const comidaData = {
    nombre_comida: "Almuerzo de Prueba",
    fecha: new Date().toISOString(), // Enviamos fecha actual
  };

  // 1. Prueba de CREACIÓN (POST)
  it("POST /api/v1/comidas - Debería crear una comida si estoy autenticado", async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .post("/api/v1/comidas")
      .set("Authorization", `Bearer ${token}`)
      .send(comidaData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id_comida");
    expect(res.body.nombre_comida).toBe(comidaData.nombre_comida);
    // Verificamos que se haya vinculado al usuario del token
    expect(res.body).toHaveProperty("id_usuario");
  });

  // 2. Prueba de SEGURIDAD (Sin Token)
  it("POST /api/v1/comidas - Debería fallar (401) sin token", async () => {
    const res = await request(app).post("/api/v1/comidas").send(comidaData);

    expect(res.status).toBe(401);
    expect(res.body.message).toContain("Acceso denegado");
  });

  // 3. Prueba de VALIDACIÓN (Faltan datos)
  it("POST /api/v1/comidas - Debería fallar (400) si falta el nombre de la comida", async () => {
    const token = await getAuthToken();

    const comidaInvalida = {
      fecha: new Date().toISOString(),
      // Falta 'nombre_comida' intencionalmente
    };

    const res = await request(app)
      .post("/api/v1/comidas")
      .set("Authorization", `Bearer ${token}`)
      .send(comidaInvalida);

    expect(res.status).toBe(400);
    // Verificamos el path del error de Zod
    const errorPaths = res.body.errors.map((e: { path: string }) => e.path);
    expect(errorPaths).toContain("body.nombre_comida");
  });

  // 4. Prueba de LECTURA (GET)
  it("GET /api/v1/comidas - Debería listar las comidas del usuario", async () => {
    const token = await getAuthToken();

    // Creamos una comida primero para asegurar que haya datos
    await request(app)
      .post("/api/v1/comidas")
      .set("Authorization", `Bearer ${token}`)
      .send(comidaData);

    // Consultamos la lista
    const res = await request(app)
      .get("/api/v1/comidas")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    // Buscamos la comida creada
    const comidaEncontrada = res.body.find(
      (c: { nombre_comida: string }) =>
        c.nombre_comida === comidaData.nombre_comida,
    );
    expect(comidaEncontrada).toBeDefined();
  });

  // 5. Prueba de BORRADO (DELETE)
  it("DELETE /api/v1/comidas/:id - Debería eliminar una comida", async () => {
    const token = await getAuthToken();

    // 1. Crear
    const createRes = await request(app)
      .post("/api/v1/comidas")
      .set("Authorization", `Bearer ${token}`)
      .send(comidaData);

    const idComida = createRes.body.id_comida;

    // 2. Borrar
    const deleteRes = await request(app)
      .delete(`/api/v1/comidas/${idComida}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.status).toBe(204); // No Content

    // 3. Verificar que ya no existe (404)
    const deleteAgain = await request(app)
      .delete(`/api/v1/comidas/${idComida}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteAgain.status).toBe(404);
  });
});
