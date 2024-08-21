import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Page from "./page";
jest.mock("../lib/data");
describe("routesOverview", () => {
  test("Title", async () => {
    //render(await Page());
    //screen.getByRole("");
    screen.debug();
    //expect(screen.getByRole("img", { name: "title" })).toBeInTheDocument();
  });
  test("blue Frame", async () => {
    //render(await Page());
    expect(screen.getByRole("img", { name: "blueFrame" })).toBeInTheDocument();
  });
});

describe("Links", () => {
  test("Link to 'home' from 'routesOverview'", async () => {
    //render(await Page());
    fireEvent.click(screen.getByRole("link", { name: "title" }));
    waitFor(() => expect(screen.getByTestId("home")).toBeInTheDocument());
  });
});
