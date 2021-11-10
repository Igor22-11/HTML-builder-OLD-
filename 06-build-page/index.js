let path = require('path');
let fs = require('fs');
let pathStyles = path.join(__dirname, 'styles');
let pathCopy = path.join(__dirname, 'project-dist');
let pathAssetsCopy = path.join(pathCopy, 'assets');
let folderPath = path.join(__dirname, 'components');
let pathAssets = path.join(__dirname, 'assets');

fs.readdir(pathStyles, {withFileTypes: true}, async (error, files) => {
  if (error) {
    console.log(error);
  }
  else {
    files.forEach((file, index) => {
      let filePath = path.join(pathStyles, file.name);
      if (file.isFile() && file.name.split('.')[1] === 'css') {
        fs.readFile(filePath, 'utf8', (error, data) => {
          if(error) {
            console.log(error);
          } else if (index === 0) {
            fs.writeFile(path.join(pathCopy, 'style.css'), data, error => {
              if(error)
                console.log(error);
            });
          }  else {
            fs.appendFile(path.join(pathCopy, 'style.css'), data, error => {
              if(error)
                console.log(error);
            });
          }
        });
      }
    });
  }
});

function recurceCopy(dir, exit) {
  fs.readdir(dir, {withFileTypes: true}, (error, files) => {
    if (error) throw error;
    files.forEach(file => {
      if (!file.isFile()) {
        fs.stat(path.join(exit, file.name), (error) => {
          if (error) {
            fs.mkdir(path.join(exit, file.name), (error) => {
              if (error) {
                return console.erroror(error);
              }
                          });
            recurceCopy(`${dir}\\${file.name}`, path.join(exit, file.name));
          } else {
            recurceCopy(`${dir}\\${file.name}`, path.join(exit, file.name));
          }
        });
      } else {
        fs.copyFile(`${dir}\\${file.name}`, `${exit}\\${file.name}`, error =>{
          if (error) throw error;
        });
      }
    });
  });
}
fs.stat (pathCopy, (error) => {
  if (error) {
    fs.mkdir(pathCopy, (error) => {
      if (error) {
        return console.erroror(error);
      }
      });
    createTemplate();
  } else {  fs.readdir(pathCopy, (error) => {
    if (error)
      console.log(error);
    else {

      createTemplate();
    }
  });
  }
});

fs.stat (pathAssetsCopy, (error) => {
  if (error) {
    fs.mkdir(pathAssetsCopy, (error) => {
      if (error) {
        return console.erroror(error);
      }

    });
    recurceCopy(pathAssets, pathAssetsCopy);
  } else {
    recurceCopy(pathAssets, pathAssetsCopy);
  }
});

function createTemplate() {
  fs.copyFile(`${__dirname}\\template.html`, `${pathCopy}\\index.html`, error =>{
    if (error) throw error;
    fs.readFile(`${pathCopy}\\index.html`, 'utf8', (error, data) => {
      if(error) throw error;
      fs.readdir(folderPath, {withFileTypes: true}, (error, files) => {
        if (error) throw error;

        files.forEach(file => {
          fs.readFile(`${folderPath}\\${file.name}`, 'utf8', (error, dataFile) => {
            if(error) throw error;
            let tagName = `{{${file.name.split('.')[0]}}}`;
            data = data.replace(tagName, dataFile);
            fs.writeFile(`${pathCopy}\\index.html`, data, error => {
              if(error)
                console.log(error);});
          });
        });
      });
    });
  });
}
