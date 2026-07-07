import { useTheme } from "../../contexts/ThemeContext";

export default function Grid() {
  const { theme } = useTheme();
  return (
    <svg
      aria-hidden="true"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="p1" x="2" y="2" width="9" height="9" patternUnits="userSpaceOnUse">
          <rect x="2" y="2" width="4" height="4" fill={theme === "dark" ? "#7E2A2A" : "#000000"} />
        </pattern>
      </defs>
      <rect width="30" height="30" x="0" y="0" fill="url(#p1)" />
    </svg>
  );
}
