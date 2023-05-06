/* eslint-disable no-undef */
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '02file.txt');

const { stdin, stdout } = process;

// create a writable stream and create a file
const output = fs.createWriteStream(filePath);

stdout.write('What\'s your update?\n');

const exitHandler = () => {
  stdout.write('\nGoodbye!\n');
  process.exit();
};

// listen for 'data' events on stdin
stdin.on('data', data => {
  // check if user entered 'exit' and end the process
  if (data.toString().trim() === 'exit') {
    exitHandler();
  } else {
    // write the user input to the file and to stdout
    output.write(`${data.toString().trim()}\n`);
    stdout.write(`You entered: ${data}`);
  }
});

// check if user entered Ctrl+C' and end the process
process.on('SIGINT', exitHandler);