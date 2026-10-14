import { forgeTypedValthera, ValtheraClass } from "@wxn0brp/db-core";
import { DbStorageGed } from "./action.js";
export function createGedValthera(file) {
    const adapter = new DbStorageGed(file);
    return forgeTypedValthera(new ValtheraClass({
        adapter,
    }));
}
export * from "./action.js";
export * from "./types.js";
