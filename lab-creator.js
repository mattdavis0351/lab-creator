const chalk = require("chalk");
const commander = require("commander");
const nj = require("nunjucks");
const fs = require("fs-extra");
const tmp = require("tmp-promise");
const packageJSON = require("./package.json");
const { spawn } = require("child_process");

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
    .action(async (args) => {
      const tempPath = await makeTempDir();
      await makeWorkflowDir();
      await copyTemplateFiles(tempPath, args);
    });

  program.parse(process.argv);
}

function fillInTemplates(templateDir, options) {
  const templateOptions = {
    labName: options.labName,
  };

  const templateFiles = fs.readdirSync(`${templateDir}`);
  templateFiles.forEach((file) => {
    const contents = fs.readFileSync(`${templateDir}/${file}`).toString();
    const newContents = nj.renderString(contents, templateOptions);
    if (file === "grading.yml") {
      fs.writeFileSync(
        `${process.cwd()}/.github/workflows/${file}`,
        newContents,
        "utf-8"
      );
    } else {
      fs.writeFileSync(`${process.cwd()}/${file}`, newContents, "utf8");
    }
  });
}

async function makeWorkflowDir() {
  try {
    await fs.ensureDir(`${process.cwd()}/.github/workflows`);
  } catch (err) {
    return err;
  }
}

async function makeTempDir() {
  try {
    const temp = await tmp.dir({ unsafeCleanup: true });
    return temp;
  } catch (err) {
    return err;
  }
}

async function copyTemplateFiles(srcDir, args) {
  const npm = spawn("npm", [
    "install",
    "--prefix",
    srcDir.path,
    `${packageJSON.name}`,
  ]);
  npm.stdout.on("data", (d) => console.log(d.toString()));
  npm.on("close", (code) => {
    if (code === 0) {
      // run our template function
      fillInTemplates(
        `${srcDir.path}/node_modules/${packageJSON.name}/templates`,
        args
      );
    }
  });
  srcDir.cleanup();
}
module.exports = { init };
