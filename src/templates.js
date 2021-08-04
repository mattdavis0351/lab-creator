const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const nunjucks = require("nunjucks");
const packageJSON = require("../package.json");

// recursively find all files in a directory
// returns an array of files
function findTemplateFiles(dir) {
  return fs
    .readdirSync(dir)
    .map((file) => {
      const filePath = `${dir}/${file}`;
      if (fs.statSync(filePath).isDirectory()) {
        return findTemplateFiles(filePath);
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
    const template = fs.readFileSync(file, "utf8");
    const fileContent = nunjucks.renderString(template, exercise);
    console.log(file);
    const np = file.includes(".github/actions/local-action")
      ? path
          .parse(file)
          .dir.replace(
            `${exercise.tmp.name}/node_modules/${packageJSON.name}/templates/.github/actions/local-action`,
            `${process.cwd()}/.github/actions/${exercise.actionName}`
          )
      : path
          .parse(file)
          .dir.replace(
            `${exercise.tmp.name}/node_modules/${packageJSON.name}/templates`,
            `${process.cwd()}`
          );

    console.log(np);
    const newPath = path
      .parse(file)
      .dir.replace(
        `${exercise.tmp.name}/node_modules/${packageJSON.name}/templates`,
        `${process.cwd()}`
      );
    fs.ensureDirSync(np);
    fs.writeFileSync(`${np}/${path.parse(file).base}`, fileContent);
  }
  console.log(chalk.green("Rendering templates with user options...Done"));
}

module.exports = {
  findTemplateFiles,
  flattenTemplateFilesArray,
  renderTemplates,
};
