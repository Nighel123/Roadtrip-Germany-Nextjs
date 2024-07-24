/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Page from "./page";

describe("image containers appear in the document", () => {
  test("Title container", () => {
    render(<Page />);
    expect(screen.getByRole("img", { name: "title" })).toBeInTheDocument();
  });

  test("Aktuelle Routen - container", () => {
    render(<Page />);
    expect(
      screen.getByRole("img", { name: "routesOverview" })
    ).toBeInTheDocument();
  });

  test("Eigenen Roadtrip machen - container", () => {
    render(<Page />);
    expect(
      screen.getByRole("img", { name: "insertRoadtrip" })
    ).toBeInTheDocument();
  });
});

describe("Links are in the document", () => {
  test("'routesOverview - Link", () => {
    render(<Page />);
    expect(
      screen.getByRole("link", { name: "routesOverview" })
    ).toBeInTheDocument();
  });
  test("'insert Roadtrip - Link", () => {
    render(<Page />);
    expect(
      screen.getByRole("link", { name: "insertRoadtrip" })
    ).toBeInTheDocument();
  });
});

describe("Links", () => {
  test("Link to 'routesOverview' from homepage", async () => {
    render(<Page />);
    fireEvent.click(screen.getByRole("link", { name: "routesOverview" }));
    waitFor(() =>
      expect(screen.getByTestId("routesOverview")).toBeInTheDocument()
    );
  });

  test("Link to 'insertRoadtrip' from homepage", async () => {
    render(<Page />);
    fireEvent.click(screen.getByRole("link", { name: "insertRoadtrip" }));
    waitFor(() =>
      expect(screen.getByTestId("insertRoadtrip")).toBeInTheDocument()
    );
  });
});
