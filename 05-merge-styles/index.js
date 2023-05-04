/* eslint-disable no-undef */
const path = require('path');
const fs = require('fs');
//collect source files
const destDir = path.join(__dirname, 'project-dist');
const destFile = path.join(destDir, 'bundle.css');

const stylesDir = path.join(__dirname, 'styles');
const stylesFiles = fs.readdirSync(stylesDir);

const cssFiles = stylesFiles.filter(file => path.extname(file) === '.css');
console.log('cssFiles**'+cssFiles);

//merge files to a bundle
cssFiles.forEach(file => {
    const srcFile = path.join(stylesDir, file);
    const readStream = fs.createReadStream(srcFile);
    console.log('readStream '+readStream);

    readStream.on('data', data => {
    fs.appendFileSync(destFile,'\n/* Start of ' + file + ' */\n');
    fs.appendFileSync(destFile, data);
    });
    readStream.on('end', () => {
    fs.appendFileSync(destFile,'\n/* End of ' + file + ' */\n');
    fs.appendFileSync(destFile, '\n'); // Append line break
    })
});