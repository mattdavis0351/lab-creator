const commander = require("commander");
const chalk = require("chalk");
const packageJSON = require("../package.json");

const { getLatestLookingGlassVersion } = require("./checkForUpdates");
const { renderTemplates } = require("./templates");
const { bootstrapRepository } = require("./githubRepository");
const { createExercise, makeRequiredDirs } = require("./utils");

async function init() {
  const program = new commander.Command("ghexmgr");
  program.version(packageJSON.version);
  program
    .command("new-exercise")
    .description("Create a new exercise")
    .arguments("<exercise-title>")
    .usage(
      `${chalk.green("<exercise-title>")} ${chalk.blueBright("[options]")}`
    )
    .option(
      "-v, --lg-version <looking-glass-version>",
      "Looking Glass version you wish to use in the grading.yml exercise file",
      await getLatestLookingGlassVersion()
    )
    .option(
      "-a, --action-name <local-action-name>",
      "User defined name for the local action of the exercise",
      "local-action"
    )
    .option(
      "-o, --github-owner <github-repository-owner>",
      "Username or organization that has ownership of the desired exercise repository"
    )
    .option(
      "-p, --project-path <project-path>",
      "Path where the exercise will be created",
      "Current directory"
    )
    .option(
      "-r, --github-repository <github-repository-name>",
      "Name of the exercise repository"
    )
    .action(async (exerciseTitle, options) => {
      console.log(options);
      const exercise = await createExercise(exerciseTitle, options);
      await makeRequiredDirs(exercise);

      renderTemplates(exercise);

      if (exercise.githubOwner && exercise.githubRepository) {
        await bootstrapRepository(exercise);
      } else if (exercise.githubOwner || exercise.githubRepository) {
        console.log(
          chalk.bold.red(
            `Skipping Git initialization and configuration!\nYou must provide both --github-owner and --github-repository.\nYou can still configure your project directory manually.`
          )
        );
      }
      console.log();
      console.log(
        chalk.green(`Exercise ${exercise.title} is ready for you 😄`)
      );
      exercise.tmp.removeCallback();
    });
  program.parse(process.argv);
}

module.exports = { init, createExercise };
