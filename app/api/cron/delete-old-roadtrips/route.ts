import { del } from "@vercel/blob";
import { deleteOldRoadtrips, fetchOldRoadtripImages } from "lib/data/roadtrips";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const offsetDays = 14;
  const data = await fetchOldRoadtripImages(offsetDays);
  const imgArr = data.map((imgObj) => imgObj.image_url);
  await deleteOldRoadtrips(offsetDays);
  del(imgArr);
  return new NextResponse("OK", {
    status: 200,
  });
}
