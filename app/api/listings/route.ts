// app/api/listings/route.ts
import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";

export const runtime = "nodejs";

// GET /api/listings?q=&make=&maxPrice=&take=&cursor=&features=ABS,Apple%20CarPlay
export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const q         = searchParams.get("q") || "";
  const make      = searchParams.get("make") || "";
  const maxPrice  = parseInt(searchParams.get("maxPrice") || "", 10) || null;
  const take      = Math.min(Math.max(parseInt(searchParams.get("take") || "12", 10), 1), 48);
  const cursor    = searchParams.get("cursor") || undefined;
  const features  = (searchParams.get("features") || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const where = {
    AND: [
      q ? {
        OR: [
          {title: {contains: q, mode: "insensitive" as const}},
          {make:  {contains: q, mode: "insensitive" as const}},
          {model: {contains: q, mode: "insensitive" as const}},
        ]
      } : {},
      make ? { make: {contains: make, mode: "insensitive" as const} } : {},
      maxPrice ? { price: {lte: maxPrice} } : {},
      features.length ? { spec: { equipment: { hasEvery: features } } } : {},
    ]
  };

  const items = await prisma.listing.findMany({
    where,
    include: {
      images: true,
      seller: {select: {id: true, name: true}},
      spec: true,
    },
    orderBy: {createdAt: "desc"},
    take: take + 1,
    ...(cursor ? {cursor: {id: cursor}, skip: 1} : {})
  });

  const hasMore = items.length > take;
  const slice = hasMore ? items.slice(0, -1) : items;
  const nextCursor = hasMore ? slice[slice.length - 1]?.id : null;

  return NextResponse.json({items: slice, nextCursor});
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    title, make, model, year, price, km, city, coverUrl, description, sellerEmail = "demo@seller.local",
    images = [] as string[], spec = {} as any
  } = body;

  const seller = await prisma.user.upsert({
    where: {email: sellerEmail},
    update: {},
    create: {email: sellerEmail, name: "Demo Seller"},
  });

  const created = await prisma.listing.create({
    data: {
      title, make, model,
      year: Number(year), price: Number(price), km: Number(km),
      city, coverUrl, description,
      sellerId: seller.id,
      images: {create: images.map((url) => ({url}))},
      spec: { create: normalizeSpec(spec) },
    },
    include: {images: true, seller: {select: {id: true, name: true}}, spec: true},
  });

  return NextResponse.json(created, {status: 201});
}

function normalizeSpec(s: any) {
  const toInt = (v: any) => (v === undefined || v === null || v === "" ? null : Number.parseInt(v));
  const toFloat = (v: any) => (v === undefined || v === null || v === "" ? null : Number.parseFloat(v));
  const toBool = (v: any) => (typeof v === "boolean" ? v : v === "true" ? true : v === "false" ? false : null);
  const toDate = (v: any) => (v ? new Date(v) : null);
  const toArr = (v: any) => (Array.isArray(v) ? v.map(String) : typeof v === "string" && v ? v.split(",").map((x) => x.trim()) : []);

  return {
    condition: s.condition ?? null,
    accidentFree: toBool(s.accidentFree),
    origin: s.origin ?? null,
    category: s.category ?? null,
    series: s.series ?? null,
    equipmentLine: s.equipmentLine ?? null,
    driveType: s.driveType ?? null,
    fuelType: s.fuelType ?? null,
    displacementCc: toInt(s.displacementCc),
    powerKw: toInt(s.powerKw),
    powerHp: toInt(s.powerHp),
    energyConsumptionCombinedLPer100km: toFloat(s.energyConsumptionCombinedLPer100km),
    fuelConsumptionCombinedLPer100km: toFloat(s.fuelConsumptionCombinedLPer100km),
    co2CombinedGPerKm: toInt(s.co2CombinedGPerKm),
    seats: toInt(s.seats),
    doors: toInt(s.doors),
    gearbox: s.gearbox ?? null,
    envSticker: s.envSticker ?? null,
    firstRegistration: toDate(s.firstRegistration),
    ownersCount: toInt(s.ownersCount),
    hu: s.hu ?? null,
    airConditioning: s.airConditioning ?? null,
    parkingAid: toArr(s.parkingAid),
    airbags: toArr(s.airbags),
    colorManufacturer: s.colorManufacturer ?? null,
    color: s.color ?? null,
    interior: s.interior ?? null,
    trailerBrakedKg: toInt(s.trailerBrakedKg),
    trailerUnbrakedKg: toInt(s.trailerUnbrakedKg),
    weightKg: toInt(s.weightKg),
    cylinders: toInt(s.cylinders),
    tankSizeLiters: toInt(s.tankSizeLiters),
    equipment: toArr(s.equipment),
  };
}
