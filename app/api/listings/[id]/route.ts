// app/api/listings/[id]/route.ts
import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";

export const runtime = "nodejs"; // Prisma requires the Node runtime

// GET /api/listings/:id  -> returns one listing with images, seller, and full spec
export async function GET(
  _req: Request,
  {params}: {params: Promise<{id: string}>}
) {
  const {id} = await params;

  const listing = await prisma.listing.findUnique({
    where: {id},
    include: {
      images: true,
      seller: true,
      spec: true
    }
  });

  if (!listing) {
    return NextResponse.json({error: "Not found"}, {status: 404});
  }

  return NextResponse.json(listing);
}
