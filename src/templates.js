const fs = require("fs-extra");
const path = require("path");

// recursively find all files in a directory
// returns an array of files
function findTemplateFiles(dir) {
  return fs
    .readdirSync(dir)
    .map((file) => {
      const filePath = `${dir}/${file}`;
      if (fs.statSync(filePath).isDirectory()) {
        return findFiles(filePath);
      } else {
        return filePath;
      }
    })
    .filter((file) => file !== undefined);
}

// flatten a nested array
function flattenTemplateFilesArray(arr) {
  return arr.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flattenTemplateFilesArray(b) : b),
    []
  );
}
// use nunjucks renderString to fill in contents of an array of files

function renderTemplates(exercise) {
  for (const file of exercise.files) {
    const filePath = `${file}`;
    const template = fs.readFileSync(filePath, "utf8");
    const fileContent = nunjucks.renderString(template);
    const newPath = path
      .parse(file)
      .dir.replace(
        `${exercise.tempPath.path}/node_modules/${packageJSON.name}/templates`,
        `${process.cwd()}`
      );
    fs.ensureDirSync(newPath);
    fs.writeFileSync(newPath, fileContent);
  }
}

module.exports = {
  findTemplateFiles,
  flattenTemplateFilesArray,
  renderTemplates,
};
