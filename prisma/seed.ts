import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

const shops = [
  {
    slug: "monmouth-coffee-borough",
    name: "Monmouth Coffee",
    region: "London",
    city: "London",
    address: "2 Park Street, Borough Market, SE1 9AB",
    lat: 51.5055,
    lng: -0.091,
    rating: 5,
    roaster: "Monmouth Coffee Company",
    brewMethods: ["Espresso", "Filter", "French Press"],
    description:
      "One of London's original specialty coffee roasters, Monmouth has been sourcing and roasting single-origin beans since 1978. Their Borough Market location is a pilgrimage site for coffee lovers.",
    notes:
      "Always a queue but worth the wait. The single-origin filter rotates daily. Grab a bag of beans to take home.",
    imageUrl:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
    website: "https://www.monmouthcoffee.co.uk",
  },
  {
    slug: "prufrock-coffee",
    name: "Prufrock Coffee",
    region: "London",
    city: "London",
    address: "23-25 Leather Lane, EC1N 7TE",
    lat: 51.5197,
    lng: -0.109,
    rating: 5,
    roaster: "Multi-roaster",
    brewMethods: ["Espresso", "V60", "AeroPress", "Batch Brew"],
    description:
      "Founded by Gwilym Davies, World Barista Champion 2009. Prufrock is a cornerstone of London's specialty coffee scene, doubling as a barista training centre.",
    notes:
      "The baristas here are some of the best in the country. Ask for a recommendation — they love talking coffee.",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    website: "https://www.prufrockcoffee.com",
  },
  {
    slug: "origin-coffee-roasters",
    name: "Origin Coffee Roasters",
    region: "South West",
    city: "Cornwall",
    address: "Harbour Head, Porthleven, TR13 9JY",
    lat: 50.0838,
    lng: -5.3167,
    rating: 5,
    roaster: "Origin Coffee Roasters",
    brewMethods: ["Espresso", "V60", "Batch Brew"],
    description:
      "Roasting in Cornwall since 2004, Origin has built direct trade relationships across the coffee belt. Their Porthleven roastery overlooks the harbour.",
    notes:
      "Stunning harbourside location. The roastery tours are excellent if you can book one. Try their seasonal single-origin espresso.",
    imageUrl:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
    website: "https://www.origincoffee.co.uk",
  },
  {
    slug: "colonna-and-smalls",
    name: "Colonna & Smalls",
    region: "South West",
    city: "Bath",
    address: "6 Chapel Row, BA1 1HN",
    lat: 51.3837,
    lng: -2.361,
    rating: 5,
    roaster: "Colonna Coffee",
    brewMethods: ["Espresso", "V60", "AeroPress", "Syphon"],
    description:
      "Maxwell Colonna-Dashwood, three-time UK Barista Champion, runs this precision-focused café in Bath. The menu is structured by flavour intensity rather than drink size.",
    notes:
      "The three-tier menu (Foundation, Signature, Origin) is genius. Don't miss the seasonal single-origin on V60.",
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    website: "https://www.colonnacoffee.com",
  },
  {
    slug: "cairngorm-coffee",
    name: "Cairngorm Coffee",
    region: "Scotland",
    city: "Edinburgh",
    address: "41A Frederick Street, EH2 1EP",
    lat: 55.9533,
    lng: -3.1968,
    rating: 4,
    roaster: "Multi-roaster",
    brewMethods: ["Espresso", "V60", "Batch Brew"],
    description:
      "A specialty coffee staple in Edinburgh's New Town. Cairngorm serves carefully sourced coffee in a beautifully designed space with a focus on quality and community.",
    notes:
      "Lovely interior with great natural light. The brunch menu is solid too. Multiple locations around Edinburgh.",
    imageUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    website: "https://www.cairngormcoffee.com",
  },
  {
    slug: "takk-coffee-house",
    name: "Takk Coffee House",
    region: "North West",
    city: "Manchester",
    address: "6 Tariff Street, NQ, M1 2FF",
    lat: 53.4841,
    lng: -2.2346,
    rating: 4,
    roaster: "Multi-roaster",
    brewMethods: ["Espresso", "V60", "AeroPress", "Chemex"],
    description:
      "Inspired by Icelandic coffee culture, Takk brings Nordic minimalism to Manchester's Northern Quarter. A pioneer of the city's third-wave coffee scene.",
    notes:
      "The name means 'thanks' in Icelandic. Great Scandi-inspired food menu. The cinnamon buns are legendary.",
    imageUrl:
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",
    website: "https://www.takkmcr.com",
  },
  {
    slug: "north-star-coffee",
    name: "North Star Coffee",
    region: "Yorkshire",
    city: "Leeds",
    address: "Unit 4, 250 Sheepscar Court, LS7 2BB",
    lat: 53.808,
    lng: -1.536,
    rating: 4,
    roaster: "North Star Coffee Roasters",
    brewMethods: ["Espresso", "V60", "Batch Brew", "Cold Brew"],
    description:
      "Leeds-based roasters committed to sustainability, North Star focuses on direct trade and plastic-free packaging. Their roastery café serves exceptional coffee.",
    notes:
      "Brilliant sustainability ethos. The roastery space is industrial-chic. Their cold brew in summer is a must-try.",
    imageUrl:
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80",
    website: "https://www.northstarroast.com",
  },
  {
    slug: "pharmacie-coffee-roasters",
    name: "Pharmacie Coffee Roasters",
    region: "Scotland",
    city: "Edinburgh",
    address: "76 Marchmont Crescent, EH9 1HN",
    lat: 55.9365,
    lng: -3.193,
    rating: 4,
    roaster: "Pharmacie Coffee",
    brewMethods: ["Espresso", "V60", "AeroPress"],
    description:
      "A neighbourhood gem in Edinburgh's Marchmont, Pharmacie roasts in small batches and serves from a cosy, unpretentious space loved by locals and students alike.",
    notes:
      "Tiny but perfectly formed. The baristas really know their stuff. Great spot to sit with a book.",
    imageUrl:
      "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800&q=80",
    website: "https://www.pharmaciecoffee.co.uk",
  },
  {
    slug: "quarter-horse-coffee",
    name: "Quarter Horse Coffee",
    region: "South West",
    city: "Birmingham",
    address: "88-90 Bristol Street, B5 7AH",
    lat: 52.473,
    lng: -1.9003,
    rating: 5,
    roaster: "Quarter Horse Coffee Roasters",
    brewMethods: ["Espresso", "V60", "Kalita Wave", "Batch Brew"],
    description:
      "Quarter Horse is Birmingham's leading specialty roaster, with a roastery café that takes coffee seriously. Known for their meticulous approach to sourcing and roasting.",
    notes:
      "One of the best coffee experiences outside London. The roastery tours are educational and fun. Excellent pastries from local bakeries.",
    imageUrl:
      "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800&q=80",
    website: "https://www.quarterhorsecoffee.com",
  },
  {
    slug: "fortitude-coffee",
    name: "Fortitude Coffee",
    region: "Scotland",
    city: "Edinburgh",
    address: "3C York Place, EH1 3EB",
    lat: 55.9558,
    lng: -3.187,
    rating: 5,
    roaster: "Multi-roaster",
    brewMethods: ["Espresso", "V60", "AeroPress", "Batch Brew"],
    description:
      "A compact powerhouse on York Place, Fortitude punches well above its weight with expertly prepared coffee from top European roasters.",
    notes:
      "Small space, big flavours. The rotating guest roasters keep things interesting. Their flat white is one of the best in Scotland.",
    imageUrl:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80",
    website: "https://www.fortitudecoffee.com",
  },
];

async function main() {
  console.log("Seeding database...");

  for (const shop of shops) {
    await prisma.coffeeShop.upsert({
      where: { slug: shop.slug },
      update: shop,
      create: shop,
    });
    console.log(`  Upserted: ${shop.name}`);
  }

  console.log(`Seeded ${shops.length} coffee shops.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
