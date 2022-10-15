export type PermNode =
    | undefined
    | Date
    | {
          [key: string]: PermNode;
      };

export type PermTree = {
    [key: string]: PermNode;
};

type Join<K, P> = K extends string | number
    ? P extends string | number
        ? `${K}${"" extends P ? "" : "."}${P}`
        : never
    : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]];

export type PermPath<Parent extends PermNode, Depth extends number = 5> = Prev[Depth] extends never
    ? unknown
    : Parent extends PermTree
    ? {
          [K in keyof Parent]-?: K extends string
              ? `${K}` | Join<K, PermPath<Parent[K], Prev[Depth]>>
              : never;
      }[keyof Parent]
    : unknown;

export type PermLeaf<Parent extends PermNode, Depth extends number = 5> = Prev[Depth] extends never
    ? unknown
    : Parent extends PermTree
    ? {
          [K in keyof Parent]-?: Parent[K] extends PermTree
              ? K extends string
                  ? Join<K, PermLeaf<Parent[K], Prev[Depth]>>
                  : never
              : K;
      }[keyof Parent]
    : unknown;
