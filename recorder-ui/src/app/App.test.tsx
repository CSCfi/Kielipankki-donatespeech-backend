import React from "react";
import { render } from "../utils/testUtils";
import App from "./App";

const init = () => {
  return render(<App />);
};

it("renders navbar brand text", () => {
  const screen = init();
  expect(screen.getByText("Hankkeen nimi")).toBeInTheDocument();
});
