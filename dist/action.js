import { CustomFileCpu } from "@wxn0brp/db-core";
import { CustomActionsBase } from "@wxn0brp/db-core/base/custom";
import { readFile, writeFile, access } from "fs/promises";
import { parseGedcomToCollections } from "./gedcomParser.js";
import { serializeCollections } from "./gedcomSerializer.js";
export class DbStorageGed extends CustomActionsBase {
    file;
    cache = new Map();
    cacheValid = false;
    constructor(file) {
        super();
        this.file = file;
        this.fileCpu = new CustomFileCpu(this.read.bind(this), this.write.bind(this), true);
    }
    async loadCache() {
        if (this.cacheValid)
            return;
        try {
            await access(this.file);
            const content = await readFile(this.file, "utf-8");
            this.cache = parseGedcomToCollections(content);
        }
        catch {
            this.cache = new Map();
        }
        this.cacheValid = true;
    }
    async saveCache() {
        const content = serializeCollections(this.cache);
        await writeFile(this.file, content, "utf-8");
    }
    async read(collection) {
        await this.loadCache();
        return this.cache.get(collection) ?? [];
    }
    async write(collection, data) {
        await this.loadCache();
        this.cache.set(collection, data);
        await this.saveCache();
    }
    async getCollections() {
        await this.loadCache();
        return Array.from(this.cache.keys());
    }
    async ensureCollection(collection) {
        await this.loadCache();
        const existed = this.cache.has(collection);
        if (!existed) {
            this.cache.set(collection, []);
            await this.saveCache();
        }
        return !existed;
    }
    async issetCollection(collection) {
        await this.loadCache();
        return this.cache.has(collection);
    }
    async removeCollection(collection) {
        await this.loadCache();
        const existed = this.cache.has(collection);
        if (existed) {
            this.cache.delete(collection);
            await this.saveCache();
        }
        return existed;
    }
}
