import styled, { useTheme } from "styled-components"; // Import useTheme
import LightSwitchIcon from "../../svgs/LightSwitchIcon";
import pxToRem from "../../../utils/pxToRem";
import { useState } from "react";

const DarkModeToggleWrapper = styled.button`
  background: var(--colour-background);
  height: ${pxToRem(24)};
  width: ${pxToRem(24)};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${pxToRem(6)};
  cursor: pointer;

  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    opacity: 0.7;
  }
`;

const DarkModeToggle = () => {
  const theme = useTheme(); // <-- Access the theme object here
  const [isDarkMode, setIsDarkMode] = useState(false); // Consider initializing based on default theme or user preference

  const handleLightSwitch = () => {
    // Use a functional update for setting state based on previous state
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      // Use the newMode directly for setting properties
      document.documentElement.style.setProperty(
        "--colour-background",
        newMode ? theme.colours.black : theme.colours.white
      );
      document.documentElement.style.setProperty(
        "--colour-background-alpha-80",
        newMode ? theme.colours.blackAlpha80 : theme.colours.whiteAlpha80
      );
      document.documentElement.style.setProperty(
        "--colour-background-alpha-50",
        newMode ? theme.colours.blackAlpha50 : theme.colours.whiteAlpha50
      );
      document.documentElement.style.setProperty(
        "--colour-background-alpha-20",
        newMode ? theme.colours.blackAlpha20 : theme.colours.whiteAlpha20
      );
      document.documentElement.style.setProperty(
        "--colour-foreground",
        newMode ? theme.colours.white : theme.colours.black
      );
      document.documentElement.style.setProperty(
        "--colour-foreground-alpha-80",
        newMode ? theme.colours.whiteAlpha80 : theme.colours.blackAlpha80
      );
      document.documentElement.style.setProperty(
        "--colour-foreground-alpha-50",
        newMode ? theme.colours.whiteAlpha50 : theme.colours.blackAlpha50
      );
      document.documentElement.style.setProperty(
        "--colour-foreground-alpha-20",
        newMode ? theme.colours.whiteAlpha20 : theme.colours.blackAlpha20
      );
      // You might also want to set a class on the <html> or <body> element
      // document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  return (
    <DarkModeToggleWrapper onClick={() => handleLightSwitch()}>
      <LightSwitchIcon />
    </DarkModeToggleWrapper>
  );
};

export default DarkModeToggle;
