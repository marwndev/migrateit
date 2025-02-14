import { resolve } from "path";
import { Decorator, Project } from "ts-morph";
import { cwd } from "process";

export const extractDefinitions = (modelsPath: string[]): string[] => {
    const tsConfigPath = resolve(cwd(), "tsconfig.json");

    const project = new Project({
        tsConfigFilePath: tsConfigPath,
        // skipAddingFilesFromTsConfig: true,
    });

    const sourceFiles = project.getSourceFiles(modelsPath);

    const classDefinitions: string[] = [];
    for (let sourceFile of sourceFiles) {
        const classDeclarations = sourceFile.getClasses()

        for (let classDeclaration of classDeclarations) {
            classDeclaration.setIsExported(false);

            const properties = classDeclaration.getProperties();
            for (let property of properties) {
                const decorators = property.getDecorators();
                const notMappedDecorator = decorators.find(decorator => decorator.getName() === 'NotMapped');
                if (notMappedDecorator) {
                    property.remove();
                    continue;
                }

                // check if property is nullable
                if (!property.hasQuestionToken()) {
                    property.addDecorator({
                        name: 'NotNull',
                        arguments: []
                    });
                }
            }

            classDefinitions.push(classDeclaration.getText(true));
        }
    }

    return classDefinitions;
};
