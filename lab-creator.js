const chalk = require("chalk");
const commander = require("commander");

async function init() {
  // Create new commander.Command()
  // command new-lab
  // option --lab-name
  // lab-creator new-lab --lab-name bread
  const program = new commander.Command("lab-creator");
  // program metadata
  program.version("0.0.1");

  program
    .command("new-lab")
    .description("Create a new lab")
    .requiredOption("-l,--lab-name <lab-name>")
    .action((args) => {
      // use nunjucks to fill in templates that are going to be copied
      // put in separate function for readability
      console.log(`args: ${args.labName}`);
    });

  program.parse(process.argv);
}

module.exports = { init };
