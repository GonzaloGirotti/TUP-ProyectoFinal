import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../app";
import { getAuthToken } from "./helpers";

describe("Módulo de Pesos (API)", () => {
  // Datos de prueba
  const pesoData = {
    peso_kg: 75.5,
    comentario: "Peso inicial de prueba",
  };

  // 1. Prueba de CREACIÓN
  it("POST /api/v1/pesos - Debería crear un peso si estoy autenticado", async () => {
    const token = await getAuthToken(); // Obtenemos token válido

    const res = await request(app)
      .post("/api/v1/pesos")
      .set("Authorization", `Bearer ${token}`) // Enviamos el token
      .send(pesoData);

    // Verificaciones
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id_peso");
    expect(res.body.peso_kg).toBe(pesoData.peso_kg);
    expect(res.body.comentario).toBe(pesoData.comentario);
    // Verificamos que se haya vinculado al usuario (id_usuario debe existir)
    expect(res.body).toHaveProperty("id_usuario");
  });

  // 2. Prueba de SEGURIDAD (Sin Token)
  it("POST /api/v1/pesos - Debería fallar (401) si NO envío token", async () => {
    const res = await request(app).post("/api/v1/pesos").send(pesoData);

    expect(res.status).toBe(401);
    expect(res.body.message).toContain("Acceso denegado");
  });

  // 3. Prueba de VALIDACIÓN (Datos Incorrectos)
  it("POST /api/v1/pesos - Debería fallar (400) si el peso es negativo o inválido", async () => {
    const token = await getAuthToken();

    const pesoInvalido = {
      peso_kg: -5, // Zod debería rechazar esto (.positive())
      comentario: "Esto no debería guardarse",
    };

    const res = await request(app)
      .post("/api/v1/pesos")
      .set("Authorization", `Bearer ${token}`)
      .send(pesoInvalido);

    expect(res.status).toBe(400);
    // Zod devuelve un array de errores, verificamos que mencione el problema
    expect(JSON.stringify(res.body)).toMatch(/positivo/i);
  });

  // 4. Prueba de LECTURA (GET)
  it("GET /api/v1/pesos - Debería listar los pesos del usuario", async () => {
    const token = await getAuthToken();

    // Primero creamos uno para asegurar que haya datos
    await request(app)
      .post("/api/v1/pesos")
      .set("Authorization", `Bearer ${token}`)
      .send(pesoData);

    // Ahora consultamos la lista
    const res = await request(app)
      .get("/api/v1/pesos")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].peso_kg).toBe(pesoData.peso_kg);
  });

  // 5. Prueba de BORRADO (DELETE)
  it("DELETE /api/v1/pesos/:id - Debería eliminar un peso propio", async () => {
    const token = await getAuthToken();

    // 1. Crear el peso primero
    const createRes = await request(app)
      .post("/api/v1/pesos")
      .set("Authorization", `Bearer ${token}`)
      .send(pesoData);

    const idPeso = createRes.body.id_peso;

    // 2. Borrarlo
    const deleteRes = await request(app)
      .delete(`/api/v1/pesos/${idPeso}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.status).toBe(204); // No Content (éxito)

    // 3. Verificar que ya no existe
    // Si intentamos borrarlo de nuevo, debería dar 404
    const deleteAgainRes = await request(app)
      .delete(`/api/v1/pesos/${idPeso}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteAgainRes.status).toBe(404);
  });
});
