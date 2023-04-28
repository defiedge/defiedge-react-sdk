import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import json from '@rollup/plugin-json'
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
const tailwindcss = require("tailwindcss");

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  external: ['react', 'react-dom', 'wagmi'],
  plugins: [
    peerDepsExternal(),
    postcss({
      plugins: [
        tailwindcss("./tailwind.config.js"),
        require("autoprefixer"),
        require("cssnano")({ preset: "default" }),
      ],
    }),
    typescript({
      useTsconfigDeclarationDir: true,
      rollupCommonJSResolveHack: true,
      exclude: ["**/__tests__/**", "**/*.stories.tsx"],
      clean: true,
    }),
    commonjs({
      include: ["node_modules/**"],
    }),
    terser(),
    json()
  ],
};
