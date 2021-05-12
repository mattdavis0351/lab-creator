const chalk = require("chalk");
const commander = require("commander");
const nj = require("nunjucks");
const fs = require("fs-extra");

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
      // write the filled in template to the filesystem
      // create a new file and write it (so we don't change the template)
      //   write that to the cwd
      // put in separate function for readability
      //   console.log(`args: ${args.labName}`);
      fillInTemplates("./templates", args);
    });

  program.parse(process.argv);
}

function fillInTemplates(templateDir, options) {
  const tmp = {
    labName: options.labName,
  };

  const templateFiles = fs.readdirSync(`${templateDir}`);
  templateFiles.forEach((file) => {
    const contents = fs.readFileSync(`${templateDir}/${file}`).toString();
    const newContents = nj.renderString(contents, tmp);
    fs.writeFileSync(`./dummy/${file}`, newContents, "utf8");
  });
}

module.exports = { init };
