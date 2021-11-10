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
    files.forEach(function(file, index) {
      let filePath = path.join(pathStyles, file.name);
      if (file.isFile() && file.name.split('.')[1] === 'css') {
        fs.readFile(filePath, 'utf8', function (error, data) {
          if(error) {
            console.log(error);
          } else if (index === 0) {
            fs.writeFile(path.join(pathCopy, 'style.css'), data, function (error) {
              if(error)
                console.log(error);
            });
          }  else {
            fs.appendFile(path.join(pathCopy, 'style.css'), data, function(error) {
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
  fs.readdir(dir, {withFileTypes: true}, function (error, files) {
    if (error) throw error;
    files.forEach(function(file) {
      if (!file.isFile()) {
        fs.stat(path.join(exit, file.name), function(error) {
          if (error) {
            fs.mkdir(path.join(exit, file.name), function(error) {
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
        fs.copyFile(`${dir}\\${file.name}`, `${exit}\\${file.name}`, function(error){
          if (error) throw error;
        });
      }
    });
  });
}
fs.stat (pathCopy, function (error) {
  if (error) {
    fs.mkdir(pathCopy, function (error) {
      if (error) {
        return console.erroror(error);
      }
      });
    createTemplate();
  } else {  fs.readdir(pathCopy, function (error)  {
    if (error)
      console.log(error);
    else {

      createTemplate();
    }
  });
  }
});

fs.stat (pathAssetsCopy, function (error) {
  if (error) {
    fs.mkdir(pathAssetsCopy, function(error) {
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
  fs.copyFile(`${__dirname}\\template.html`, `${pathCopy}\\index.html`, function (error) {
    if (error) throw error;
    fs.readFile(`${pathCopy}\\index.html`, 'utf8', function(error, data) {
      if(error) throw error;
      fs.readdir(folderPath, {withFileTypes: true}, function (error, files) {
        if (error) throw error;

        files.forEach(function(file) {
          fs.readFile(`${folderPath}\\${file.name}`, 'utf8', function(error, dataFile) {
            if(error) throw error;
            let tagName = `{{${file.name.split('.')[0]}}}`;
            data = data.replace(tagName, dataFile);
            fs.writeFile(`${pathCopy}\\index.html`, data, function (error) {
              if(error)
                console.log(error);});
          });
          
        });
        
      });
      
    });
    
  });
  
}
