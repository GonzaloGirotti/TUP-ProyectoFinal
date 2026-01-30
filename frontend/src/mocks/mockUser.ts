import type { LoginResponse, Usuario } from "../services/authService";

export function crearUsuarioMock(data?: Partial<Usuario>): Usuario {
  return {
    id: 1,
    nombre_usuario: data?.nombre_usuario ?? 'Usuario Mock',
    email: data?.email ?? 'mock@nutriapp.com',
    fecha_nacimiento: data?.fecha_nacimiento ?? '1990-01-01T00:00:00.000Z',
  };
}

export function crearLoginResponseMock(data?: { email?: string; nombre_usuario?: string }): LoginResponse {
  const usuario = crearUsuarioMock({
    email: data?.email,
    nombre_usuario: data?.nombre_usuario,
  });

  return {
    message: 'Inicio de sesión exitoso (MOCK)',
    token: 'mock-token-123',
    usuario,
  };
}
