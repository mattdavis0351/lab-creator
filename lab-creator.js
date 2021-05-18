const chalk = require("chalk");
const commander = require("commander");
const nj = require("nunjucks");
const fs = require("fs-extra");
const tmp = require("tmp-promise");
const packageJSON = require("./package.json");
const { spawn } = require("child_process");
const { Octokit } = require("@octokit/rest");

// nj.configure({ autoescape: false });
async function init() {
  // Create new commander.Command()
  // command new-lab
  // option --lab-name
  // lab-creator new-lab --lab-name bread
  const program = new commander.Command("lab-creator");
  // program metadata
  program.version(packageJSON.version);

  program
    .command("new-lab")
    .description("Create a new lab")
    .requiredOption("-l,--lab-name <lab-name>")
    .option("-v,--lg-version <looking-glass-version>")
    .requiredOption("-a,--action-name <name-of-local-action>")
    .action(async (args) => {
      const tempPath = await makeTempDir();
      await makeRequiredDirs(args);
      await copyTemplateFiles(tempPath, args);
    });

  program.parse(process.argv);
}

async function getLookingGlassVersion() {
  const octokit = new Octokit({
    userAgent: "hands-on-lab scaffolding package",
  });
  const release = await octokit.rest.repos.getLatestRelease({
    owner: "githubtraining",
    repo: "looking-glass-action",
  });
  return release.data.tag_name;
}

async function fillInTemplates(templateDir, args) {
  const lookingGlassVersion =
    args.lgVersion || (await getLookingGlassVersion());
  const templateOptions = {
    labName: args.labName,
    lookingGlassVersion: lookingGlassVersion,
    actionName: args.actionName,
  };

  const templateFiles = fs.readdirSync(`${templateDir}`);
  templateFiles.forEach((file) => {
    const contents = fs.readFileSync(`${templateDir}/${file}`).toString();
    const newContents = nj.renderString(contents, templateOptions);
    if (file.includes(".yml")) {
      fs.writeFileSync(
        `${process.cwd()}/.github/workflows/${file}`,
        newContents,
        "utf-8"
      );
    } else {
      fs.writeFileSync(`${process.cwd()}/${file}`, newContents, "utf8");
    }

    fs.writeFileSync(`${process.cwd()}/.gitignore`, "node_modules", "utf8");
    fs.writeFileSync(
      `${process.cwd()}/.github/actions/${
        templateOptions.actionName
      }/action.yml`,
      `name: ${templateOptions.actionName}`,
      "utf8"
    );
    fs.writeFileSync(
      `${process.cwd()}/.github/actions/${templateOptions.actionName}/main.js`,
      "const core = require('@actions/core')",
      "utf8"
    );
    fs.ensureDirSync(
      `${process.cwd()}/.github/actions/${templateOptions.actionName}/__tests__`
    );
  });
}

async function makeRequiredDirs(args) {
  try {
    await fs.ensureDir(`${process.cwd()}/.github/workflows`);
    await fs.ensureDir(`${process.cwd()}/.github/actions/${args.actionName}`);
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
  npm.on("close", async (code) => {
    if (code === 0) {
      // run our template function
      await fillInTemplates(
        `${srcDir.path}/node_modules/${packageJSON.name}/templates`,
        args
      );
    }
  });
  srcDir.cleanup();
}
module.exports = { init };
