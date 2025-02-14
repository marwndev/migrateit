import { AutoIncrement, NotMapped, PrimaryKey, Size, Table, Unique } from "../../../../decorators.js";

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

    @NotMapped()
    created_at: Date;

    @NotMapped()
    updated_at?: Date;
}
