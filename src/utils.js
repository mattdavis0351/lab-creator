const fs = require("fs-extra");
const tmp = require("tmp-promise");
const chalk = require("chalk");
const { spawnSync } = require("child_process");
const packageJSON = require("../package.json");

const { findTemplateFiles, flattenTemplateFilesArray } = require("./templates");

async function createExercise(exerciseTitle, options) {
  const exercise = {
    ...options,
    title: exerciseTitle,
    files: [],
    tests: [],
    tmp: tmp.dirSync({ unsafeCleanup: true }),
  };
  exercise.projectPath =
    exercise.projectPath !== "Current directory"
      ? exercise.projectPath
      : process.cwd();
  await npmInstall(exercise.tmp.name);

  console.log(chalk.green(`Searching for templates...`));

  exercise.files = flattenTemplateFilesArray(
    findTemplateFiles(
      `${exercise.tmp.name}/node_modules/${packageJSON.name}/templates`
    )
  );
  console.log(chalk.green(`Searching for templates...Done`));

  return exercise;
}

async function makeRequiredDirs(exercise) {
  console.log(chalk.green("Creating required directories..."));
  const requiredDirs = [
    exercise.projectPath,
    `${exercise.projectPath}/.github/workflows`,
    `${exercise.projectPath}/.github/actions/${exercise.actionName}`,
  ];
  for (const dir of requiredDirs) {
    await fs.ensureDir(dir);
  }
  console.log(chalk.green("Creating required directories...Done"));
}

// copy files from one location to another
async function npmInstall(path) {
  // spawn npm and install into temp dir
  console.log(chalk.green("Installing dependencies..."));
  spawnSync("npm", ["install", "--prefix", path, `${packageJSON.name}`]);
  console.log(chalk.green("Installing dependencies...Done"));
}

module.exports = { createExercise, makeRequiredDirs };
