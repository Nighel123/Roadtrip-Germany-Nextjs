import { zDeleteRoadtrip, zDeleteUser } from "./validateFormData";

const roadtripIdMock = [
  {
    id: "337ec81d-a83f-4bdf-ad39-9467f3112975",
  },
  {
    id: "d63da49a-e85e-44c2-91dc-9d268b396282",
  },
  {
    id: "c6d07b94-3dae-41d0-ae27-a33106c835b8",
  },
  {
    id: "0e5ec0d5-377a-4aff-a8e6-ecacfdd5081d",
  },
];

describe("image containers appear in the document", () => {
  test("Test for valid roadtripID", () => {
    roadtripIdMock.forEach((roadtripForm) => {
      const parsedFormObj = zDeleteRoadtrip.safeParse(roadtripForm);
      expect(parsedFormObj.success).toBe(true);
    });
  });
  test("Test for right 'Löschen' input", () => {
    const inputMock = [
      { delete: "Löschen" },
      { delete: "löschen" },
      { delete: "lösch" },
      { delete: "öschen" },
    ];
    const expectedOutput = [true, false, false, false];
    inputMock.forEach((input, index) => {
      const parsedFormObj = zDeleteUser.safeParse(input);
      expect(parsedFormObj.success).toBe(expectedOutput[index]);
    });
  });
  test.only("right error message format", () => {
    const parsedFormObj = zDeleteUser.safeParse({ delete: "löschen" });
    const error = parsedFormObj.error?.flatten().fieldErrors.delete?.join();
    expect(error).toBe('Du musst "Löschen" eingeben.');
  });
});
