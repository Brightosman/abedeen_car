// // components/marketplace/Marketplace.tsx
// "use client";

// import {useMemo, useState} from "react";
// import Image from "next/image";
// import {useTranslations} from "next-intl";
// import {Search, SlidersHorizontal, Heart, ChevronRight} from "lucide-react";
// import {Link} from "@/i18n/routing";

// import {Button} from "@/components/ui/button";
// import {Card, CardContent} from "@/components/ui/card";
// import {Input} from "@/components/ui/input";
// import {Label} from "@/components/ui/label";
// import {Badge} from "@/components/ui/badge";

// type Car = {
//   id: string;
//   title: string;
//   make: string;
//   price: number;
//   km: number;
//   year: number;
//   img: string;
// };

// const DUMMY: Car[] = [
//   {id: "1", title: "BMW 320i M Sport", make: "BMW", price: 28900, km: 32000, year: 2021, img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop"},
//   {id: "2", title: "Audi A3 S line", make: "Audi", price: 21900, km: 54000, year: 2019, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"},
//   {id: "3", title: "Mercedes A200 AMG", make: "Mercedes", price: 25900, km: 41000, year: 2020, img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop"},
//   {id: "4", title: "VW Golf GTI Performance", make: "Volkswagen", price: 19950, km: 68000, year: 2018, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"},
//   {id: "5", title: "Peugeot 308 GT", make: "Peugeot", price: 17900, km: 52000, year: 2020, img: "https://source.unsplash.com/featured/1200x900/?peugeot,car"},
//   {id: "6", title: "Renault Clio RS", make: "Renault", price: 16400, km: 45000, year: 2019, img: "https://source.unsplash.com/featured/1200x900/?renault,car"},
//   {id: "7", title: "Toyota Corolla Hybrid", make: "Toyota", price: 20500, km: 30000, year: 2021, img: "https://source.unsplash.com/featured/1200x900/?toyota,car"},
//   {id: "8", title: "Tesla Model 3 SR+", make: "Tesla", price: 32900, km: 36000, year: 2021, img: "https://source.unsplash.com/featured/1200x900/?tesla,car"}
// ];

// /** image with graceful fallback */
// function SafeCardImage({src, alt}: {src: string; alt: string}) {
//   const FALLBACK = "https://source.unsplash.com/featured/1200x900/?car";
//   const [okSrc, setOkSrc] = useState(src);
//   return (
//     <Image
//       src={okSrc}
//       alt={alt}
//       width={1200}
//       height={900}
//       className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
//       onError={() => setOkSrc(FALLBACK)}
//     />
//   );
// }

// function Container({children}: {children: React.ReactNode}) {
//   return <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>;
// }

// export default function Marketplace() {
//   const t = useTranslations("Marketplace");

//   const [q, setQ] = useState("");
//   const [make, setMake] = useState("");
//   const [maxPrice, setMaxPrice] = useState<string>("");

//   const results = useMemo(() => {
//     const mp = parseInt(maxPrice || "", 10);
//     return DUMMY.filter((c) => {
//       const matchQ =
//         !q ||
//         c.title.toLowerCase().includes(q.toLowerCase()) ||
//         c.make.toLowerCase().includes(q.toLowerCase());
//       const matchMake = !make || c.make.toLowerCase().includes(make.toLowerCase());
//       const matchPrice = !mp || c.price <= mp;
//       return matchQ && matchMake && matchPrice;
//     });
//   }, [q, make, maxPrice]);

//   return (
//     <div className="bg-background text-foreground">
//       <header className="border-b">
//         <Container>
//           <div className="flex h-14 items-center justify-between">
//             <Link href="/" className="text-lg font-extrabold">Auto<span className="text-primary">Mart</span></Link>
//             <div className="hidden text-sm text-muted-foreground md:block">{t("tagline")}</div>
//           </div>
//         </Container>
//       </header>

//       <section className="py-6 md:py-8">
//         <Container>
//           <div className="flex items-center justify-between gap-3">
//             <h1 className="text-2xl font-bold md:text-3xl">{t("title")}</h1>
//             <Button variant="outline" className="gap-2 text-sm">
//               <SlidersHorizontal className="h-4 w-4" /> {t("filters")}
//             </Button>
//           </div>

//           {/* Filters */}
//           <Card className="mt-4">
//             <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-5">
//               <div className="sm:col-span-2">
//                 <Label htmlFor="q">{t("search.label")}</Label>
//                 <div className="relative mt-1">
//                   <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                   <Input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search.placeholder")} className="pl-9" />
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="make">{t("search.make")}</Label>
//                 <Input id="make" value={make} onChange={(e) => setMake(e.target.value)} placeholder={t("search.any")} />
//               </div>
//               <div>
//                 <Label htmlFor="max">{t("search.maxPrice")}</Label>
//                 <Input id="max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="25000" inputMode="numeric" />
//               </div>
//               <div className="flex items-end">
//                 <Button className="w-full" onClick={() => { /* no-op: live filters */ }}>
//                   {t("search.apply")}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Results meta */}
//           <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
//             <div>{t("results", {count: results.length})}</div>
//             <div>{t("disclaimer")}</div>
//           </div>

//           {/* Grid */}
//           <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {results.map((car) => (
//               <Card key={car.id} className="group overflow-hidden">
//                 <div className="relative">
//                   <SafeCardImage src={car.img} alt={car.title} />
//                   <Badge className="absolute left-3 top-3">#{car.id}</Badge>
//                   <Button variant="secondary" size="icon" className="absolute right-3 top-3 h-9 w-9 rounded-full">
//                     <Heart className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <CardContent className="p-4">
//                   <div className="flex items-start justify-between gap-3">
//                     <div>
//                       <h3 className="line-clamp-1 text-base font-semibold">{car.title}</h3>
//                       <p className="mt-0.5 text-xs text-muted-foreground">{car.year} • {car.km.toLocaleString()} km</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-lg font-bold">€{car.price.toLocaleString()}</p>
//                       <p className="text-xs text-muted-foreground">{t("vat")}</p>
//                     </div>
//                   </div>
//                   <Button className="mt-3 w-full" variant="outline">
//                     {t("view")} <ChevronRight className="ml-1 h-4 w-4" />
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </Container>
//       </section>
//     </div>
//   );
// }




// components/marketplace/Marketplace.tsx
"use client";

import {useEffect, useMemo, useState} from "react";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {Search, SlidersHorizontal, Heart, ChevronRight, Loader2} from "lucide-react";
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
  spec?: {
    equipment?: string[];
  };
};

function SafeCardImage({src, alt}: {src?: string | null; alt: string}) {
  const FALLBACK = "https://source.unsplash.com/featured/1200x900/?car";
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
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function buildQuery(cursor?: string) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (make) sp.set("make", make);
    if (maxPrice) sp.set("maxPrice", maxPrice);
    if (features.length) sp.set("features", features.join(","));
    sp.set("take", "12");
    if (cursor) sp.set("cursor", cursor);
    return sp.toString();
  }

  async function fetchPage(cursor?: string, replace = true) {
    setLoading(true);
    try {
      const qs = buildQuery(cursor);
      const res = await fetch(`/api/listings?${qs}`, {cache: "no-store"});
      const data = await res.json();
      if (replace) {
        setItems(data.items || []);
      } else {
        setItems((prev) => [...prev, ...(data.items || [])]);
      }
      setNextCursor(data.nextCursor ?? null);

      // push filters to URL (locale-aware path)
      const url = `${pathname}?${buildQuery()}`;
      router.replace(url as any); // typed for next-intl router
    } finally {
      setLoading(false);
    }
  }

  // initial + whenever filters change
  useEffect(() => {
    const id = setTimeout(() => fetchPage(undefined, true), 300); // debounce
    return () => clearTimeout(id);
  }, [q, make, maxPrice, features.join("|")]);

  const featureChoices = useMemo(
    () => ["ABS","Apple CarPlay","Android Auto","Seat heating","Navigation system","Blind Spot Assist","USB","Traction control"],
    []
  );

  return (
    <div className="bg-background text-foreground">
      <header className="border-b">
        <Container>
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="text-lg font-extrabold">
              Auto<span className="text-primary">Mart</span>
            </Link>
            <div className="hidden text-sm text-muted-foreground md:block">{t("tagline")}</div>
          </div>
        </Container>
      </header>

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
                  <Input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search.placeholder")} className="pl-9" />
                </div>
              </div>
              <div>
                <Label htmlFor="make">{t("search.make")}</Label>
                <Input id="make" value={make} onChange={(e) => setMake(e.target.value)} placeholder={t("search.any")} />
              </div>
              <div>
                <Label htmlFor="max">{t("search.maxPrice")}</Label>
                <Input id="max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="25000" inputMode="numeric" />
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
                          setFeatures((arr) => (arr.includes(feat) ? arr.filter((f) => f !== feat) : [...arr, feat]))
                        }
                        className={`text-xs rounded-full border px-2.5 py-1 ${active ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"}`}
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
                  <Button variant="secondary" size="icon" className="absolute right-3 top-3 h-9 w-9 rounded-full">
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
                        { t("view")}
                    </Button>
                </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load more */}
          <div className="mt-6 flex justify-center">
            {nextCursor ? (
              <Button onClick={() => fetchPage(nextCursor, false)} disabled={loading} className="min-w-[160px]">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Load more
              </Button>
            ) : (
              <div className="text-xs text-muted-foreground">{loading ? t("loading") : t("noMore") || "No more results"}</div>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
