(() => {
  try {
    const savedTheme = localStorage.getItem("kos-pak-gunawan.theme");
    const theme = savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#121815" : "#f6f8f7");
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
