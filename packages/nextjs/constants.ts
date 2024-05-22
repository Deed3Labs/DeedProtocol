import { IconBitcoin, IconDollar, IconEthereum, IconGnosis, IconPolygon } from "./styles/Icons";

export const defaultPage = "property-explorer?type=all";

export const OwnerTypeOptions = [
  {
    title: "Individual",
    tag: "Most Common",
    value: "individual",
  },
  {
    title: "Corporation",
    tag: "Legal Entity",
    value: "legal",
  },
  {
    title: "Foreign Entity",
    tag: "Coming soon",
    value: "foreign",
    disabled: true,
  },
] as const;

export const StateOptions = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "American Samoa", value: "AS" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "District of Columbia", value: "DC" },
  { label: "States of Micronesia", value: "FM" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Guam", value: "GU" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Marshall Islands", value: "MH" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Northern Mariana Islands", value: "MP" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregan", value: "OR" },
  { label: "Palau", value: "PW" },
  { label: "Pennsilvania", value: "PA" },
  { label: "Puerto Rico", value: "PR" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virgin Islands", value: "VI" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" },
] as const;

export const VehicleMakesAndModels = {
  Audi: ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "TT", "R8", "RS3", "RS4", "RS5"],
  BMW: [
    "118I",
    "220I",
    "228I",
    "320I",
    "328I",
    "330I",
    "335I",
    "340I",
    "M3",
    "M4",
    "X1",
    "X3",
    "X5",
    "X6",
    "Z4",
  ],
  "Mercedes Benz": [
    "A-Class",
    "B-Class",
    "C-Class",
    "E-Class",
    "S-Class",
    "GLA",
    "GLC",
    "GLE",
    "GLS",
    "AMG GT",
    "G-Class",
  ],
  Ford: [
    "Fiesta",
    "Focus",
    "Fusion",
    "Mustang",
    "Escape",
    "Explorer",
    "F-150",
    "Ranger",
    "Transit",
    "EcoSport",
    "Edge",
  ],
  Chevrolet: [
    "Spark",
    "Malibu",
    "Impala",
    "Camaro",
    "Silverado",
    "Equinox",
    "Tahoe",
    "Suburban",
    "Colorado",
    "Traverse",
  ],
  Toyota: [
    "Yaris",
    "Corolla",
    "Camry",
    "Prius",
    "RAV4",
    "Highlander",
    "Tacoma",
    "Tundra",
    "Sienna",
    "4Runner",
    "Land Cruiser",
  ],
  Honda: [
    "Fit",
    "Civic",
    "Accord",
    "CR-V",
    "Pilot",
    "Odyssey",
    "Ridgeline",
    "HR-V",
    "Insight",
    "Passport",
  ],
  Nissan: [
    "Micra",
    "Leaf",
    "Sentra",
    "Altima",
    "Maxima",
    "370Z",
    "GT-R",
    "Kicks",
    "Rogue",
    "Murano",
    "Pathfinder",
  ],
  Hyundai: [
    "i10",
    "i20",
    "i30",
    "Elantra",
    "Sonata",
    "Tucson",
    "Santa Fe",
    "Kona",
    "Palisade",
    "Veloster",
  ],
  Kia: [
    "Picanto",
    "Rio",
    "Soul",
    "Forte",
    "Optima",
    "Sorento",
    "Sportage",
    "Telluride",
    "Stinger",
    "Carnival",
  ],
  Volkswagen: [
    "Polo",
    "Golf",
    "Passat",
    "Tiguan",
    "Arteon",
    "Touareg",
    "Atlas",
    "Jetta",
    "Beetle",
    "ID.4",
  ],
  Subaru: ["Impreza", "Outback", "Forester", "Legacy", "WRX", "BRZ", "Crosstrek", "Ascent"],
  Lexus: ["IS", "ES", "GS", "LS", "RC", "LC", "UX", "NX", "RX", "GX", "LX"],
  Jaguar: ["XE", "XF", "XJ", "F-Pace", "E-Pace", "I-Pace", "F-Type"],
  Volvo: ["S60", "S90", "V60", "V90", "XC40", "XC60", "XC90"],
  Mitsubishi: ["Mirage", "Lancer", "Outlander", "Eclipse Cross", "Pajero"],
  "Land Rover": [
    "Discovery",
    "Discovery Sport",
    "Range Rover Evoque",
    "Range Rover Velar",
    "Range Rover Sport",
    "Range Rover",
  ],
  Jeep: ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator"],
  Dodge: ["Challenger", "Charger", "Durango", "Journey", "Grand Caravan"],
  Infiniti: ["Q50", "Q60", "QX50", "QX60", "QX80"],
  Acura: ["ILX", "TLX", "RLX", "RDX", "MDX"],
  Cadillac: ["CT4", "CT5", "XT4", "XT5", "XT6", "Escalade"],
  Porsche: ["718 Boxster", "718 Cayman", "911", "Panamera", "Macan", "Cayenne", "Taycan"],
  Fiat: ["500", "500X", "500L", "Panda", "Tipo"],
  Peugeot: ["208", "308", "508", "2008", "3008", "5008"],
  "Alfa Romeo": ["Giulia", "Stelvio", "4C"],
  Skoda: ["Fabia", "Octavia", "Superb", "Karoq", "Kodiaq"],
  Renault: ["Clio", "Megane", "Kadjar", "Captur", "Zoe"],
  Opel: ["Corsa", "Astra", "Insignia", "Crossland", "Grandland X"],
  GMC: ["Terrain", "Acadia", "Yukon", "Yukon XL", "Sierra"],
  Buick: ["Encore", "Envision", "Enclave", "Regal"],
  Mini: ["Cooper", "Cooper Clubman", "Cooper Countryman"],
  Tesla: ["Model S", "Model 3", "Model X", "Model Y"],
  Ferrari: ["Portofino", "F8 Tributo", "812 Superfast", "SF90 Stradale"],
  Lamborghini: ["Huracan", "Aventador", "Urus"],
  Bentley: ["Continental GT", "Bentayga", "Flying Spur"],
  "Aston Martin": ["DB11", "Vantage", "DBS Superleggera"],
  "Rolls Royce": ["Ghost", "Wraith", "Dawn", "Cullinan", "Phantom"],
  Maserati: ["Ghibli", "Quattroporte", "Levante"],
  Citroën: ["C3", "C4", "C5 Aircross"],
  Seat: ["Ibiza", "Leon", "Ateca", "Tarraco"],
  Suzuki: ["Swift", "Vitara", "SX4 S-Cross", "Jimny"],
  MG: ["MG3", "ZS", "HS", "MG5"],
  Koenigsegg: ["Agera", "Regera", "Jesko"],
  Pagani: ["Huayra", "Zonda"],
  Bugatti: ["Chiron", "Veyron", "Divo"],
  Mazda: ["2", "3", "6", "CX-3", "CX-30", "CX-5", "CX-9", "MX-5 Miata", "BT-50", "RX-8"],

  // Add more makes and models as needed
} as const;

export const VehicleMakeOptions = Object.keys(VehicleMakesAndModels).map(make => ({
  label: make,
  value: make,
}));

export const getVehicleModelsOptions = (make: keyof typeof VehicleMakesAndModels) => {
  return (
    VehicleMakesAndModels[make]?.map((model: string) => ({
      label: model,
      value: model.toLowerCase(),
    })) || []
  );
};

export const EntityTypeOptions = [
  { label: "Limited Partnership (LP)", value: "LP" },
  { label: "Corporation (C-Corp)", value: "C-Corp" },
  { label: "S Corporation (S-Corp)", value: "S-Corp" },
  { label: "Limited Liability Company (LLC)", value: "LLC" },
] as const;

export const PropertyTypeOptions = [
  {
    title: "Real Estate",
    value: "realEstate",
    tag: "Most Common",
    subtitle: "Land, buildings, etc.",
  },
  {
    title: "Vehicle",
    value: "vehicle",
    tag: "Trending",
    subtitle: "RVs, motorcycles, etc.",
  },
  {
    title: "Equipment",
    value: "equipment",
    tag: "Coming soon",
    subtitle: "Tech, machines, etc.",
    disabled: true,
  },
  {
    title: "More Options",
    value: "more",
    tag: "Coming soon",
    subtitle: "IP, trademarks, etc.",
    disabled: true,
  },
] as const;

export const AgentTypeOptions = [
  {
    label: "FIX ME KHAY",
    value: "fixme",
  },
] as const;

export const PropertySubtypeOptions = [
  { label: "House", value: "house" },
  { label: "Apartment", value: "appartement" },
  { label: "Bachelor", value: "bachelor" },
  { label: "Condo", value: "condo" },
  { label: "Land", value: "land" },
] as const;

export const PropertyZoningOptions = [
  { label: "Residential", value: "residential" },
  { label: "Industrial", value: "industrial" },
  { label: "Commercial", value: "commercial" },
  { label: "Agricultural", value: "agricultural" },
  { label: "Mixed-Use", value: "mixed" },
] as const;

export const BlockchainOptions = [
  {
    title: "Gnosis Chain",
    tag: "Recommended",
    subtitle: "Estimated cost to mint DeedNFT: $0.05",
    value: "gnosis",
    icon: IconGnosis,
  },
  {
    title: "Ethereum",
    tag: "Most popular",
    subtitle: "Estimated cost to mint DeedNFT: $7.87",
    value: "eth",
    icon: IconEthereum,
    disabled: true,
  },
  {
    title: "Polygon",
    tag: "Trending",
    subtitle: "Estimated cost to mint DeedNFT: $3.29",
    value: "polygon",
    icon: IconPolygon,
    disabled: true,
  },
  {
    title: "More Options",
    tag: "Other chains",
    subtitle: "Explore available sidechains, L2s, etc.",
    value: "other",
    disabled: true,
  },
] as const;

export const PaymentOptions = [
  {
    title: "Debit or Credit",
    tag: "Via stripe",
    value: "fiat",
    icon: IconDollar,
  },
  {
    title: "Crypto Currency",
    tag: "Stablecoin",
    value: "crypto",
    icon: IconBitcoin,
  },
  {
    title: "More Options",
    tag: "Coming soon",
    value: "other",
    disabled: true,
  },
] as const;

export const WrapperOptions = (prices: string[]) =>
  [
    {
      title: "Nominee Trust",
      tag: "Recommended",
      subtitle: `Recommended for most situations. This type of property wrapper is ideal for those who desire an additional layer of anonymity, while offering legal protections and benefits similar to LLCs.
      
    Estimated cost to deploy contract: ${prices[0]}`,
      value: "trust",
    } as const,
    {
      title: "Limited Liability Company",
      tag: "Multi-Layered",
      subtitle: `Formed in combination with a Nominee Trust. This type of property wrapper is generally more expensive to deploy but perfect for revenue-generating properties with multiple owners.
      
    Estimated cost to deploy contract: ${prices[1]}
    `,
      value: "llc",
    } as const,
  ] as const;

export const ExplorerPageSize = 10;
