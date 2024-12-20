// frontend/selecthu/app/components/layout/ColorModeToggle.tsx

"use client";

import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      aria-label={`切换到 ${colorMode === "light" ? "暗色" : "亮色"} 模式`}
    />
  );
};

export default ColorModeToggle;