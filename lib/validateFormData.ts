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

export const zDeleteUser = z.object({
  delete: z
    .string({
      message: `Du musst "Löschen" eingeben.`,
    })
    .regex(/Löschen/gm, {
      message: `Du musst "Löschen" eingeben.`,
    }),
});
