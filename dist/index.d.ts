import { ValtheraClass } from "@wxn0brp/db-core";
import type { Collection } from "@wxn0brp/db-core/helpers/collection";
import type { GedEntry, GedTag } from "./types.js";
export type GedCollections<Tags extends string = GedTag> = {
    [K in Tags]: Collection<GedEntry>;
};
export declare function createGedValthera<Tags extends string = GedTag>(file: string): ValtheraClass & GedCollections<Tags>;
export * from "./action.js";
export * from "./types.js";
