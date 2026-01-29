import request from "supertest";
import { describe, it, expect, beforeEach } from "vitest";
import app from "../app";
import { getAuthToken } from "./helpers";

describe("Módulo de Comidas_Alimentos (Relación)", () => {
  let token: string;
  let idAlimento: number;
  let idComida: number;

  // PREPARACIÓN: Creamos los datos necesarios antes de probar la relación
  // Usamos 'beforeEach' porque 'setup.ts' borra la DB antes de cada test
  beforeEach(async () => {
    token = await getAuthToken();

    // 1. Crear un Alimento (El "Ingrediente")
    const resAlimento = await request(app)
      .post("/api/v1/alimentos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nombre: "Avena Test",
        carbohidratos: 60,
        proteinas: 12,
        grasas: 7,
        calorias: 350,
      });
    idAlimento = resAlimento.body.id_alimento;

    // 2. Crear una Comida (El "Plato")
    const resComida = await request(app)
      .post("/api/v1/comidas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nombre_comida: "Desayuno Test",
        fecha: new Date().toISOString(),
      });
    idComida = resComida.body.id_comida;
  });

  // 1. Prueba de CREACIÓN (Agregar alimento a comida)
  it("POST /api/v1/comidas_alimentos - Debería agregar un alimento y CALCULAR los macros", async () => {
    const cantidad = 50;

    const relacionData = {
      id_comida: idComida,
      id_alimento: idAlimento,
      cantidad_gramos: cantidad,
    };

    const res = await request(app)
      .post("/api/v1/comidas_alimentos")
      .set("Authorization", `Bearer ${token}`)
      .send(relacionData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id_comida_alimento");
    expect(res.body.cantidad_gramos).toBe(cantidad);

    // Verificación de cálculos (el backend debería hacer esto)
    const factor = cantidad / 100;
    expect(parseFloat(res.body.calorias_total)).toBeCloseTo(350 * factor);
    expect(parseFloat(res.body.proteinas_total)).toBeCloseTo(12 * factor);
    expect(parseFloat(res.body.carbohidratos_total)).toBeCloseTo(60 * factor);
  });

  // 2. Prueba de VALIDACIÓN
  it("POST /api/v1/comidas_alimentos - Debería fallar (404) si el alimento no existe", async () => {
    const dataInvalida = {
      id_comida: idComida,
      id_alimento: 999999, // ID inexistente
      cantidad_gramos: 100,
    };

    const res = await request(app)
      .post("/api/v1/comidas_alimentos")
      .set("Authorization", `Bearer ${token}`)
      .send(dataInvalida);

    expect(res.status).toBe(404);
  });

  // 3. Prueba de LECTURA
  it("GET /api/v1/comidas_alimentos - Debería listar los registros creados", async () => {
    // Primero creamos uno para que haya algo que listar
    await request(app)
      .post("/api/v1/comidas_alimentos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id_comida: idComida,
        id_alimento: idAlimento,
        cantidad_gramos: 50,
      });

    const res = await request(app)
      .get("/api/v1/comidas_alimentos")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    // Buscamos la relación que acabamos de crear
    const registro = res.body.find(
      (r: { id_comida: number; id_alimento: number }) =>
        r.id_comida === idComida && r.id_alimento === idAlimento,
    );
    expect(registro).toBeDefined();
  });

  // 4. Prueba de BORRADO
  it("DELETE /api/v1/comidas_alimentos/:id - Debería eliminar el registro", async () => {
    // Crear uno para borrar
    const createRes = await request(app)
      .post("/api/v1/comidas_alimentos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id_comida: idComida,
        id_alimento: idAlimento,
        cantidad_gramos: 25,
      });

    const idRelacion = createRes.body.id_comida_alimento;

    // Borrar
    const deleteRes = await request(app)
      .delete(`/api/v1/comidas_alimentos/${idRelacion}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.status).toBe(204);

    // Verificar
    const deleteAgain = await request(app)
      .delete(`/api/v1/comidas_alimentos/${idRelacion}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteAgain.status).toBe(404);
  });
});
