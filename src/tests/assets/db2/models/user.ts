import { AutoIncrement, ColType, Default, PrimaryKey, Size, Table, Unique, UUID } from "../../../../decorators.js";

@Table('users')
export class User {
    @PrimaryKey()
    @AutoIncrement()
    id: number;

    @Size(100)
    name: string;

    @Unique()
    @Size(300)
    email: string;

    password: string;

    @ColType('DATETIME')
    created_at: Date;

    @Default(10)
    age: number;
}
