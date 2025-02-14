import { AutoIncrement, PrimaryKey, Size, Table, UUID } from "../../../../decorators.js";

@Table('app.users')
export class User {
    @PrimaryKey()
    @AutoIncrement()
    id: number;

    @Size(100)
    name: string;

    password: string;

    created_at: Date;

    updated_at?: Date;
}

