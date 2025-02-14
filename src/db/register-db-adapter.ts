import { MigrateItConfig } from "interfaces/auto-migrate-config.js";
import { DatabaseAdapter } from "./db-adapter.js";

export const adapters: Map<string, DatabaseAdapter> = new Map();

export function registerAdapter(name: string, adapter: DatabaseAdapter) {
    if (adapters.has(name)) {
        throw new Error(`Adapter already registered: ${name}`);
    }

    adapters.set(name, adapter);
}

export async function getDBAdapter(config: MigrateItConfig): Promise<DatabaseAdapter> {
    const name = config.dbAdapter || config.dbType;
    const adapter = adapters.get(name);

    if (!adapter) {
        throw new Error(`Adapter not found: ${name}. Make sure you have registered the adapter.`);
    }

    await adapter.init();
    await adapter.createMigrationsTable();

    return adapter;
}

export function removeAdapter(name: string) {
    adapters.delete(name);
}
