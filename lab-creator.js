const chalk = require("chalk");
const commander = require("commander");

async function init() {
  console.log(chalk.yellow("it works"));
}

module.exports = { init };
