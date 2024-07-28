/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Page from "./page";
jest.mock("../lib/actions");

describe("image containers appear in the document", () => {
  test("Title container", async () => {
    render(await Page());
    screen.debug();
    //expect(screen.getByRole("img", { name: "Titel" })).toBeInTheDocument();
  });
});
