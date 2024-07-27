const { db } = require("@vercel/postgres");
const {
  addresses,
  roadtrips,
  users,
} = require("../app/lib/placeholder-data.js");
const bcrypt = require("bcrypt");

async function createTableVerification_token(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE verification_token
      (
        identifier TEXT NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        token TEXT NOT NULL,
        user_id SERIAL,
 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        PRIMARY KEY (identifier, token)
      );
    `;
    console.log(`Created "verification_token" table`);
    return {
      createTable,
    };
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        birthday DATE NOT NULL,
        sex VARCHAR(255) NOT NULL,
        image TEXT,
        "emailVerified" TIMESTAMPTZ
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password, birthday, sex)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.birthday}, ${user.sex})
        ON CONFLICT (id) DO NOTHING;
      `;
      })
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function seedRoadtrips(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "roadtrips" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS roadtrips (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id SERIAL NOT NULL,
      start_id UUID NOT NULL,
      dest_id UUID NOT NULL,
      date DATE NOT NULL,
      image_url TEXT NOT NULL,
      description TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (start_id) REFERENCES addresses(id) ON DELETE CASCADE,
      FOREIGN KEY (dest_id) REFERENCES addresses(id) ON DELETE CASCADE
  );
`;

    console.log(`Created "roadtrips" table`);

    // Insert data into the "roadtrips" table
    const insertedRoadtrips = await Promise.all(
      roadtrips.map(
        (roadtrip) => client.sql`
        INSERT INTO roadtrips (user_id, start_id, dest_id, date, image_url, description)
        VALUES (${roadtrip.user_id}, ${roadtrip.start_id}, ${roadtrip.dest_id}, ${roadtrip.date},${roadtrip.image_url},${roadtrip.description})
        ON CONFLICT (id) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${roadtrips.length} roadtrips`);

    return {
      createTable,
      roadtrips: insertedRoadtrips,
    };
  } catch (error) {
    console.error("Error seeding roadtrips:", error);
    throw error;
  }
}

async function seedAddresses(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "addresses" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS addresses (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        land TEXT NOT NULL,
        town TEXT NOT NULL
      );
    `;

    console.log(`Created "addresses" table`);

    // Insert data into the "addresses" table
    const insertedAddresses = await Promise.all(
      addresses.map(
        (address) => client.sql`
        INSERT INTO addresses (id, land, town)
        VALUES (${address.id}, ${address.land}, ${address.town})
        ON CONFLICT (id) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${addresses.length} addresses`);

    return {
      createTable,
      addresses: insertedAddresses,
    };
  } catch (error) {
    console.error("Error seeding addresses:", error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();
  const { sql } = client;

  try {
    await client.sql`DROP TABLE IF EXISTS roadtrips`;
    await client.sql`DROP TABLE IF EXISTS verification_token`;
    await client.sql`DROP TABLE IF EXISTS users`;
    await client.sql`DROP TABLE IF EXISTS addresses`;
  } catch (error) {
    console.log(`Error dropping Tables`);
    throw error;
  }
  await createTableVerification_token(client);
  await seedAddresses(client);
  await seedUsers(client);
  await seedRoadtrips(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
