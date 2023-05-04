/* eslint-disable no-undef */
const path = require('path');
const fs = require('fs');
//collect source files
const srcDir = path.join(__dirname, 'files');
const sourceFiles = fs.readdirSync(srcDir);

//initiate copy files
const destDir = path.join(__dirname, 'files-copy');
try {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  }
} catch (err) {
  console.error(err);
}
//read and copy content from source to destination
sourceFiles.forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    const readStream = fs.createReadStream(srcFile);
    console.log(file + '-- read');
    const writeStream = fs.createWriteStream(destFile);
    console.log(file + '-- written');
    readStream.pipe(writeStream);
});
