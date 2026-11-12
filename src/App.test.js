import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./components/Particle", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("./components/NEPSETicker", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("./components/ScrollToTop", () => ({
  __esModule: true,
  default: () => null,
}));

test("renders the home page and navigation", () => {
  render(<App />);

  expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /hi there/i })).toBeInTheDocument();
});
