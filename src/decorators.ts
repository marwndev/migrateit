export interface ColumnDefinition {
    name?: string;
    type?: string;
    not_null?: boolean;
    primary_key?: boolean;
    auto_increment?: boolean;
    default?: any;
    unique?: boolean;
    size?: number;
    [key: string]: any;
}

export interface ForeignKeyDefinition {
    column: string;
    on_delete?: string;
    name?: string;
    [key: string]: any;
}

export interface IndexDefinition {
    name: string;
    [key: string]: any;
}

export declare function Table(name: string): Function;
export declare function Column(name: string, type: string): Function;
export declare function Column(definition: ColumnDefinition): Function;
export declare function Unique(): Function;
export declare function PrimaryKey(): Function;
export declare function AutoIncrement(): Function;
export declare function Default(value: any): Function;
export declare function Size(value: number): Function;
export declare function UUID(): Function;
export declare function ForeignKey(column: string): Function;
export declare function ForeignKey(definition: ForeignKeyDefinition): Function;
export declare function NotMapped(): Function;
export declare function ColType(type: string): Function;
export declare function Index(name: string): Function;
export declare function Index(definition: IndexDefinition): Function;
export declare function NotNull(): Function;
