// app/[locale]/listing/[id]/page.tsx  ← DROP IN
import {prisma} from "@/lib/db";
import Image from "next/image";
import {notFound} from "next/navigation";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function Page({
  params
}: {
  params: Promise<{locale: string; id: string}>;
}) {
  const {id} = await params;

  const car = await prisma.listing.findUnique({
    where: {id},
    include: {images: true, seller: true, spec: true},
  });

  if (!car) return notFound();

  const img = car.coverUrl || car.images[0]?.url || "https://source.unsplash.com/featured/1200x900/?car";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
          <Image src={img} alt={car.title} fill className="object-cover" />
          <Badge className="absolute left-3 top-3">#{car.id.slice(0,5)}</Badge>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{car.title}</h1>
          <p className="mt-1 text-muted-foreground">
            {car.year} • {car.km.toLocaleString()} km • €{car.price.toLocaleString()}
          </p>

          <Card className="mt-4">
            <CardContent className="p-4">
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Spec label="Condition" value={car.spec?.condition} />
                <Spec label="Origin" value={car.spec?.origin} />
                <Spec label="Category" value={car.spec?.category} />
                <Spec label="Series" value={car.spec?.series} />
                <Spec label="Equipment line" value={car.spec?.equipmentLine} />
                <Spec label="Displacement" value={car.spec?.displacementCc ? `${car.spec?.displacementCc} cm³` : undefined} />
                <Spec label="Power" value={car.spec?.powerKw ? `${car.spec?.powerKw} kW (${car.spec?.powerHp} hp)` : undefined} />
                <Spec label="Drive type" value={car.spec?.driveType} />
                <Spec label="Fuel type" value={car.spec?.fuelType} />
                <Spec label="Fuel cons. (comb.)" value={fmtNum(car.spec?.fuelConsumptionCombinedLPer100km, "l/100km")} />
                <Spec label="CO₂ (comb.)" value={car.spec?.co2CombinedGPerKm ? `${car.spec?.co2CombinedGPerKm} g/km` : undefined} />
                <Spec label="Seats" value={car.spec?.seats?.toString()} />
                <Spec label="Doors" value={car.spec?.doors?.toString()} />
                <Spec label="Gearbox" value={car.spec?.gearbox} />
                <Spec label="Env. sticker" value={car.spec?.envSticker} />
                <Spec label="First registration" value={car.spec?.firstRegistration?.toISOString().slice(0,10)} />
                <Spec label="Owners" value={car.spec?.ownersCount?.toString()} />
                <Spec label="AC" value={car.spec?.airConditioning} />
                <Spec label="Color (Manuf.)" value={car.spec?.colorManufacturer} />
                <Spec label="Color" value={car.spec?.color} />
                <Spec label="Interior" value={car.spec?.interior} />
                <Spec label="Trailer load (braked)" value={car.spec?.trailerBrakedKg ? `${car.spec?.trailerBrakedKg} kg` : undefined} />
                <Spec label="Trailer load (unbraked)" value={car.spec?.trailerUnbrakedKg ? `${car.spec?.trailerUnbrakedKg} kg` : undefined} />
                <Spec label="Weight" value={car.spec?.weightKg ? `${car.spec?.weightKg} kg` : undefined} />
                <Spec label="Cylinders" value={car.spec?.cylinders?.toString()} />
                <Spec label="Tank size" value={car.spec?.tankSizeLiters ? `${car.spec?.tankSizeLiters} l` : undefined} />
              </dl>

              {car.spec?.parkingAid?.length ? (
                <Box title="Parking aid">
                  {car.spec.parkingAid.map((p) => <Tag key={p} text={p} />)}
                </Box>
              ) : null}

              {car.spec?.airbags?.length ? (
                <Box title="Airbags">
                  {car.spec.airbags.map((a) => <Tag key={a} text={a} />)}
                </Box>
              ) : null}

              {car.spec?.equipment?.length ? (
                <Box title="Equipment">
                  {car.spec.equipment.map((e) => <Tag key={e} text={e} />)}
                </Box>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Spec({label, value}:{label:string; value?:string}) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs uppercase text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}

function Box({title, children}:{title:string; children:React.ReactNode}) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Tag({text}:{text:string}) {
  return <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">{text}</span>;
}

function fmtNum(n?: number | null, suffix?: string) {
  if (n === undefined || n === null) return undefined;
  return `${n}${suffix ? " " + suffix : ""}`;
}
