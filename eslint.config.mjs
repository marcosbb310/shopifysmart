import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      import: importPlugin,
    },
    rules: {
      // TypeScript strict compliance
      "@typescript-eslint/no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true 
      }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      
      // Step 1: Basic import restrictions for hybrid structure
      "import/no-restricted-paths": [
        "warn",
        {
          "zones": [
            {
              "target": "./src/features/products/components/*",
              "from": "./src/components/ui",
              "message": "Feature components should use @/shared/components instead of direct UI imports. Move reusable components to shared/components."
            },
            {
              "target": "./src/features/dashboard/components/*",
              "from": "./src/components/ui",
              "message": "Feature components should use @/shared/components instead of direct UI imports. Move reusable components to shared/components."
            },
            {
              "target": "./src/features/performance/components/*",
              "from": "./src/components/ui",
              "message": "Feature components should use @/shared/components instead of direct UI imports. Move reusable components to shared/components."
            },
            {
              "target": "./src/features/history/components/*",
              "from": "./src/components/ui",
              "message": "Feature components should use @/shared/components instead of direct UI imports. Move reusable components to shared/components."
            },
            {
              "target": "./src/features/products/components/*",
              "from": "./src/features/dashboard/components/*",
              "message": "Feature components should not import from other features directly. Use shared components or feature index files."
            },
            {
              "target": "./src/features/products/components/*",
              "from": "./src/features/navigation/components/*",
              "message": "Feature components should not import from other features directly. Use shared components or feature index files."
            },
            {
              "target": "./src/features/products/components/*",
              "from": "./src/features/performance/components/*",
              "message": "Feature components should not import from other features directly. Use shared components or feature index files."
            },
            {
              "target": "./src/features/products/components/*",
              "from": "./src/features/history/components/*",
              "message": "Feature components should not import from other features directly. Use shared components or feature index files."
            }
          ]
        }
      ],
      
      // Step 2: Encourage feature index imports (only for our custom modules)
      // Temporarily disabled due to too many false positives
      // "import/no-internal-modules": [
      //   "warn",
      //   {
      //     "allow": [
      //       "@/shared/**",
      //       "@/features/*/index",
      //       "@/features/*/components/**",
      //       "@/features/*/app/**",
      //       "@/features/*/types/**",
      //       "@/features/*/logic/**",
      //       "@/components/ui/**",
      //       "@/lib/**",
      //       "@/hooks/**",
      //       "@/app/actions/**",
      //       "next/**",
      //       "react/**",
      //       "@radix-ui/**",
      //       "@hookform/**",
      //       "lucide-react"
      //     ]
      //   }
      // ],
      
    },
  },
  {
    files: ["*.js", "*.mjs"],
    rules: {
      // Allow require() in JavaScript config files
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default eslintConfig;
