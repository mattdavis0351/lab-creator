const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const nunjucks = require("nunjucks");
const packageJSON = require("../package.json");

// recursively find all files in a directory
// returns an array of files
function findTemplateFiles(dir) {
  console.log(chalk.green(`Searching for templates...`));
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
  console.log(chalk.green("Rendering templates with user options..."));
  for (const file of exercise.files) {
    const filePath = `${file}`;
    console.log(chalk.blue(`current filepath ${filePath}`));
    const template = fs.readFileSync(filePath, "utf8");
    const fileContent = nunjucks.renderString(template);
    console.log(path.parse(file));
    const newPath = path
      .parse(file)
      .dir.replace(
        `${exercise.tempPath}/node_modules/${packageJSON.name}/templates`,
        `${process.cwd()}`
      );
    fs.ensureDirSync(newPath);
    console.log(chalk.red(`current newpath: ${newPath}`));
    // fs.writeFileSync(newPath, fileContent);
  }
}

module.exports = {
  findTemplateFiles,
  flattenTemplateFilesArray,
  renderTemplates,
};
