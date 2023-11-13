import { RadioBoxOption } from "./components/inputs/RadioBoxes";
import { IconEthereum, IconGnosis, IconPolygon } from "./styles/Icons";

export const OwnerTypeOptions: RadioBoxOption[] = [
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
];

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
];

export const EntityTypeOptions = [
  { label: "Limited Partnership (LP)", value: "LP" },
  { label: "Corporation (C-Corp)", value: "C-Corp" },
  { label: "S Corporation (S-Corp)", value: "S-Corp" },
  { label: "Limited Liability Company (LLC)", value: "LLC" },
];

export const PropertyTypeOptions: RadioBoxOption[] = [
  {
    title: "Real Estate",
    value: "realEstate",
    tag: "Most Common",
    subtitle: "Land, buildings, etc.",
  },
  {
    title: "Vehicle",
    value: "vehicle",
    tag: "Comming soon",
    subtitle: "RVs, motorcycles, etc.",
    disabled: true,
  },
  {
    title: "Equipment",
    value: "equipment",
    tag: "Comming soon",
    subtitle: "Tech, machines, etc.",
    disabled: true,
  },
  {
    title: "More Options",
    value: "more",
    tag: "Comming soon",
    subtitle: "IP, trademarks, etc.",
    disabled: true,
  },
];

export const PropertySubtypeOptions = [
  { label: "House", value: "house" },
  { label: "Appartement", value: "appartement" },
  { label: "Bachelor", value: "bachelor" },
  { label: "Condo", value: "condo" },
  { label: "Land", value: "land" },
];

export const PropertyZoningOptions = [
  { label: "Residential", value: "residential" },
  { label: "Industrial", value: "industrial" },
  { label: "Commercial", value: "commercial" },
  { label: "Agricultural", value: "agricultural" },
  { label: "Mixed-Use", value: "mixed" },
];

export const BlockchainOptions: RadioBoxOption[] = [
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
];

export const WrapperOptions: RadioBoxOption[] = [
  {
    title: "Nominee Trust",
    tag: "Recomanded",
    subtitle: `Recommended for most situations. This type of property wrapper is ideal for those who desire an additional layer of anonymity, while offering legal protections and benefits similar to LLCs.
      \n\n
      Estimated cost to deploy contract: $499.97`,
    value: "trust",
  },
  {
    title: "Limited Liability Company",
    tag: "Multi-Layered",
    subtitle: `Formed in combination with a Nominee Trust. This type of property wrapper is generally more expensive to deploy but perfect for revenue-generating properties with multiple owners.
      \n\n
      Estimated cost to deploy contract: $1499.97
    `,
    value: "llc",
  },
];
