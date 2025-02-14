import { join } from "path";
import { Project } from "ts-morph";
import { createHash } from 'crypto';

export function getFilesHash(filesGlob: string[]) {
    const project = new Project({
    });

    project.addSourceFilesAtPaths(filesGlob);

    const sourceFiles = project.getSourceFiles();

    const content = [];

    for (let file of sourceFiles) {
        const classDeclarations = file.getClasses()

        for (let cls of classDeclarations) {
            cls.formatText({
                baseIndentSize: 0,
                indentSize: 0,
                convertTabsToSpaces: true,
                ensureNewLineAtEndOfFile: true,
                trimTrailingWhitespace: true,
                insertSpaceAfterConstructor: true,
                insertSpaceAfterCommaDelimiter: true,
            })

            const text = cls.getText();
            content.push(text);
        }
    }

    const hash = createHash('sha256');
    hash.update(content.join('\n'));
    return hash.digest('hex');
}
