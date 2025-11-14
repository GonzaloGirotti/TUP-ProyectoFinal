// Le decimos a TypeScript que estamos modificando un módulo global
declare global {
    // Modificamos el namespace 'Express'
    namespace Express {
        // Modificamos la interfaz 'Request'
        export interface Request {
            // Le añadimos nuestra propiedad 'usuario'
            // Este es el "shape" (forma) del payload que decodificamos del JWT
            usuario?: {
                id: number;
                email: string;
                nombre: string;
                // El payload de JWT también incluye 'iat' (issued at) y 'exp' (expiration)
                iat?: number;
                exp?: number;
            };
        }
    }
}

export { };