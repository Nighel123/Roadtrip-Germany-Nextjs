const { db, sql } = require("@vercel/postgres");

(async function transaction() {
  const client = await db.connect();
  try {
    await sql`BEGIN`; // start a transaction
    /* await client.sql`DELETE 
      FROM users
      WHERE id = '17'`; */
    const {
      rows: [{ id: user_id }],
    } = await sql`
        INSERT INTO users (id,name, email, password, birthday,sex)  
        VALUES (18,'Mighel', 'dreitschel', '12345','1991/10/03', 'weiblich')
        RETURNING id`;
    await sql`ROLLBACK`; // rollback the transaction
    await client.end();
  } catch (error) {
    console.error(error);
  }
})();

/* node -r dotenv/config ./scripts/transactions.js */
