export default interface CreateMigrationOptions {
    name?: string;
    dryRun?: boolean;
    empty?: boolean;
    doNotUpdateSchemaFile?: boolean; // for unit tests
}
