import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
const tailwindcss = require("tailwindcss");

export default [
  {
    input: ['./src/index.ts'],
    external: ['react', 'react-dom', 'wagmi'],
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      peerDepsExternal(),
      typescript({
        useTsconfigDeclarationDir: true,
        exclude: 'node_modules/**',
      }),
      postcss({
        plugins: [
          tailwindcss("./tailwind.config.js"),
          require("autoprefixer"),
          require("cssnano")({ preset: "default" }),
        ],
      }),
    ],
  },
];
