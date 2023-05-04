/* eslint-disable no-undef */
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'secret-folder');
const files = fs.readdirSync(filePath);

files.forEach(file => {
    const fileStats = fs.statSync(path.join(filePath, file));
    const fileSizeInBytes = fileStats.size;
    const fileSizeInKb = (fileSizeInBytes / 1024);
    const { name, ext } = path.parse(file);
    console.log(`${name}-${ext.slice(1)}-${fileSizeInKb}kb`);
  });

