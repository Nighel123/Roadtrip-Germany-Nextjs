import { test, expect } from "@playwright/test";
import path from "path";

const { db, sql } = require("@vercel/postgres");

const registerTestData = {
  day: "31",
  month: "Februar",
  year: "1991",
  sex: "weiblich",
};

const roadtripTestData = [
  {
    startland: "Dänemark",
    starttown: "Kopenhagen",
    destland: "Norwegen",
    desttown: "Oslo",
    day: "15",
    month: "September",
    year: "2024",
    description:
      "Hey, ich hätte voll Lust nach Oslo zu fahren. Ich würde gerne so eine Woche lang fahren und mir auf dem Weg Naturschutzgebiete und Wanderungen machen. Außerdem gehe ich gerne angeln und würde gerne in den Fjorden Makrelen angeln. Falls du Lust hast schreib mich gerne hier im Chat an!",
  },
  {
    startland: "Deutschland",
    starttown: "Würzburg",
    destland: "Holland",
    desttown: "Amsterdam",
    day: "3",
    month: "Oktober",
    year: "2024",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
  },
  {
    startland: "Deutschland",
    starttown: "Regensburg",
    destland: "Spain",
    desttown: "Barcelona",
    day: "9",
    month: "September",
    year: "2024",
    description:
      "Hey, I would like to drive to the Rainbow-Gathering in Spain around the 15th of Spain. I would like to take some time and go camping on the way! Preferably Wildcamping! I have a small car for three people. I would be happy to share the travels and food and costs!",
  },
  {
    startland: "Deutschland",
    starttown: "Hamburg",
    destland: "Spain",
    desttown: "Madrid",
    day: "20",
    month: "September",
    year: "2024",
    description:
      "I am Lisa and I am doing a travel to Madrid in Spain. I would like to find company travelling to the Rainbow-Gathering in Spain. I am a happy outgoing person who likes to meet new people and get to know more people. If you have any idead for the trip, what we can look at oder visit let me know",
  },
  {
    startland: "Paris",
    starttown: "Frankreich",
    destland: "Prag",
    desttown: "Tschechien",
    day: "1",
    month: "Oktober",
    year: "2024",
    description:
      "Hallo, my name is Flixi and I am visiting my parents in October in Prag. I would be very happy to have some travelmates with me on my way. I would like to make a small trip out of it and go to a festival in Prag.",
  },
];

const loginData = [
  {
    username: process.env.USER_NAME_1,
    password: process.env.PASS_1,
    email: process.env.EMAIL_1,
  },
  {
    username: process.env.USER_NAME_2,
    password: process.env.PASS_2,
    email: process.env.EMAIL_2,
  },
  {
    username: process.env.USER_NAME_3,
    password: process.env.PASS_3,
    email: process.env.EMAIL_3,
  },
  {
    username: process.env.USER_NAME_4,
    password: process.env.PASS_4,
    email: process.env.EMAIL_4,
  },
];

const { username, password, email } = loginData[3];
const { sex } = registerTestData;
const {
  startland,
  starttown,
  destland,
  desttown,
  description,
  day,
  month,
  year,
} = roadtripTestData[4];

let user_id: string;
test.describe("rootFunctions", () => {
  test("register", async ({ page }) => {
    /*     await sql`
      DELETE FROM users WHERE name = ${username}
    `; */
    await page.goto("/register");
    await page.getByLabel("Nutzername").fill(username || "");
    await page.getByLabel("E-Mail-Adresse").fill(email || "");
    await page.getByLabel("Passwort").fill(password || "");
    await page.getByPlaceholder("Tag").fill(registerTestData.day);
    await page.locator("#month").selectOption(registerTestData.month);
    await page.getByPlaceholder("Jahr").fill(registerTestData.year);
    await page.getByLabel("Geschlecht").selectOption(sex);
    await page.getByRole("button", { name: "Submit" }).click();
    await page.waitForURL(/(\/success)\b/gm);
    await expect(page).toHaveURL(/(\/success\/registered)\b/gm);
  });

  test("email-validation and login", async ({ page }) => {
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
    await page.getByPlaceholder("Benutzername").fill(username || "");
    await page.getByPlaceholder("Passwort").fill(password || "");
    await page.getByRole("button", { name: "einloggen" }).click();
    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
  });
  test("insertRoadtrip", async ({ page }) => {
    /* login */
    await page.goto(`/login`);
    await page.getByPlaceholder("Benutzername").fill(username || "");
    await page.getByPlaceholder("Passwort").fill(password || "");
    await page.getByRole("button", { name: "einloggen" }).click();
    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
    /* insert Roaadtrip */
    await page.goto(`/insertRoadtrip`);
    await page.locator("#startland").fill(startland);
    await page.locator("#starttown").fill(starttown);
    await page.locator("#destland").fill(destland);
    await page.locator("#desttown").fill(desttown);
    await page.locator("#day").fill(day);
    await page.locator("#month").selectOption(month);
    await page.getByPlaceholder("Jahr").fill(year);
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
  test("cleanup", async ({ page }) => {
    await sql`
      DELETE FROM users WHERE name = ${username}
    `;
  });
});
