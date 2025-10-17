// app/api/listings/route.ts
import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";

export const dynamic = "force-dynamic";

/* -------------------- Types -------------------- */

type CreateListingBody = {
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  km: number;
  city?: string | null;
  coverUrl?: string | null;
  description?: string | null;
  images?: string[];
  spec?: Partial<SpecInput>;
};

type SpecInput = {
  condition?: string | null;
  accidentFree?: boolean | null;
  origin?: string | null;
  category?: string | null;
  series?: string | null;
  equipmentLine?: string | null;
  displacementCc?: number | null;
  powerKw?: number | null;
  powerHp?: number | null;
  driveType?: string | null;
  fuelType?: string | null;
  energyConsumptionCombinedLPer100km?: number | null;
  fuelConsumptionCombinedLPer100km?: number | null;
  co2CombinedGPerKm?: number | null;
  seats?: number | null;
  doors?: number | null;
  gearbox?: string | null;
  envSticker?: string | null;
  firstRegistration?: string | Date | null;
  ownersCount?: number | null;
  hu?: string | null;
  airConditioning?: string | null;
  // scalar lists
  parkingAid?: string[] | null;
  airbags?: string[] | null;
  equipment?: string[] | null;
  colorManufacturer?: string | null;
  color?: string | null;
  interior?: string | null;
  trailerBrakedKg?: number | null;
  trailerUnbrakedKg?: number | null;
  weightKg?: number | null;
  cylinders?: number | null;
  tankSizeLiters?: number | null;
};

/* -------------------- Utils -------------------- */

// remove only undefined (keep nulls if explicitly set)
function prune<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out as T;
}

/**
 * Normalize SpecInput to a shape Prisma will accept for create():
 * - scalar lists become string[] | undefined (never null)
 * - firstRegistration is parsed to Date | null
 * - undefined keys are removed; nulls are preserved where valid
 */
function normalizeSpec(input?: Partial<SpecInput>) {
  if (!input) return {};

  // Pull out fields that need special handling to avoid spreading their nullable types
  const {parkingAid, airbags, equipment, firstRegistration, ...rest} = input;

  // Helper: unknown/nullable -> string[] | undefined
  const toArray = (v?: unknown): string[] | undefined => {
    if (v == null) return undefined; // never return null for Prisma scalar lists
    const arr = Array.isArray(v) ? v : [v];
    const normalized = arr.map(String).filter(Boolean);
    return normalized.length ? normalized : undefined;
    };

  // Build output with explicit, compatible types
  const out: Partial<
    Omit<SpecInput, "parkingAid" | "airbags" | "equipment" | "firstRegistration">
  > & {
    parkingAid?: string[];
    airbags?: string[];
    equipment?: string[];
    firstRegistration?: Date | null;
  } = {...rest};

  // Date parsing (leave null as null)
  if (typeof firstRegistration === "string") {
    const d = new Date(firstRegistration);
    out.firstRegistration = Number.isNaN(d.valueOf()) ? null : d;
  } else if (firstRegistration instanceof Date || firstRegistration === null) {
    out.firstRegistration = firstRegistration;
  }

  // Scalar lists as plain string[] (never null)
  out.parkingAid  = toArray(parkingAid);
  out.airbags     = toArray(airbags);
  out.equipment   = toArray(equipment);

  // Remove only undefined keys; keep nulls when explicitly present
  return prune(out);
}

/* -------------------- Handlers -------------------- */

// GET /api/listings?take=20&skip=0
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const take = Math.min(Number(url.searchParams.get("take") ?? 20), 50);
    const skip = Number(url.searchParams.get("skip") ?? 0);

    const [items, total] = await Promise.all([
      prisma.listing.findMany({
        take: Number.isFinite(take) ? take : 20,
        skip: Number.isFinite(skip) ? skip : 0,
        orderBy: {createdAt: "desc"},
        include: {images: true, spec: true}
      }),
      prisma.listing.count()
    ]);

    return NextResponse.json({items, total});
  } catch (e: any) {
    console.error("GET /api/listings error:", e);
    return NextResponse.json({error: "Failed to load listings"}, {status: 500});
  }
}

// POST /api/listings
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateListingBody;

    // Basic validation
    if (!body?.title || !body?.make || !body?.model) {
      return NextResponse.json(
        {error: "Missing required fields (title, make, model)"},
        {status: 400}
      );
    }
    const year = Number(body.year);
    const price = Number(body.price);
    const km = Number(body.km);
    if (!Number.isFinite(year) || !Number.isFinite(price) || !Number.isFinite(km)) {
      return NextResponse.json(
        {error: "Invalid numeric fields (year, price, km)"},
        {status: 400}
      );
    }

    // Ensure a seller (demo)
    const seller = await prisma.user.upsert({
      where: {email: "seed@seller.local"},
      update: {},
      create: {email: "seed@seller.local", name: "Seed Seller"}
    });

    // Images
    const imagesArray: string[] = Array.isArray(body.images)
      ? body.images.map((u) => String(u))
      : [];

    const listing = await prisma.listing.create({
      data: {
        title: body.title,
        make: body.make,
        model: body.model,
        year,
        price,
        km,
        city: body.city ?? null,
        coverUrl: body.coverUrl ?? null,
        description: body.description ?? null,
        sellerId: seller.id,
        images: imagesArray.length
          ? {create: imagesArray.map((u: string) => ({url: u}))}
          : undefined,
        spec: {create: normalizeSpec(body.spec)}
      },
      include: {
        images: true,
        seller: {select: {id: true, name: true}},
        spec: true
      }
    });

    return NextResponse.json(listing, {status: 201});
  } catch (e: any) {
    console.error("POST /api/listings error:", e);
    return NextResponse.json({error: "Failed to create listing"}, {status: 500});
  }
}
