import assert from "node:assert";
import { describe, it } from "node:test";
import { extractDefinitions } from "../reflection/extract-definitions.js";

describe('extract interfaces', () => {
    it('should extract interface', () => {
        const modelsPath = ['./src/tests/assets/db5/models/user.ts'];
        const result = extractDefinitions(modelsPath);

        assert.match(result[0], /class User/);
    });

    it('should not include unmapped columns created_at and updated_at', () => {
        const modelsPath = ['./src/tests/assets/db5/models/user.ts'];
        const result = extractDefinitions(modelsPath);

        assert.doesNotMatch(result[0], /created_at/);
        assert.doesNotMatch(result[0], /updated_at/);
    });

    it('should not add NotNull decorator to not nullable properties', () => {
        const modelsPath = ['./src/tests/assets/db5/models/post.ts'];
        const result = extractDefinitions(modelsPath);

        assert.doesNotMatch(result[0], /\(\)\n*\s*updated_at/);
    });
});
