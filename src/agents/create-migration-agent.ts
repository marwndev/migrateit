import { BaseAgent } from "./base-agent.js";
import { Task } from "./task.js";
import { PromptContext } from "./context.js";
import { MigrateItConfig } from "../interfaces/auto-migrate-config.js";
import CreateMigrationOptions from "../interfaces/create-migration-options.js";

export interface CreateMigrationResult {
    migrationUp: string;
    migrationDown: string;
    finalTableSchema?: string;
    filename?: string;
    migrationUpFile?: string;
    migrationDownFile?: string;
}

export class CreateMigrationAgent extends BaseAgent<CreateMigrationResult> {
    constructor(config: MigrateItConfig, options: CreateMigrationOptions, classes: string, currentSchema: string) {
        super(config, `You are given a set of Typescript classes that represent the structure of a ${config.dbType} database and a set of SQL scripts that represent the current schema of the database.`);

        const migrationUpTask = new Task('migrationUp', 'Create a migration script that will transform the database from the current schema to the desired schema. If the schema is already in the desired state, the migration script should be empty, do not try to be creative.');

        const migrationDownTask = new Task('migrationDown', 'Create a migration script that will revert the changes made by the migration script.');

        const finalTableDefinitionTask = new Task('finalTableSchema', 'Output the full final tables schema as SQL CREATE TABLE statements.');

        const generateMigrationNameTask = new Task('filename', 'Generate a convenient file name for the migration script. The file name should be short and descriptive. Do not include timestamps in the file name. The file name should use dashes instead of spaces.');

        this.addTask(migrationUpTask);
        this.addTask(migrationDownTask);

        if (currentSchema) {
            this.addTask(finalTableDefinitionTask);
        }

        if (!options.name) {
            this.addTask(generateMigrationNameTask);
        }

        this.addContext(new PromptContext('classes', classes));
        this.addContext(new PromptContext('currentSchema', currentSchema));

        this.addFooterInstructions("Do not use transactions.");
        this.addFooterInstructions('Do not add or remove any constraints or indexes unless explicitly stated.')
        this.addFooterInstructions('Do not add any comments or explanations.');
        this.addFooterInstructions('Do not use markdown in your answer.');
    }

    async run(): Promise<CreateMigrationResult> {
        const answer = await this.getAnswer();

        const parts = answer.match(/<[^>]+>[^<]+<\/[^>]+>/g);

        if (!parts) {
            throw new Error('Invalid answer format');
        }

        // return an object that has the tag as key and the content as value
        const result = parts.reduce((acc, part) => {
            const tag = part.match(/<([^>]+)>/)[1];
            const content = part.match(/>([^<]+)</)[1];

            return {
                ...acc,
                [tag]: content
            }
        }, {} as CreateMigrationResult);

        if (!result.finalTableSchema) {
            result.finalTableSchema = result.migrationUp;
        }

        return result;
    }
}

