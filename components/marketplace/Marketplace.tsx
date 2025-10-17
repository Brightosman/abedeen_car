// components/marketplace/Marketplace.tsx
"use client";

import {useEffect, useMemo, useState} from "react";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {Search, SlidersHorizontal, Heart, Loader2} from "lucide-react";
import {Link, useRouter, usePathname} from "@/i18n/routing";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";

type Listing = {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  km: number;
  coverUrl: string | null;
  images: {id: string; url: string}[];
  spec?: {equipment?: string[]};
};

function SafeCardImage({src, alt}: {src?: string | null; alt: string}) {
  const FALLBACK =
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop";
  const [okSrc, setOkSrc] = useState(src || FALLBACK);
  return (
    <Image
      src={okSrc}
      alt={alt}
      width={1200}
      height={900}
      className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
      onError={() => setOkSrc(FALLBACK)}
    />
  );
}

function Container({children}: {children: React.ReactNode}) {
  return <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

const PAGE_SIZE = 12;

export default function Marketplace() {
  const t = useTranslations("Marketplace");
  const router = useRouter();
  const pathname = usePathname();

  // filters
  const [q, setQ] = useState("");
  const [make, setMake] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [features, setFeatures] = useState<string[]>([]);

  // data
  const [items, setItems] = useState<Listing[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasMore = useMemo(() => {
    if (total == null) return true; // unknown until first fetch
    return items.length < total;
  }, [items.length, total]);

  function buildQuery(skip = 0) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (make) sp.set("make", make);
    if (maxPrice) sp.set("maxPrice", maxPrice);
    if (features.length) sp.set("features", features.join(","));
    sp.set("take", String(PAGE_SIZE));
    sp.set("skip", String(skip));
    return sp.toString();
  }

  async function fetchPage({append}: {append: boolean}) {
    if (loading) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const skip = append ? items.length : 0;
      const qs = buildQuery(skip);
      const res = await fetch(`/api/listings?${qs}`, {cache: "no-store"});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as {items: Listing[]; total: number};

      setTotal(data.total);
      setItems(prev => (append ? [...prev, ...data.items] : data.items));

      // push filters to URL (locale-aware path), but without skip/take for cleaner URL
      const url = `${pathname}?${buildQuery(0)}`.replace(/(&?skip=\d+)|(&?take=\d+)/g, "").replace(/[?]&/g, "?").replace(/[?]$/, "");
      router.replace(url as any);
    } catch (e) {
      setErrorMsg(t("errorLoad"));
    } finally {
      setLoading(false);
    }
  }

  // initial + whenever filters change (debounced)
  useEffect(() => {
    const id = setTimeout(() => fetchPage({append: false}), 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, make, maxPrice, features.join("|")]);

  const featureChoices = useMemo(
    () => [
      "ABS",
      "Apple CarPlay",
      "Android Auto",
      "Seat heating",
      "Navigation system",
      "Blind Spot Assist",
      "USB",
      "Traction control"
    ],
    []
  );

  return (
    <div className="bg-background text-foreground">
      <section className="py-6 md:py-8">
        <Container>
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold md:text-3xl">{t("title")}</h1>
            <Button variant="outline" className="gap-2 text-sm">
              <SlidersHorizontal className="h-4 w-4" /> {t("filters")}
            </Button>
          </div>

          {/* Filters */}
          <Card className="mt-4">
            <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <Label htmlFor="q">{t("search.label")}</Label>
                <div className="relative mt-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="q"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={t("search.placeholder")}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="make">{t("search.make")}</Label>
                <Input
                  id="make"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder={t("search.any")}
                />
              </div>
              <div>
                <Label htmlFor="max">{t("search.maxPrice")}</Label>
                <Input
                  id="max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="25000"
                  inputMode="numeric"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>{t("filters")}</Label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {featureChoices.map((feat) => {
                    const active = features.includes(feat);
                    return (
                      <button
                        key={feat}
                        onClick={() =>
                          setFeatures((arr) =>
                            arr.includes(feat) ? arr.filter((f) => f !== feat) : [...arr, feat]
                          )
                        }
                        className={`text-xs rounded-full border px-2.5 py-1 ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-muted-foreground"
                        }`}
                      >
                        {feat}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="hidden sm:block" />
            </CardContent>
          </Card>

          {/* Results meta */}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div>{t("results", {count: items.length})}</div>
            <div>{t("disclaimer")}</div>
          </div>

          {/* Grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((car) => (
              <Card key={car.id} className="group overflow-hidden">
                <div className="relative">
                  <SafeCardImage src={car.coverUrl || car.images[0]?.url} alt={car.title} />
                  <Badge className="absolute left-3 top-3">#{car.id.slice(0, 5)}</Badge>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-3 top-3 h-9 w-9 rounded-full"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="line-clamp-1 text-base font-semibold">{car.title}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {car.year} • {car.km.toLocaleString()} km
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">€{car.price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{t("vat")}</p>
                    </div>
                  </div>
                  <Link href={`/listing/${car.id}`} className="block">
                    <Button className="mt-3 w-full" variant="outline">
                      {t("view")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load more */}
          <div className="mt-6 flex justify-center">
            {hasMore ? (
              <Button
                onClick={() => fetchPage({append: true})}
                disabled={loading}
                className="min-w-[160px]"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? t("loading") : t("loadMore")}
              </Button>
            ) : (
              <div className="text-xs text-muted-foreground">
                {t("noMore") || "No more results"}
              </div>
            )}
          </div>

          {/* Error banner */}
          {errorMsg ? (
            <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm">
              {errorMsg}
            </div>
          ) : null}
        </Container>
      </section>
    </div>
  );
}
