type Join<K extends string | number, P> = P extends string ? `${K}.${P}` : never

type Paths<T, Depth extends unknown[]> = Depth['length'] extends 5
  ? never
  : T extends Date | ((...args: any[]) => any)
    ? never
    : T extends readonly (infer Item)[]
      ?
          | `${number}`
          | Join<number, Paths<NonNullable<Item>, [...Depth, unknown]>>
      : T extends object
        ? {
            [K in Extract<keyof T, string | number>]:
              | `${K}`
              | Join<K, Paths<NonNullable<T[K]>, [...Depth, unknown]>>
          }[Extract<keyof T, string | number>]
        : never

/** Dot-separated model paths, limited to five levels to bound compiler cost. */
export type FieldPath<T> = string extends keyof T ? string : Paths<T, []>
