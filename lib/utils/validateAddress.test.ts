import callValidateAddress from "./validateAddress";

test.skip("testing", async () => {
  const response = await callValidateAddress();
  console.log(response);
});
