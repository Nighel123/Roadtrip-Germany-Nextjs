import { zDeleteRoadtrip } from "./validateFormData";

const roadtripIdMock = [
  {
    roadtripId: "337ec81d-a83f-4bdf-ad39-9467f3112975",
  },
  {
    roadtripId: "d63da49a-e85e-44c2-91dc-9d268b396282",
  },
  {
    roadtripId: "c6d07b94-3dae-41d0-ae27-a33106c835b8",
  },
  {
    roadtripId: "0e5ec0d5-377a-4aff-a8e6-ecacfdd5081d",
  },
];

test.only("Test for valid roadtripID", () => {
  roadtripIdMock.forEach((roadtripForm) => {
    const parsedFormObj = zDeleteRoadtrip.safeParse(roadtripForm);
    expect(parsedFormObj.success).toBe(true);
  });
});
