/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Page from "./page";
jest.mock("app/lib/actions");
jest.mock("app/insertRoadtrip/useTouched.tsx");

describe("register Form", () => {
  test("First input", async () => {
    render(await Page());
    screen.getByRole("");
    //expect(screen.getByRole("img", { name: "Titel" })).toBeInTheDocument();
  });
});
