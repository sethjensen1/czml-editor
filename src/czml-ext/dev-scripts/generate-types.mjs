import * as json2ts from "json-schema-to-typescript";
import { readdirSync, readFile, readFileSync, writeFileSync } from 'fs';
import path from "path";


function getFilesSync(dir, accept) {

    let files = [];
    const items = readdirSync(dir, { withFileTypes: true });

    for (const item of items) {

        const fullPath = path.join(dir, item.name);

        if (accept && !accept(fullPath)) continue;

        if (item.isDirectory()) {
            files = files.concat(getFilesSync(fullPath));
        } else {
            files.push(fullPath);
        }
    }

    return files;
}

async function generateValueTypes() {
    const srcSchemaPath = 'src/extra/czml-writer/Schema/Values';
    const destFilePath = 'src/export-czml/generated/values';

    const files = getFilesSync(srcSchemaPath);

    for(const file of files) {
        
        const filename = path.parse(file).name;

        try {
            console.log('reading...', file);
            const data = readFileSync(file, 'utf8');
            const schema = JSON.parse(data);

            const content = await json2ts.compile(schema, filename, {
                cwd: srcSchemaPath,
                bannerComment: '',
                enableConstEnums: true
            });
            
            const out = path.join(destFilePath, `${toKebabCase(filename)}.d.ts`);
            
            writeFileSync(out, content, 'utf8');
            console.log('written to', out);
        }
        catch (e) {
            console.log('failed to parse', file);
        }
    }


}

function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .toLowerCase();
}

generateValueTypes();




