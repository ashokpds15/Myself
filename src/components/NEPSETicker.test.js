import React from "react";
import { render, screen } from "@testing-library/react";
import NEPSETicker from "./NEPSETicker";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

test("shows unavailable instead of fabricated quotes when the API fails", async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503 });
  jest.spyOn(console, "error").mockImplementation(() => {});

  render(<NEPSETicker />);

  expect(
    await screen.findByText("Market quotes unavailable")
  ).toBeInTheDocument();
  expect(screen.queryByText("NABIL")).not.toBeInTheDocument();
});
