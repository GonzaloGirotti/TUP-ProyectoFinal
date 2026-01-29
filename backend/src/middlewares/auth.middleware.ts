import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Definimos una interfaz personalizada para el payload del JWT 
interface CustomJwtPayload extends JwtPayload {
    id: number;
    email: string;
    nombre: string;
}
// -----------------------

/*
 Middleware para verificar la autenticación del usuario usando JWT.
 Espera un token en el header 'Authorization: Bearer <token>'
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Obtener el header de autorización
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Acceso denegado. No se proveyó un token.' });
        }

        // 2. Verificar que el formato sea 'Bearer <token>'
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Acceso denegado. Token mal formado.' });
        }

        // 3. Obtener el secreto del JWT de las variables de entorno
        const jwtSecret = process.env.JWT_SECRET;
        if (typeof jwtSecret !== 'string') {
            throw new Error('JWT_SECRET no está definido en las variables de entorno');
        }

        // 4. Verificar el token
        const payload = jwt.verify(token, jwtSecret) as CustomJwtPayload;

        // 5. ¡Éxito! Adjuntar el payload del usuario a la request
        // Acá se usa el tipo extendido de Request
        req.usuario = payload;

        // 6. Pasar al siguiente middleware o controlador
        next();

    } catch (error: unknown) {
        // Si el error es por un token inválido (lanzado por jwt.verify)
        if (error instanceof Error && (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError')) {
            return res.status(401).json({ message: 'Token inválido o expirado.', error: error.message });
        }
        // Otros errores
        // eslint-disable-next-line no-console
        console.error('[AUTH_MIDDLEWARE]:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};