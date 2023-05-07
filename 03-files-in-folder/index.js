/* eslint-disable no-undef */
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'secret-folder');

//fetch only file without diretories
fs.readdir(filePath, { withFileTypes: true }, (error, files) => {
  if (error) {
      console.log(error);
    }
   else {
     var filesOnly = files.filter(files => files.isFile())
         .map(files => files.name);
   }

  // Getting information for a file
  filesOnly.forEach(file => {
    fs.stat(path.join(filePath, file), (error, fileStats) => {
    if (error) {
      console.log(error);
    }
    else {
      const fileSizeInBytes = fileStats.size;
      const fileSizeInKb = (fileSizeInBytes / 1024).toFixed(3);
      const { name, ext } = path.parse(file);
      console.log(`${name}-${ext.slice(1)}-${fileSizeInKb}kb`);
    }
    });
  });
});