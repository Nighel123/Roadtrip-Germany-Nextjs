import { z } from "zod";

export const zRoadtripID = z
  .string({
    message: "Das hat nicht geklappt.",
  })
  .uuid({
    message: "Das hat nicht geklappt.",
  });

export const zDeleteRoadtrip = z.object({
  id: zRoadtripID,
});
