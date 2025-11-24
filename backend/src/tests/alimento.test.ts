import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../app";
import { getAuthToken } from "./helpers";

describe("Módulo de Alimentos (API)", () => {
  const alimentoData = {
    nombre: "Manzana Test",
    carbohidratos: 14,
    proteinas: 0.3,
    grasas: 0.2,
    calorias: 52,
  };

  // 1. Prueba de CREACIÓN
  it("POST /api/v1/alimentos - Debería crear un alimento si estoy autenticado", async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .post("/api/v1/alimentos")
      .set("Authorization", `Bearer ${token}`)
      .send(alimentoData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id_alimento");
    expect(res.body.nombre).toBe(alimentoData.nombre);
    expect(res.body.calorias).toBe(alimentoData.calorias);
    expect(res.body.proteinas).toBe(alimentoData.proteinas);
  });

  // 2. Prueba de SEGURIDAD
  it("POST /api/v1/alimentos - Debería fallar (401) si NO envío token", async () => {
    const res = await request(app).post("/api/v1/alimentos").send(alimentoData);

    expect(res.status).toBe(401);
    expect(res.body.message).toContain("Acceso denegado");
  });

  // 3. Prueba de VALIDACIÓN (Datos Incorrectos)
  it("POST /api/v1/alimentos - Debería fallar (400) si faltan datos requeridos", async () => {
    const token = await getAuthToken();

    const alimentoInvalido = {
      nombre: "Alimento Incompleto",
      // Faltan calorias y macros intencionalmente
    };

    const res = await request(app)
      .post("/api/v1/alimentos")
      .set("Authorization", `Bearer ${token}`)
      .send(alimentoInvalido);

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");

    const errorPaths = res.body.errors.map((e: { path: string }) => e.path);

    // Verificamos que falten los campos numéricos requeridos
    expect(errorPaths).toContain("body.calorias");
    expect(errorPaths).toContain("body.proteinas");
  });

  it("POST /api/v1/alimentos - Debería fallar (400) si los valores son negativos", async () => {
    const token = await getAuthToken();

    const alimentoNegativo = {
      ...alimentoData,
      calorias: -100, // Inválido
    };

    const res = await request(app)
      .post("/api/v1/alimentos")
      .set("Authorization", `Bearer ${token}`)
      .send(alimentoNegativo);

    expect(res.status).toBe(400);

    // Verificamos el path
    const errorPaths = res.body.errors.map((e: { path: string }) => e.path);
    expect(errorPaths).toContain("body.calorias");
  });

  // 4. Prueba de LECTURA
  it("GET /api/v1/alimentos - Debería listar todos los alimentos", async () => {
    const token = await getAuthToken();

    await request(app)
      .post("/api/v1/alimentos")
      .set("Authorization", `Bearer ${token}`)
      .send(alimentoData);

    const res = await request(app)
      .get("/api/v1/alimentos")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const alimentoEncontrado = res.body.find(
      (a: any) => a.nombre === alimentoData.nombre,
    );

    expect(alimentoEncontrado).toBeDefined();
    expect(alimentoEncontrado.calorias).toBe(alimentoData.calorias);
  });

  // 5. Prueba de BORRADO
  it("DELETE /api/v1/alimentos/:id - Debería eliminar un alimento", async () => {
    const token = await getAuthToken();

    const createRes = await request(app)
      .post("/api/v1/alimentos")
      .set("Authorization", `Bearer ${token}`)
      .send(alimentoData);

    const idAlimento = createRes.body.id_alimento;

    const deleteRes = await request(app)
      .delete(`/api/v1/alimentos/${idAlimento}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.status).toBe(204);

    const deleteAgainRes = await request(app)
      .delete(`/api/v1/alimentos/${idAlimento}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteAgainRes.status).toBe(404);
  });
});
