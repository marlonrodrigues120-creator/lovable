import { act, render, screen, cleanup, waitFor } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { ThemeProvider, useTheme } from "@/components/dashboard/ThemeProvider";

function Consumer() {
  const { dark, toggleTheme } = useTheme();
  return <button aria-label="theme" aria-pressed={dark} onClick={toggleTheme} />;
}
afterEach(() => { cleanup(); localStorage.clear(); document.documentElement.classList.remove("dark"); });

it("keeps the theme when a page consumer remounts and after root remount", async () => {
  const view = render(<ThemeProvider><Consumer key="clients" /></ThemeProvider>);
  act(() => screen.getByRole("button").click());
  await waitFor(() => expect(document.documentElement.classList.contains("dark")).toBe(true));
  view.rerender(<ThemeProvider><Consumer key="leads" /></ThemeProvider>);
  expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
  expect(localStorage.getItem("salesflow-theme")).toBe("dark");
  view.unmount();
  render(<ThemeProvider><Consumer /></ThemeProvider>);
  await waitFor(() => expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true"));
  act(() => screen.getByRole("button").click());
  await waitFor(() => expect(document.documentElement.classList.contains("dark")).toBe(false));
  expect(localStorage.getItem("salesflow-theme")).toBe("light");
});