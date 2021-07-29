const { Octokit } = require("@octokit/rest");

async function getLatestLookingGlassVersion() {
    const octokit = new Octokit({
      userAgent: "hands-on-lab scaffolding package",
    });
    const release = await octokit.rest.repos.getLatestRelease({
      owner: "githubtraining",
      repo: "looking-glass-action",
    });
    return release.data.tag_name;
  }

  module.exports = getLatestLookingGlassVersion 