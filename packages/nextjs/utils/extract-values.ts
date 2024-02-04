export type ValueExtractor<T extends Readonly<{ value: string }[]>> = {
  [K in T[number]["value"]]: `${K}`;
}[T[number]["value"]];

export function indexOfLiteral<T extends Readonly<{ value: string }[]>>(
  object: T,
  value: ValueExtractor<T>,
) {
  return object.findIndex(type => type.value === value);
}
