import { test, expect } from "@playwright/test";
import path from "path";

const { db, sql } = require("@vercel/postgres");

const registerTestData = {
  username: "testUser",
  email: "test@email.com",
  password: "testPass123",
  day: "31",
  month: "Februar",
  year: "1991",
  sex: "männlich",
};

const roadtripTestData = {
  startland: "Ukraine",
  starttown: "Kiew",
  destland: "Finnland",
  desttown: "Kopenhagen",
  day: "1",
  month: "September",
  year: "2024",
  description:
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
};

const { username, email, password, sex } = registerTestData;
const { startland, starttown, destland, desttown, description } =
  roadtripTestData;
let user_id: string;
test.describe("rootFunctions", () => {
  test("register", async ({ page }) => {
    await sql`
      DELETE FROM users WHERE name = ${username}
    `;
    await page.goto("/register");
    await page.getByLabel("Nutzername").fill(username);
    await page.getByLabel("E-Mail-Adresse").fill(email);
    await page.getByLabel("Passwort").fill(password);
    await page.getByPlaceholder("Tag").fill(registerTestData.day);
    await page.locator("#month").selectOption(registerTestData.month);
    await page.getByPlaceholder("Jahr").fill(registerTestData.year);
    await page.getByLabel("Geschlecht").selectOption(sex);
    await page.getByRole("button", { name: "Submit" }).click();
    await page.waitForURL("/register/success");
    await expect(page).toHaveURL("/register/success");
  });

  test("login", async ({ page }) => {
    const {
      rows: [{ id: userId }],
    } = await sql`
            SELECT * FROM users 
            WHERE name = ${username}
         `;
    user_id = userId;
    const {
      rows: [{ token }],
    } = await sql`
            SELECT * FROM verification_token 
            WHERE user_id = ${userId}
         `;
    await page.goto(`/login/?verification_token=${token}`);
    await page.getByPlaceholder("Benutzername").fill(username);
    await page.getByPlaceholder("Passwort").fill(password);
    await page.getByRole("button", { name: "einloggen" }).click();
    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
  });
  test("insertRoadtrip", async ({ page }) => {
    /* login */
    await page.goto(`/login`);
    await page.getByPlaceholder("Benutzername").fill(username);
    await page.getByPlaceholder("Passwort").fill(password);
    await page.getByRole("button", { name: "einloggen" }).click();
    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
    /* insert Roaadtrip */
    await page.goto(`/insertRoadtrip`);
    await page.locator("#startland").fill(startland);
    await page.locator("#starttown").fill(starttown);
    await page.locator("#destland").fill(destland);
    await page.locator("#desttown").fill(desttown);
    await page.locator("#day").fill(roadtripTestData.day);
    await page.locator("#month").selectOption(roadtripTestData.month);
    await page.getByPlaceholder("Jahr").fill(roadtripTestData.year);
    await page.locator("#description").fill(description);
    await page
      .getByTestId("file")
      .setInputFiles(path.join(__dirname, "beispielTrip.jpeg"));
    await page.getByRole("button", { name: "submit" }).click();
    await page.waitForURL("/routesOverview");
    await expect(page).toHaveURL("/routesOverview");
  });
  test("check display of roadtrip", async ({ page }) => {
    const {
      rows: [{ id: userId }],
    } = await sql`
            SELECT * FROM users 
            WHERE name = ${username}
         `;
    const {
      rows: [{ id: roadtrip_id }],
    } = await sql`
            SELECT * FROM roadtrips 
            WHERE user_id = ${userId}
         `;
    await page.goto(`/routesOverview`);
    await page
      .getByRole("link", { name: `${username} ${startland} ${starttown}` })
      .click();
    await page.waitForURL(`/viewRoadtrip/${roadtrip_id}`);
    await expect(page).toHaveURL(`/viewRoadtrip/${roadtrip_id}`);
  });
});
