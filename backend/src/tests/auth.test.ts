import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../app";

describe("Módulo de Autenticación (API)", () => {
  const userData = {
    nombre_usuario: "Auth Test User",
    email: `auth-test-${Date.now()}@example.com`, // Email único
    password: "password123",
    fecha_nacimiento: "1990-01-01T00:00:00.000Z",
  };

  // 1. Prueba de REGISTRO
  it("POST /api/v1/auth/register - Debería registrar un nuevo usuario", async () => {
    const res = await request(app).post("/api/v1/auth/register").send(userData);

    expect(res.status).toBe(201);
    expect(res.body.message).toContain("exitosamente");
    expect(res.body.usuario).toHaveProperty("id_usuario");
    expect(res.body.usuario.email).toBe(userData.email);
    expect(res.body.usuario).not.toHaveProperty("password");
  });

  // 2. Prueba de REGISTRO DUPLICADO
  it("POST /api/v1/auth/register - No debería permitir email duplicado", async () => {
    // Paso 1: Registrar al usuario por PRIMERA vez
    await request(app).post("/api/v1/auth/register").send(userData);

    // Paso 2: Intentar registrarlo por SEGUNDA vez
    const res = await request(app).post("/api/v1/auth/register").send(userData);

    expect(res.status).toBe(409); // Conflict
    expect(res.body.message).toContain("ya está registrado");
  });
  //

  // 3. Prueba de LOGIN
  it("POST /api/v1/auth/login - Debería iniciar sesión y devolver token", async () => {
    // Registramos un usuario fresco para este test
    const loginUser = {
      nombre_usuario: "Login User",
      email: `login-${Date.now()}@example.com`,
      password: "password123",
      fecha_nacimiento: "1990-01-01T00:00:00.000Z",
    };
    await request(app).post("/api/v1/auth/register").send(loginUser);

    const res = await request(app).post("/api/v1/auth/login").send({
      email: loginUser.email,
      password: loginUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
    expect(res.body.usuario.email).toBe(loginUser.email);
  });

  // 4. Prueba de LOGIN FALLIDO (Contraseña incorrecta)
  it("POST /api/v1/auth/login - Debería fallar con contraseña incorrecta", async () => {
    const failUser = {
      nombre_usuario: "Fail User",
      email: `fail-${Date.now()}@example.com`,
      password: "password123",
      fecha_nacimiento: "1990-01-01T00:00:00.000Z",
    };
    await request(app).post("/api/v1/auth/register").send(failUser);

    // Intentamos login con password mal
    const res = await request(app).post("/api/v1/auth/login").send({
      email: failUser.email,
      password: "password_incorrecta",
    });

    expect(res.status).toBe(401); // Unauthorized
    expect(res.body.message).toContain("incorrectos");
  });
});
