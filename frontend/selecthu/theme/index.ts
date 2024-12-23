// theme/index.ts

import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// 定义自定义颜色
const colors = {
  brand: {
    50: "#e3f2fd",
    100: "#bbdefb",
    200: "#90caf9",
    300: "#64b5f6",
    400: "#42a5f5",
    500: "#2196f3", // 主色：浅蓝色
    600: "#1e88e5",
    700: "#1976d2",
    800: "#1565c0",
    900: "#0d47a1",
  },
  purpleAccent: {
    50: "#f3e5f5",
    100: "#e1bee7",
    200: "#ce93d8",
    300: "#ba68c8",
    400: "#ab47bc",
    500: "#9c27b0", // 辅助色：紫色
    600: "#8e24aa",
    700: "#7b1fa2",
    800: "#6a1b9a",
    900: "#4a148c",
  },
};

// 定义颜色模式配置
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

// 扩展主题
const theme = extendTheme({
  config,
  colors,
  components: {
    Button: {
      // 为 Button 组件自定义主题
      variants: {
        solid: (props: any) => ({
          bg: props.colorMode === "dark" ? "brand.300" : "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
          },
        }),
      },
    },
    Link: {
      baseStyle: {
        color: "purpleAccent.500",
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.900" : "gray.100",
        color: props.colorMode === "dark" ? "gray.100" : "gray.800",
      },
    }),
  },
});

export default theme;