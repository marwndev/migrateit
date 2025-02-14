# Migrateit

A TypeScript library for automatically generating and executing database migrations. It uses LLMs (Large Language Models) to analyze your TypeScript classes and generate the appropriate migration scripts.

## Features

- Automatic migration generation from TypeScript classes
- Support for PostgreSQL and SQLite databases
- LLM-powered migration naming and generation
- Migration management (up/down)
- Support for decorators to define database schema
- Schema tracking and validation

## Installation

```bash
npm install migrateit
```

## Usage

### Initialize the Project

```bash
npx migrateit init
```

This will create a `migrateit.config.json` file in your project root with the following structure:

```json
{
    "dbType": "postgres",
    "modelsPath": ["./src/models/*.ts"],
    "migrationsPath": "./src/migrations/",
    "dbClientConfig": {
        "db": "postgres"
    },
    "llm": {
        "provider": "openai",
        "model": "gpt-4",
        "apiKey": "optional-your-api-key",
        "baseURL": "optional-base-url"
    }
}
```

### Define Your Models

Use decorators to define your database schema in TypeScript classes:

```typescript
import { AutoIncrement, NotNull, PrimaryKey, Size, Table, Unique } from "migrateit";

@Table('users')
export class User {
    @PrimaryKey()
    @AutoIncrement()
    id: number;

    ()
    @Size(100)
    name: string;

    @Unique()
    ()
    @Size(300)
    email: string;

    password: string;

    @NotMapped()
    created_at: Date;
}
```

Available decorators:
- `@Table(name)`: Specify the table name
- `@Column(name, type)` or `@Column(definition)`: Define column properties
- `@PrimaryKey()`: Mark as primary key
- `@AutoIncrement()`: Enable auto-incrementing
- `@Unique()`: Add unique constraint
- `@NotNull()`: Make field non-nullable
- `@Size(length)`: Specify field length
- `@Default(value)`: Set default value
- `@UUID()`: Use UUID type
- `@NotMapped()`: Exclude field from database
- `@ForeignKey(column)` or `@ForeignKey(options)`: Define foreign key relationship
  - `column`: Referenced column name
  - `on_delete`: Action on delete (e.g., 'CASCADE', 'SET NULL')
  - `name`: Custom constraint name
  - Additional options can be specified in the options object
- `@Index(name)` or `@Index(options)`: Create an index
  - `name`: Name of the index
  - Additional options can be specified in the options object
- `@ColType(type)`: Specify custom column type

Note that these decorators will not add any metadata to your classes. They are only used to help the LLM better understand your schema.
Properties without any decorators will be treated as nullable columns with an appropriate type inferred from the TypeScript type.

### Managing Migrations

#### Create a New Migration

```bash
npx migrateit create [-n migration_name [-d]] [-e]
```

Options:
- `-n, --name`: Specify migration name (optional, LLM will generate if omitted)
- `-d, --dry-run`: Preview migration without creating files
- `-e, --empty`: Create empty migration file

#### List Migrations

```bash
npx migrateit list [-p]
```

Options:
- `-p, --pending`: Show only pending migrations

#### Apply Migrations

```bash
npx migrateit up
```

Applies all pending migrations to the database.

#### Rollback Migration

```bash
npx migrateit down
```

Reverts the last applied migration.

### Database Support

Currently supported databases:
- PostgreSQL (using `pg` libray)
- SQLite (using Node's built-in SQLite support)

To add support for other databases:
- Create a class that inherits from `DatabaseAdapter` class.
- Create a file `migrateit.init.ts` at the root of your project.
- Register your adapter:

```typescript
import { registerAdapter } from 'migrateit';
registerAdapter('database-name', new CustomDatabaseAdapter());
```

## Development

### Running Tests

```bash
npm run test:dev
```

### Building

```bash
npm run build
```

## License

[License information]

MIT
