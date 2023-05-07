/* eslint-disable no-undef */
const path = require('path');
const fs = require('fs');
const FSP = require('fs').promises;

const destDir = path.join(__dirname, 'project-dist');
buildHtml();
/**
 * read source
 * if assets - copy directory
 * if styles - merge into ctyle.css
 * if template html - generate index.html
 */
async function buildHtml() {
  handleDir(destDir);
  const files = await readFiles(__dirname);
  files.forEach(file => {
    if (file.isDirectory()) {
      if (file.name === 'assets') {
        const assetsDir = path.join(destDir, file.name);
        handleDir(assetsDir);
        copyDir(path.join(__dirname, file.name), assetsDir);
        console.log('Created '+assetsDir);
      }
      if (file.name === 'styles') {
        const srcDir = path.join(__dirname, file.name);
        const stylesFile = path.join(destDir, 'style.css');
        mergeFiles(srcDir, stylesFile);
        console.log('Merged '+ stylesFile);
      }
    } else {
      if (path.extname(file.name) === '.html') {
        const srcFile = path.join(__dirname, file.name);
        const destFile = path.join(destDir, 'index.html');
        copyFile(srcFile, destFile);
        handleHtml(path.join(__dirname, 'components'), destFile);
        console.log('Updated '+ destFile);
      }
    }
  });
}

function exists(path) {
  try {
    fs.access(path);
    return true
  } catch {
    return false
  }
}
async function copyDir(srcDir, destDir) {
  const sourceFiles = await readFiles(srcDir);
  sourceFiles.forEach(file => {
    var srcFile = path.join(srcDir, file.name);
    var destFile = path.join(destDir, file.name);
    if (file.isDirectory()) {
      handleDir(destFile);
      copyDir(srcFile, destFile);
    } else {
      copyFile(srcFile, destFile);
    }
  })
}
async function mergeFiles(stylesDir, destFile) {
  const destStream = fs.createWriteStream(destFile);
  // collect source files
  const stylesFiles = await readFiles(stylesDir);
  const cssFiles = stylesFiles.filter(file => file.isFile() && path.extname(file.name) === '.css');
  // merge files to a bundle
  cssFiles.forEach(file => {
    const srcFile = path.join(stylesDir, file.name);
    const readStream = fs.createReadStream(srcFile);
    readStream.on('data', data => {
      destStream.write(`/* Start of ${file.name} */\n`);
      destStream.write(data);
      destStream.write(`\n/* End of ${file.name} */\n\n`);
    });
  });
}
async function readFiles(srcDir) {
  try {
    const files = await FSP.readdir(srcDir, {
      withFileTypes: true
    });
    return files;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function handleDir(destDir) {
  if (!exists(destDir)) {
    fs.mkdir(destDir, callback);
  }
}

function copyFile(srcFile, destFile) {
  fs.copyFile(srcFile, destFile, callback);
}

function callback(error) {
  if (error) {
      console.error('callback error'+error);
  }
}
async function readHtmlFiles(dirPath) {
    //collect html files to object
  const files = await readFiles(dirPath);
  const htmlFiles = files.filter(file => path.extname(file.name) === '.html');
  const htmlData = {};
  await Promise.all(htmlFiles.map(async (file) => {
    const nameWithoutExt = path.parse(file.name).name;
    const srcFile = path.join(dirPath, file.name);
    const data = await readFileStream(srcFile);
    htmlData[nameWithoutExt] = data;
  }));
  return htmlData;
}

async function handleHtml(components, destFile) {
  const htmlData = await readHtmlFiles(components);
  // Read copied html file
  let template = await readFileStream(destFile);
  const writeStream = fs.createWriteStream(destFile);
  // Replace markers with HTML data
  const regexp = /\{\{([^\}]+)\}\}/g;
  const matches = template.match(regexp);
  if (matches) {
    matches.forEach((match) => {
      const key = match.replace(/[^a-zA-Z0-9]/g, '');
      template = template.replace(match, htmlData[key]);
    });
    writeStream.write(template);
  }
}

function readFileStream(filepath) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filepath, {
      encoding: 'utf8'
    });
    let data = '';
    readStream.on('data', (chunk) => {
      data += chunk;
    });
    readStream.on('end', () => {
      resolve(data);
    });
    readStream.on('error', (error) => {
      reject(error);
    });
  });
}