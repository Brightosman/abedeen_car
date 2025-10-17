// prisma/seed.ts  ← DROP IN
import {prisma} from "../lib/db";

const MAKES = [
  ["BMW","3 Series","sedan","G20"],
  ["Mercedes-Benz","A-Class","hatchback","W177"],
  ["Audi","A3","hatchback","8V"],
  ["Volkswagen","Golf","hatchback","Mk7"],
  ["Toyota","Corolla","sedan","E210"],
  ["Honda","Civic","sedan","FK8"],
  ["Ford","Focus","hatchback","Mk4"],
  ["Peugeot","308","hatchback","P51"],
  ["Renault","Clio","hatchback","V"],
  ["Hyundai","i30","hatchback","PD"],
  ["Kia","Ceed","hatchback","CD"],
  ["Skoda","Octavia","liftback","NX"],
  ["Seat","Leon","hatchback","KL"],
  ["Volvo","XC40","SUV","X"],
  ["Nissan","Qashqai","SUV","J12"],
  ["Mazda","3","hatchback","BP"],
  ["Mini","Cooper","hatchback","F56"],
  ["Mercedes-Benz","E-Class Cabrio","convertible","A238"],
  ["BMW","5 Series","sedan","G30"],
  ["Audi","A4","sedan","B9"]
];

const FEATURES = [
  "ABS","ESP","Traction control","Apple CarPlay","Android Auto","Navigation system","LED headlights",
  "LED daytime running lights","Alloy wheels","Seat heating","Keyless","Rain sensor","Tire pressure monitoring",
  "Blind Spot Assist","Lane keeping assistant","Adaptive cruise control","Head-Up Display","Bluetooth","USB",
  "Emergency braking assistant","Parking sensors front","Parking sensors rear","Rear camera","Self-steering systems",
  "2-zone automatic climate control","Automatic start/stop","Sports suspension","Sports seats","Ambient lighting"
];

const CITIES = ["Paris","Lyon","Marseille","Toulouse","Bordeaux","Berlin","Munich","Hamburg","Cologne","Amsterdam"];

function pick<T>(arr: T[]) { return arr[Math.floor(Math.random()*arr.length)]; }
function pickMany<T>(arr: T[], count: number) {
  const copy = [...arr];
  const out: T[] = [];
  for (let i=0;i<count && copy.length;i++){
    const idx = Math.floor(Math.random()*copy.length);
    out.push(copy.splice(idx,1)[0]);
  }
  return out;
}

async function main() {
  const seller = await prisma.user.upsert({
    where: {email: "seed@seller.local"},
    update: {},
    create: {email: "seed@seller.local", name: "Seed Seller"},
  });

  // Always include your detailed Mercedes example as one item
  await prisma.listing.create({
    data: {
      title: "Mercedes-Benz E200 Cabrio AMG",
      make: "Mercedes-Benz",
      model: "E-Class Cabrio",
      year: 2017,
      price: 32900,
      km: 89300,
      city: "Berlin",
      coverUrl: "https://source.unsplash.com/featured/1200x900/?mercedes,convertible&sig=1",
      description: "Accident-free, well maintained, full spec.",
      sellerId: seller.id,
      images: {create: [
        {url: "https://source.unsplash.com/featured/1200x900/?mercedes,cabrio&sig=11"},
        {url: "https://source.unsplash.com/featured/1200x900/?mercedes,interior&sig=12"},
      ]},
      spec: {create: {
        condition: "Used vehicle, accident-free",
        accidentFree: true,
        origin: "German version",
        category: "Convertible/Roadster",
        series: "E-Class Cabrio (BM 238)(09.2017->)",
        equipmentLine: "E200 (238,442)",
        displacementCc: 1991, powerKw: 135, powerHp: 184,
        driveType: "combustion engine", fuelType: "petrol",
        energyConsumptionCombinedLPer100km: 6.2, fuelConsumptionCombinedLPer100km: 6.2, co2CombinedGPerKm: 142,
        seats: 4, doors: 2, gearbox: "Automatic", envSticker: "4 (Green)",
        firstRegistration: new Date("2017-10-01"), ownersCount: 3, hu: "New",
        airConditioning: "2-zone automatic climate control",
        parkingAid: ["Front","Camera","Rear","Self-steering systems"],
        airbags: ["Front","Side","Additional"],
        colorManufacturer: "POLAR WHITE", color: "White Metallic", interior: "Full-grain leather, black",
        trailerBrakedKg: 1800, trailerUnbrakedKg: 750, weightKg: 1755,
        cylinders: 4, tankSizeLiters: 50,
        equipment: [
          "Tinted windows","ABS","Adaptive cruise control","Alarm system","Ambient lighting","Android Auto","Apple CarPlay",
          "Armrest","Heated windshield","Hill start assist","Glare-free high beam","Bluetooth","On-board computer",
          "Electric window lifter","Electric side mirrors","Electric folding side mirrors","Electric seat adjustment",
          "Electric immobiliser","ESP","Folding roof","High beam assistant","Hands-free system","Guarantee",
          "Luggage compartment partition","Speed limiter","Head-Up Display","Rear-wheel drive",
          "Interior mirror with automatic dimming","Inspection new","Isofix","Leather steering wheel",
          "LED headlights","LED daytime running lights","Alloy wheels","Light sensor","Fatigue warning",
          "Multifunction steering wheel","Night Vision Assistant","Navigation system","Fog lights","Non-smoking vehicle",
          "Emergency braking assistant","Emergency call system","Breakdown kit","Rain sensor","Tire pressure monitoring",
          "Paddle shifters","Service book maintained","Keyless central locking (Keyless)","Power steering","Seat heating",
          "Summer tires","Sports suspension","Sports package","Sports seats","Lane keeping assistant","Automatic start/stop",
          "Blind Spot Assist","Touchscreen","Traction control","Tuner/Radio","Folding passenger seat","USB",
          "Traffic sign recognition","Winter package","Winter tires","Central locking"
        ]
      }}
    }
  });

  // Generate 49 more cars
  for (let i = 0; i < 49; i++) {
    const [make, model, category, series] = pick(MAKES);
    const year = 2016 + Math.floor(Math.random() * 9); // 2016-2024
    const km = 10000 + Math.floor(Math.random() * 140000);
    const price = 9000 + Math.floor(Math.random() * 45000);
    const city = pick(CITIES);
    const powerKw = 85 + Math.floor(Math.random()*120);
    const powerHp = Math.round(powerKw * 1.341);
    const displacementCc = 1200 + Math.floor(Math.random()*1800);
    const fuelType = Math.random() < 0.75 ? "petrol" : "diesel";
    const driveType = "combustion engine";
    const doors = category === "convertible" ? 2 : (Math.random() < 0.3 ? 3 : 5);
    const seats = category === "convertible" ? 4 : 5;
    const imagesSig = 100 + i;

    const equip = pickMany(FEATURES, 8 + Math.floor(Math.random() * 10));
    const parkingAid = pickMany(["Front","Rear","Camera","Self-steering systems"], 1 + Math.floor(Math.random()*3));
    const airbags = pickMany(["Front","Side","Curtain","Additional"], 2 + Math.floor(Math.random()*2));

    await prisma.listing.create({
      data: {
        title: `${make} ${model} ${year}`,
        make,
        model,
        year,
        price,
        km,
        city,
        coverUrl: `https://source.unsplash.com/featured/1200x900/?${encodeURIComponent(make)},car&sig=${imagesSig}`,
        description: `${make} ${model} in good condition.`,
        sellerId: seller.id,
        images: {
          create: [
            {url: `https://source.unsplash.com/featured/1200x900/?${encodeURIComponent(model)},interior&sig=${imagesSig+1}`},
            {url: `https://source.unsplash.com/featured/1200x900/?${encodeURIComponent(make)},dashboard&sig=${imagesSig+2}`}
          ]
        },
        spec: {
          create: {
            condition: "Used vehicle",
            origin: "EU version",
            category,
            series,
            equipmentLine: Math.random() < 0.4 ? "Sport" : "Base",
            displacementCc,
            powerKw,
            powerHp,
            driveType,
            fuelType,
            fuelConsumptionCombinedLPer100km: Number((4.5 + Math.random()*3.5).toFixed(1)),
            co2CombinedGPerKm: 100 + Math.floor(Math.random()*80),
            seats,
            doors,
            gearbox: Math.random() < 0.7 ? "Automatic" : "Manual",
            envSticker: Math.random() < 0.5 ? "Crit’Air 1" : "Crit’Air 2",
            firstRegistration: new Date(`${year}-${String(1+Math.floor(Math.random()*12)).padStart(2,"0")}-01`),
            ownersCount: 1 + Math.floor(Math.random()*3),
            airConditioning: "Automatic climate control",
            parkingAid,
            airbags,
            color: Math.random() < 0.5 ? "Black" : "Grey Metallic",
            interior: Math.random() < 0.5 ? "Fabric, black" : "Leather, black",
            equipment: equip
          }
        }
      }
    });
  }

  console.log("✓ Seeded 50 cars");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
