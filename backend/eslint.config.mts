import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

// 'defineConfig' es opcional pero te da autocompletado en tu editor
export default defineConfig([
  // --- 1. Configuración Global ---
  // Se aplica a todos los archivos
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,     // Variables de entorno de Node.js
      }
    }
  },

  // Reglas base de ESLint
  js.configs.recommended,

  // Reglas base de TypeScript
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    rules: {
      /**
       Forzar comillas dobles (")
       "error" -> Falla si no se cumple
       "double" -> Usa comillas dobles
       */
      // "quotes": ["error", "simple"],

      /**
       Forzar punto y coma (;) al final
       "always" -> Siempre debe haber uno
       */
      "semi": ["error", "always"],
      /**
      Forzar el uso de '===' y '!==' en lugar de '==' y '!='
       Esto previene errores sutiles de tipo (ej. 0 == false)
       */
      "eqeqeq": ["error", "always"],

      /**
       Requerir comas al final en objetos y arrays de varias líneas
       (Ej. [1, 2, 3,])
       */
      "comma-dangle": ["error", "always-multiline"],
      /**
       Advierte (warn) si encuentra 'console.log'
       Esto ayuda a no dejar logs de debug en el código final.
       */
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      /**
       Advierte sobre variables no usadas
       (Usamos la versión de TypeScript para que entienda 'enums', 'interfaces', etc.)
       */
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_", // Permite argumentos que empiecen con _
        "varsIgnorePattern": "^_"  // Permite variables que empiecen con _
      }]
    }
  }
]);