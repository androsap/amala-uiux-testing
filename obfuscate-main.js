const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const jsPath = path.join(__dirname, 'build/static/js');

const files = fs.readdirSync(jsPath);

const targetFiles = files.filter(
    file =>
        file.startsWith('main.') &&
        file.endsWith('.js') &&
        !file.endsWith('.LICENSE.txt')
);

if (!targetFiles.length) {
    console.error('Main chunk tidak ditemukan');
    process.exit(1);
}

targetFiles.forEach(file => {
    const fullPath = path.join(jsPath, file);

    console.log(`Obfuscating ${file}...`);

    const code = fs.readFileSync(fullPath, 'utf8');

    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
    
        // Tetap ringan
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        selfDefending: false,
    
        identifierNamesGenerator: 'hexadecimal',
    
        // Fokus sembunyikan string
        stringArray: true,
        stringArrayThreshold: 1,
    
        rotateStringArray: true,
        shuffleStringArray: true,
    
        stringArrayEncoding: ['base64'],
    
        splitStrings: true,
        splitStringsChunkLength: 5,
    
        unicodeEscapeSequence: false
    });

    fs.writeFileSync(
        fullPath,
        obfuscated.getObfuscatedCode(),
        'utf8'
    );

    console.log(`✓ Done ${file}`);
});