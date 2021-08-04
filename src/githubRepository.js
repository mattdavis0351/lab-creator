const { spawnSync } = require("child_process");
const fs = require("fs-extra");
const chalk = require("chalk");

async function bootstrapRepository(exercise) {
  const dir = fs.readdirSync(process.cwd());

  // check dir array for .git
  if (dir.indexOf(".git") !== -1) {
    console.log(
      chalk.bold.magenta(
        "Found an existing .git folder.\nSkipping git initialization and configuration.\nManual coniguration of git is still possible!"
      )
    );
  } else {
    console.log(chalk.green("Initializing git repository..."));
    gitCommand("init", exercise.projectPath);
    console.log(chalk.green("Initializing git repository... Done"));
    console.log(chalk.green("Adding git remote origin..."));
    gitCommand(
      "remote",
      "add",
      "origin",
      `https://github.com/${exercise.githubOwner}/${exercise.githubRepository}.git`
    );
    console.log(chalk.green("Adding git remote origin... Done"));
    // stage all files
    console.log(chalk.green("Staging all files..."));
    gitCommand("add", "-A");
    console.log(chalk.green("Staging all files... Done"));
    // commit all files
    console.log(chalk.green("Committing all files..."));
    gitCommand("commit", "-m", "Initial commit");
    console.log(chalk.green("Committing all files... Done"));
    // rename branch to main
    console.log(chalk.green("Renaming branch to main..."));
    gitCommand("branch", "-M", "main");
    console.log(chalk.green("Renaming branch to main... Done"));
    // set upstream
    console.log(chalk.green("Setting upstream..."));
    gitCommand("remote", "set-upstream", "origin", "main");
    console.log(chalk.green("Setting upstream... Done"));
  }
}

function gitCommand(...command) {
  const args = command;

  spawnSync("git", args);
}

module.exports = { bootstrapRepository };
