import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // Habilita variables globales como describe, it, expect
        globals: true,
        // Entorno de node (porque es backend)
        environment: "node",
        // Archivo de configuración que se ejecuta ANTES de los tests
        setupFiles: ["./src/tests/setup.ts"],
        // Desactiva el paralelismo.
        // Como usamos una base de datos real, no queremos que dos tests escriban/borren en la misma tabla al mismo tiempo.
        fileParallelism: false,
        // Tiempo máximo para un test (por si la BD está lenta)
        testTimeout: 10000,
    },
});