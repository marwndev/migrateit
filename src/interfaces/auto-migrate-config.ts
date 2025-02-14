export interface LlmConfig {
    provider: string;
    model: string;
    baseURL?: string;
    apiKey?: string;
}

export interface MigrateItConfig {
    dbType: "postgres" | "mysql" | "sqlite" | "mssql";
    dbAdapter?: string;
    allowDestructive?: boolean;
    modelsPath: string[];
    migrationsPath: string;
    llm: LlmConfig;
    dbClientConfig?: any;
}
