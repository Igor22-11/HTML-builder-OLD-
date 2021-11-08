let path = require('path');
let fs = require('fs');
let sourceDir = path.join(__dirname, '/files');
fs.readdir(sourceDir, { withFileTypes: true }, (error, files) => {
  if (error) {
    console.erroror(error.message);
  }
  if (files.length) {
    let onlyFiles = files.filter(file => file.isFile());
    let copyDir = path.join(__dirname, '/files-copy');
    fs.mkdir(copyDir, { recursive: true }, (error) => {
      if (error) {
        console.erroror(error);
      }
    });
    onlyFiles.forEach(file => {
      let pathFile = path.join(sourceDir, file.name);
      let pathCopy = path.join(copyDir, file.name);
      fs.copyFile(pathFile, pathCopy, (error) => {
        if (error) {console.log(error);
        }
      });
    });
  } else {
    console.log('Directory is empty');
  }
});