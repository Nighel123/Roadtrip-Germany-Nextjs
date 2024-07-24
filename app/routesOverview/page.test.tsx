import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Page from "./page";

describe("routesOverview", () => {
  test("Title", () => {
    render(<Page />);
    expect(screen.getByRole("img", { name: "title" })).toBeInTheDocument();
  });
  test("blue Frame", () => {
    render(<Page />);
    expect(screen.getByRole("img", { name: "blueFrame" })).toBeInTheDocument();
  });
});

describe("Links", () => {
  test("Link to 'home' from 'routesOverview'", async () => {
    render(<Page />);
    fireEvent.click(screen.getByRole("link", { name: "title" }));
    waitFor(() => expect(screen.getByTestId("home")).toBeInTheDocument());
  });
});
