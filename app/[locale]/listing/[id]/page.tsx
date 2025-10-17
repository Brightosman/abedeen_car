// app/[locale]/listing/[id]/page.tsx  ← DROP IN
import {prisma} from "@/lib/db";
import Image from "next/image";
import {notFound} from "next/navigation";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import {getTranslations} from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function Page({
  params
}: {
  params: Promise<{locale: "en" | "fr"; id: string}>;
}) {
  const {locale, id} = await params;
  const t = await getTranslations({locale, namespace: "Listing"});

  const car = await prisma.listing.findUnique({
    where: {id},
    include: {images: true, seller: true, spec: true},
  });

  if (!car) return notFound();

  const img =
    car.coverUrl ||
    car.images[0]?.url ||
    "https://source.unsplash.com/featured/1200x900/?car";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Top block */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
          <Image src={img} alt={car.title} fill className="object-cover" />
          <Badge className="absolute left-3 top-3">#{car.id.slice(0, 5)}</Badge>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{car.title}</h1>
          <p className="mt-1 text-muted-foreground">
            {car.year} • {car.km.toLocaleString()} km • €
            {car.price.toLocaleString()}
          </p>

          {car.description ? (
            <p className="mt-4 text-sm text-muted-foreground">{car.description}</p>
          ) : null}

          {car.seller ? (
            <Card className="mt-4">
              <CardContent className="p-4">
                <p className="text-sm">
                  <span className="font-semibold">{t("seller")}:</span>{" "}
                  {car.seller.name || car.seller.email}
                </p>
                {car.city ? (
                  <p className="text-sm text-muted-foreground">
                    {t("location")}: {car.city}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      {/* Specs */}
      <Card className="mt-8">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg font-semibold">{t("specs.heading")}</h2>
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Spec label={t("specs.condition")} value={car.spec?.condition} />
            <Spec label={t("specs.origin")} value={car.spec?.origin} />
            <Spec label={t("specs.category")} value={car.spec?.category} />
            <Spec label={t("specs.series")} value={car.spec?.series} />
            <Spec label={t("specs.equipmentLine")} value={car.spec?.equipmentLine} />
            <Spec
              label={t("specs.displacement")}
              value={num(car.spec?.displacementCc, "cm³")}
            />
            <Spec
              label={t("specs.power")}
              value={
                car.spec?.powerKw
                  ? `${car.spec.powerKw} kW (${car.spec.powerHp ?? Math.round((car.spec.powerKw || 0) * 1.341)} hp)`
                  : undefined
              }
            />
            <Spec label={t("specs.driveType")} value={car.spec?.driveType} />
            <Spec label={t("specs.fuelType")} value={car.spec?.fuelType} />
            <Spec
              label={t("specs.fuelConsumption")}
              value={num(car.spec?.fuelConsumptionCombinedLPer100km ?? car.spec?.energyConsumptionCombinedLPer100km, "l/100km")}
            />
            <Spec
              label={t("specs.co2")}
              value={num(car.spec?.co2CombinedGPerKm, "g/km")}
            />
            <Spec label={t("specs.seats")} value={car.spec?.seats?.toString()} />
            <Spec label={t("specs.doors")} value={car.spec?.doors?.toString()} />
            <Spec label={t("specs.gearbox")} value={car.spec?.gearbox} />
            <Spec label={t("specs.envSticker")} value={car.spec?.envSticker} />
            <Spec
              label={t("specs.firstRegistration")}
              value={car.spec?.firstRegistration?.toISOString().slice(0, 10)}
            />
            <Spec
              label={t("specs.ownersCount")}
              value={car.spec?.ownersCount?.toString()}
            />
            <Spec label={t("specs.ac")} value={car.spec?.airConditioning} />
            <Spec
              label={t("specs.colorManufacturer")}
              value={car.spec?.colorManufacturer}
            />
            <Spec label={t("specs.color")} value={car.spec?.color} />
            <Spec label={t("specs.interior")} value={car.spec?.interior} />
            <Spec
              label={t("specs.trailerBraked")}
              value={num(car.spec?.trailerBrakedKg, "kg")}
            />
            <Spec
              label={t("specs.trailerUnbraked")}
              value={num(car.spec?.trailerUnbrakedKg, "kg")}
            />
            <Spec label={t("specs.weight")} value={num(car.spec?.weightKg, "kg")} />
            <Spec label={t("specs.cylinders")} value={car.spec?.cylinders?.toString()} />
            <Spec
              label={t("specs.tankSize")}
              value={num(car.spec?.tankSizeLiters, "l")}
            />
          </dl>

          {/* Groups */}
          {car.spec?.parkingAid?.length ? (
            <Group title={t("groups.parkingAid")}>
              {car.spec.parkingAid.map((p) => (
                <Tag key={p} text={p} />
              ))}
            </Group>
          ) : null}

          {car.spec?.airbags?.length ? (
            <Group title={t("groups.airbags")}>
              {car.spec.airbags.map((a) => (
                <Tag key={a} text={a} />
              ))}
            </Group>
          ) : null}

          {car.spec?.equipment?.length ? (
            <Group title={t("groups.equipment")}>
              {car.spec.equipment.map((e) => (
                <Tag key={e} text={e} />
              ))}
            </Group>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Spec({label, value}: {label: string; value?: string}) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs uppercase text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}

function Group({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Tag({text}: {text: string}) {
  return (
    <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
      {text}
    </span>
  );
}

function num(n?: number | null, suffix?: string) {
  if (n === undefined || n === null) return undefined;
  return `${n}${suffix ? " " + suffix : ""}`;
}
