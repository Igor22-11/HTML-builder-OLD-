let fs = require('fs');
let path = require('path');
let stream = fs.createReadStream(path.join(__dirname, 'text.txt'));

let data = '';
stream.on('data', partData => data += partData);
stream.on('end', () => process.stdout.write(data));