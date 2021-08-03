const { spawnSync } = require("child_process");
async function bootstrapRepository(owner, repo) {
  gitCommand("init");
}

function gitCommand(...command) {
  const args = command;
  const options = {
    cwd: "./",
    stdio: [0, 1, 2],
  };
  spawnSync("git", args);
}

module.exports = bootstrapRepository;
