/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /ts/generate_is_methods.ts
 * @create:      2025-02-21 15:42:14.831
 * @modify:      2025-03-25 14:47:04.833
 * @times:       22
 * @lines:       123
 * @copyright:   Copyright © 2025 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import fs from "node:fs";
import { EOL } from "node:os";
import path from "node:path";
import ts from "typescript";

interface InterfaceInfo {
    name: string;
    properties: { name: string; type: string }[];
}
  
function parseInterfaces(filePath: string): InterfaceInfo[] {
    const program = ts.createProgram([filePath], {});
    const sourceFile = program.getSourceFile(filePath);
  
    if (!sourceFile) {
        throw new Error(`Could not find source file: ${filePath}`);
    }
  
    const checker = program.getTypeChecker();
    const interfaces: InterfaceInfo[] = [];
  
    ts.forEachChild(sourceFile, (node) => {
        if (ts.isInterfaceDeclaration(node)) {
            const interfaceName = node.name.text;
            const properties: { name: string; type: string }[] = [];
  
            node.members.forEach((member) => {
                if (ts.isPropertySignature(member) && member.type) {
                    const propertyName = member.name.getText(sourceFile);
                    const propertyType = checker.typeToString(
                        checker.getTypeAtLocation(member.type),
                    );
                    properties.push({ name: propertyName, type: propertyType });
                }
            });
  
            interfaces.push({ name: interfaceName, properties });
        }
    });
  
    return interfaces;
}
  
function generateTypeCheck(type: string, propertyName: string, interfaceNames: Set<string>): string {
    if (type === "string" || type === "number" || type === "boolean") {
        return `typeof obj.${propertyName} === "${type}"`;
    } else if (interfaceNames.has(type)) {
        return `(obj.${propertyName} === undefined || is${type}(obj.${propertyName}))`;
    } else {
        return `"${propertyName}" in obj`;
    }
}
  
function generateIsMethod(interfaceInfo: InterfaceInfo, interfaceNames: Set<string>): string {
    const { name, properties } = interfaceInfo;
    const checks = properties.map(({ name, type }) => {
        const typeCheck = type.includes(" | undefined")
            ? `(typeof obj.${name} === "undefined" || ${generateTypeCheck(type.replace(" | undefined", ""), name, interfaceNames)})`
            : generateTypeCheck(type, name, interfaceNames);
        return `  ${typeCheck}`;
    });
  
    return `
export function is${name}(obj: any): obj is ${name} {
  return typeof obj === "object" &&
    obj !== null &&
${checks.join(" &&\n")};
}
  `;
}

/**
 * Calculate the relative import path from output file to input file.
 * @param inputPath The absolute path to the input file.
 * @param outputPath The absolute path to the output file.
 * @returns The relative import path.
 */
function calculateImportPath(inputPath: string, outputPath: string): string {
    const outputDir = path.dirname(outputPath);
    const relativePath = path.relative(outputDir, inputPath);
  
    // Normalize the relative path to be used in an import statement
    const importPath = relativePath.replace(/\\/g, "/"); // Replace backslashes with forward slashes (for Windows compatibility)
    const importPathWithoutExtension = importPath.replace(/\.[^/.]+$/, ""); // Remove file extension
  
    if (!importPathWithoutExtension.startsWith(".")) {
        return `./${importPathWithoutExtension}`;
    }
  
    return importPathWithoutExtension;
}
  
function generateIsMethods(filePath: string, outputFilePath: string) {
    const interfaces = parseInterfaces(filePath).filter(i => i.properties.length > 0);
    const interfaceNames = new Set(interfaces.map(i => i.name));
    const isMethods = interfaces.map(interfaceInfo => generateIsMethod(interfaceInfo, interfaceNames)).join("\n");
    const importPath = calculateImportPath(filePath, outputFilePath);
    const importStatement = `import { ${interfaces.map(i => i.name).join(", ")} } from "${importPath}.js";\n`;
  
    
    fs.writeFileSync(outputFilePath, importStatement + isMethods, "utf8");
    console.log(`Generated is methods in ${outputFilePath}`);
}
  
// Example usage
const filePath = "C:/Users/Kaven/nguowk/kaven-workbench/src/share/protobuf/message/message.ts";
const outputFilePath = "C:/Users/Kaven/nguowk/kaven-workbench/src/share/protobuf/message.is.generated.ts";
generateIsMethods(filePath, outputFilePath);
