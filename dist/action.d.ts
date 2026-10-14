import { CustomActionsBase } from "@wxn0brp/db-core/base/custom";
export declare class DbStorageGed extends CustomActionsBase {
    file: string;
    private cache;
    private cacheValid;
    constructor(file: string);
    private loadCache;
    private saveCache;
    read(collection: string): Promise<Record<string, any>[]>;
    write(collection: string, data: Record<string, any>[]): Promise<void>;
    getCollections(): Promise<string[]>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
}
