/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Page from "./page";
jest.mock("../auth");

describe("image containers appear in the document", () => {
  test("Title container", async () => {
    render(await Page());
    expect(screen.getByRole("img", { name: "Titel" })).toBeInTheDocument();
  });

  test("Aktuelle Routen - container", async () => {
    render(await Page());
    expect(
      screen.getByRole("img", { name: "routesOverview" })
    ).toBeInTheDocument();
  });

  test("Eigenen Roadtrip machen - container", async () => {
    render(await Page());
    expect(
      screen.getByRole("img", { name: "insertRoadtrip" })
    ).toBeInTheDocument();
  });
});

describe("Links are in the document", () => {
  test("'routesOverview - Link", async () => {
    render(await Page());
    expect(
      screen.getByRole("link", { name: "routesOverview" })
    ).toBeInTheDocument();
  });
  test("'insert Roadtrip - Link", async () => {
    render(await Page());
    expect(
      screen.getByRole("link", { name: "insertRoadtrip" })
    ).toBeInTheDocument();
  });
});

describe("Links", () => {
  test("Link to 'routesOverview' from homepage", async () => {
    render(await Page());
    fireEvent.click(screen.getByRole("link", { name: "routesOverview" }));
    waitFor(() =>
      expect(screen.getByTestId("routesOverview")).toBeInTheDocument()
    );
  });

  test("Link to 'insertRoadtrip' from homepage", async () => {
    render(await Page());
    fireEvent.click(screen.getByRole("link", { name: "insertRoadtrip" }));
    waitFor(() =>
      expect(screen.getByTestId("insertRoadtrip")).toBeInTheDocument()
    );
  });
});
