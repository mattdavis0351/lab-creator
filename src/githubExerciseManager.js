const commander = require("commander");
const fs = require("fs-extra");
const tmp = require("tmp-promise");
const { spawn } = require("child_process");
const packageJSON = require("../package.json");
const getLatestLookingGlassVersion = require("./checkForUpdates");
const {
  findTemplateFiles,
  flattenTemplateFilesArray,
  renderTemplates,
} = require("./templates");
const chalk = require("chalk");

async function init() {
  const program = new commander.Command("ghexmgr");
  program.version(packageJSON.version);
  program
    .command("new-exercise")
    .description("Create a new exercise")
    .requiredOption("-n,--exercise-name <exercise-name>")
    .option(
      "-v,--lg-version <looking-glass-version>",
      "Looking Glass version you wish to use in the grading.yml exercise file",
      await getLatestLookingGlassVersion()
    )
    .option(
      "-a,--action-name <local-action-name>",
      "User defined name for the local action of the exercise",
      "local-action"
    )
    .action(async (options) => {
      const exerciseName = options.exerciseName;
      const lgVersion = options.lgVersion;
      const actionName = options.actionName;
      const exercise = await createExercise(
        exerciseName,
        lgVersion,
        actionName
      );
      console.log(`Exercise ${exercise.name} created`);
    });
  program.parse(process.argv);
}

async function createExercise(exerciseName, lgVersion, actionName) {
  const exercise = {
    name: exerciseName,
    lgVersion: lgVersion,
    actionName: actionName,
    files: [],
    tests: [],
  };

  exercise.tempPath = await tmp.dir({ unsafeCleanup: true });
  await makeRequiredDirs(exercise);

  await npmInstall(exercise);

  const templateFiles = findTemplateFiles(
    //   `${exercise.tempPath.path}/node_modules/${packageJSON.name}/templates`
    `${exercise.tempPath.path}`
  );

  console.log(templateFiles);
  // flatten the templateFiles array and stroe in exercise.files
  //   exercise.files = flattenTemplateFilesArray(templateFiles);

  //   renderTemplates(exercise);

  exercise.tempPath.cleanup();
  return exercise;
}

async function makeRequiredDirs(exercise) {
  const requiredDirs = [
    `${process.cwd()}/.github/workflows`,
    `${process.cwd()}/.github/actions/${exercise.actionName}`,
  ];
  for (const dir of requiredDirs) {
    await fs.ensureDir(dir);
  }
}

// copy files from one location to another
async function npmInstall(exercise) {
  // spawn npm and install into temp dir
  console.log(chalk.green("Installing dependencies"));
  const npm = spawn("npm", [
    "install",
    "--prefix",
    `${exercise.tempPath.path}`,
    `${packageJSON.name}`,
  ]);

  npm.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  npm.on("close", async (code) => {
    if (code !== 0) {
      console.log("npm install failed");
      process.exit(code);
    }
  });
}

// remove init once we have a working version
// init();

module.exports = { init };
