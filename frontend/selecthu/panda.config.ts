// import { defineConfig } from "@pandacss/dev";

// export default defineConfig({
//   // Whether to use css reset
//   preflight: true,

//   // Where to look for your css declarations
//   include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

//   // Files to exclude
//   exclude: [],

//   // Useful for theme customization
//   theme: {
//     extend: {},
//   },

//   // The output directory for your css system
//   outdir: "styled-system",
// });
import { defineConfig } from "@pandacss/dev"

export default defineConfig({
  // 是否生成样式
  preflight: true,
  
  // 需要处理的文件
  include: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  
  // 排除的文件
  exclude: [],
  
  // 输出目录
  outdir: "styled-system",
  
  // 预设
  presets: ["@pandacss/preset-base"],

  // 指定使用的框架
  jsxFramework: "react"
})