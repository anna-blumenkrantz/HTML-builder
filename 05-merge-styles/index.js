/* eslint-disable no-undef */
const path = require('path');
const fs = require('fs');
//collect source files
const destDir = path.join(__dirname, 'project-dist');
const destFile = path.join(destDir, 'bundle.css');
// create a writable stream and create a file
const destStream = fs.createWriteStream(destFile);
const stylesDir = path.join(__dirname, 'styles');

// collect source files
fs.readdir(stylesDir, (err, stylesFiles) => {
  if (err) {
    throw err;
  } else {
        const cssFiles = stylesFiles.filter(file => path.extname(file) === '.css');
        console.log('cssFiles**'+cssFiles);
        // merge files to a bundle
        cssFiles.forEach(file => {
            const srcFile = path.join(stylesDir, file);
            const readStream = fs.createReadStream(srcFile);
            readStream.on('data', data => {
                destStream.write(`/* Start of ${file} */\n`);
                destStream.write(data);
                destStream.write(`\n/* End of ${file} */\n\n`);
            });
            readStream.on('end', () => {
                console.log(`${file} added!`);
            });
        });
    }
});