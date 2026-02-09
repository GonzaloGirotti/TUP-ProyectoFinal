import { authService } from "./authService";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

export const reporteService = {
    descargarArchivo: async (endpoint: string, nombreArchivo: string) => {
        const token = authService.getToken();

        console.log("Intentando descargar de:", `${API_URL}/reportes${endpoint}`);

        const response = await fetch(`${API_URL}/reportes${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Error en la descarga:", errorData);
            throw new Error('Error al generar el reporte');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', nombreArchivo);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url); // Limpieza de memoria
    }
};