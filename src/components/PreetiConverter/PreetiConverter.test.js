import React from "react";
import { render, screen } from "@testing-library/react";
import PreetiConverter from "./PreetiConverter";

test("embeds the external Unicode and Preeti converter", () => {
  render(<PreetiConverter />);

  expect(
    screen.getByTitle("Nepali Unicode and Preeti converter")
  ).toHaveAttribute("src", "https://uni-to-preeti.vercel.app/");
});
