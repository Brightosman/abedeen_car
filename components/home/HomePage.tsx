// components/home/HomePage.tsx
"use client";
import LocaleSwitcher from "@/components/LocaleSwitcher"; // ⬅️ added
import {useState} from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import {
  Search,
  Car,
  ShieldCheck,
  Gauge,
  Star,
  ChevronRight,
  Heart,
  Sparkles,
  Sun,
  Moon
} from "lucide-react";
import {useTheme} from "next-themes";
import {useTranslations} from "next-intl";
import {Link, useRouter, getPathname} from "@/i18n/routing";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import LightSweepBadge from "@/components/ui/LightSweepBadge";

/** ---------- Helpers ---------- */
function ThemeToggle() {
  const {theme, setTheme} = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

function Container({children}: {children: React.ReactNode}) {
  return <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function SectionHeading({
  kicker,
  title,
  subtitle
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {kicker ? (
        <p className="text-sm font-semibold tracking-wider text-primary uppercase">{kicker}</p>
      ) : null}
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{title}</h2>
      {subtitle ? (
        <p className="mt-3 text-base text-muted-foreground md:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}

/** Safe hero image with fallbacks */
function SafeHeroImage() {
  const FALLBACKS = [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
    "https://source.unsplash.com/featured/1600x1200/?car"
  ];
  const [idx, setIdx] = useState(0);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border bg-muted shadow-xl">
      <Image
        src={FALLBACKS[idx] ?? "/placeholder-car.jpg"}
        alt="Showcase cars"
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
        onError={() => setIdx(i => Math.min(i + 1, FALLBACKS.length - 1))}
      />
      <div className="absolute right-4 top-4 rounded-full bg-background/80 px-3 py-1 text-xs backdrop-blur">
        Fresh deals daily
      </div>
    </div>
  );
}

/** Safe card image (handles 404s gracefully) */
function SafeCardImage({src, alt}: {src: string; alt: string}) {
  const FALLBACK = "https://source.unsplash.com/featured/1200x900/?car";
  const [okSrc, setOkSrc] = useState(src);

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

/** ---------- Demo data (replace with server data) ---------- */
const featured = [
  {id: "1", title: "2021 BMW 320i M Sport", price: 28900, km: 32000, year: 2021, img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop"},
  {id: "2", title: "2019 Audi A3 S line", price: 21900, km: 54000, year: 2019, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"},
  {id: "3", title: "2020 Mercedes A200 AMG", price: 25900, km: 41000, year: 2020, img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop"},
  {id: "4", title: "2018 VW Golf GTI Performance", price: 19950, km: 68000, year: 2018, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"}
];

export default function HomePage() {
  const t = useTranslations("Home");
  const router = useRouter(); // locale-aware

  const [q, setQ] = useState("");
  const [make, setMake] = useState("");
  const [price, setPrice] = useState("");

  function submitSearch(e: React.FormEvent) {
  e.preventDefault();
  const qs = new URLSearchParams({ q, make, maxPrice: price || "" }).toString();
  // locale-aware router supports plain string; it will prefix current locale
  router.push(`/marketplace?${qs}`);
}

  return (
    <div className="min-h-screen bg-background text-foreground">


      {/* --- HERO --- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <Container>
          <div className="grid items-center gap-8 py-16 md:grid-cols-2 md:py-24">
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}}>
              {/* <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" /> {t("kicker")}
              </div> */}

              {/* <LightSweepBadge icon={<Sparkles className="h-3.5 w-3.5" />} speedSec={6} ring={2}>
                {t("kicker")}
              </LightSweepBadge> */}

              <LightSweepBadge
                icon={<Sparkles className="h-3.5 w-3.5" />}
                speedSec={7}
                ring={3}
                arcDeg={80}
                // color="hsl(45 90% 55%)"
              >
                {t("kicker")}
              </LightSweepBadge>

              {/* Headline without t.rich */}
              <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
                {t("headline.p1")}{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {t("headline.bold")}
                </span>
                {t("headline.p2")}
              </h1>

              <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">{t("sub")}</p>

              {/* Quick search */}
              <Card className="mt-6 border-primary/20 shadow-sm">
                <CardContent className="p-4 md:p-5">
                  <form onSubmit={submitSearch} className="grid grid-cols-1 gap-3 sm:grid-cols-5">
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
                      <Label htmlFor="price">{t("search.maxPrice")}</Label>
                      <Input
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="25000"
                        inputMode="numeric"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="submit" className="w-full">
                        {t("search.cta")}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {[
                  {icon: ShieldCheck, label: t("badges.verified")},
                  {icon: Gauge, label: t("badges.inspected")},
                  {icon: Star, label: t("badges.rating")},
                  {icon: Car, label: t("badges.count")}
                ].map(({icon: Icon, label}) => (
                  <div
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground"
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              initial={{opacity: 0, scale: 0.98}}
              animate={{opacity: 1, scale: 1}}
              transition={{duration: 0.6, delay: 0.1}}
              className="relative"
            >
              <SafeHeroImage />
              {/* Floating card */}
              <Card className="absolute -bottom-6 left-6 w-[85%] max-w-sm shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t("spotlight.title")}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-3 pb-4">
                  <div>
                    <p className="text-sm font-medium">Mercedes A200 AMG</p>
                    <p className="text-xs text-muted-foreground">2020 • 41,000 km</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">€25,900</div>
                    <Button variant="secondary" size="sm" className="mt-1">
                      {t("spotlight.view")} <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* FEATURED */}
      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading
            kicker={t("featured.kicker")}
            title={t("featured.title")}
            subtitle={t("featured.sub")}
          />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map(car => (
              <motion.div
                key={car.id}
                initial={{opacity: 0, y: 10}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.35}}
              >
                <Card className="group h-full overflow-hidden">
                  <div className="relative">
                    <SafeCardImage src={car.img} alt={car.title} />
                    <Badge className="absolute left-3 top-3">{t("featured.badge")}</Badge>
                    <Button variant="secondary" size="icon" className="absolute right-3 top-3 h-9 w-9 rounded-full">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="line-clamp-1 text-base font-semibold">{car.title}</h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">{car.year} • {car.km.toLocaleString()} km</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">€{car.price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{t("featured.vat")}</p>
                      </div>
                    </div>
                    <Link href={`/listing/${car.id}`} className="block">
                      <Button className="mt-3 w-full" variant="outline">
                        {t("featured.viewDetails")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button size="lg">
              {t("browseAll")} <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading kicker={t("how.kicker")} title={t("how.title")} subtitle={t("how.sub")} />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {step: 1, title: t("how.step1"), desc: t("how.desc1")},
              {step: 2, title: t("how.step2"), desc: t("how.desc2")},
              {step: 3, title: t("how.step3"), desc: t("how.desc3")}
            ].map(s => (
              <Card key={s.step} className="relative">
                <CardHeader>
                  <div className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    {s.step}
                  </div>
                  <CardTitle>{s.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{s.desc}</CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-muted/30 py-16">
        <Container>
          <SectionHeading kicker={t("testimonials.kicker")} title={t("testimonials.title")} />
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-16">
        <Container>
          <div className="relative isolate overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-transparent to-primary/10 p-8 md:p-12">
            <div className="grid items-center gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-2xl font-bold md:text-3xl">{t("cta.title")}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t("cta.sub")}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button size="lg">{t("cta.primary")}</Button>
                  <Button size="lg" variant="secondary">
                    {t("cta.secondary")}
                  </Button>
                </div>
              </div>
              <Card className="md:ml-auto">
                <CardContent className="p-4 md:p-6">
                  <form className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="email">{t("cta.guideLabel")}</Label>
                      <Input id="email" placeholder="you@example.com" type="email" />
                    </div>
                    <div className="sm:col-span-2">
                      <Button className="w-full">{t("cta.sendGuide")}</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
