import { z } from "zod";

export const zRoadtripID = z
  .string({
    message: "Das hat nicht geklappt.",
  })
  .length(36, {
    message: "Das hat nicht geklappt.",
  });

export const zDeleteRoadtrip = z.object({
  id: zRoadtripID,
});
