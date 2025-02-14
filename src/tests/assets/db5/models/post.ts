import { PrimaryKey, Size, Table, UUID } from "../../../../decorators.js";

@Table('app.posts')
export class Post {
    @PrimaryKey()
    @UUID()
    id: string;

    @Size(300)
    title: string;

    @Size(1000)
    content: string;

    created_at: Date;

    updated_at?: Date;
}
