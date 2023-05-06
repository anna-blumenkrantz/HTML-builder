/* eslint-disable no-undef */
const path = require('path');
const fs = require('fs');
//collect source files
const srcDir = path.join(__dirname, 'files');

//initiate copy files
const destDir = path.join(__dirname, 'files-copy');
try {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  }
} catch (err) {
  console.error(err);
}

fs.readdir(srcDir, (error, sourceFiles) => {
  if (error) {
      console.log(error);
    }
   else {
     //read and copy content from source to destination
     sourceFiles.forEach(file => {
         const srcFile = path.join(srcDir, file);
         const destFile = path.join(destDir, file);
         const readStream = fs.createReadStream(srcFile);
         const writeStream = fs.createWriteStream(destFile);
         readStream.pipe(writeStream);
     });
     console.log(sourceFiles.length + ' files copied! All done!');
   }
});