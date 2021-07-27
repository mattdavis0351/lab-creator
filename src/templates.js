const fs = require('fs-extra')

// recursively find all files in a directory
// returns an array of files
function findFiles(dir) {
    return fs.readdirSync(dir)
      .map((file) => {
        const filePath = `${dir}/${file}`;
        if (fs.statSync(filePath).isDirectory()) {
          return findFiles(filePath);
        } else  {
          return filePath;
        }
      })
      .filter((file) => file !== undefined);
  }