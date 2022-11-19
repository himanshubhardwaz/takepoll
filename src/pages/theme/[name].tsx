import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

const ThemeSetter = ({
  isCorrectThemeName,
  themeName,
}: {
  isCorrectThemeName: boolean;
  themeName: string;
}) => {
  const router = useRouter();

  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isCorrectThemeName) {
      divRef?.current?.click();
      localStorage.setItem("theme", themeName);
    }
    router.push("/");
  }, [isCorrectThemeName, router, themeName]);

  return (
    <div data-set-theme={`${themeName}`} ref={divRef}>
      Setting Theme...
    </div>
  );
};

export default function ThemeSetterPage() {
  const router = useRouter();

  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ];

  const themeName = router.query.name as string;

  const isCorrectThemeName = themes.includes(themeName);

  return (
    <ThemeSetter
      themeName={themeName}
      isCorrectThemeName={isCorrectThemeName}
    />
  );
}
