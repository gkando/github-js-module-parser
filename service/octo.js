var url = require("url");
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit();

module.exports = {
  getContents,
};

async function getContents(query, cb) {
  var q = url.parse(query, true);
  let [owner, repo, path = ""] = q.path.split("/").filter((i) => i);

  try {
    const data = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });
    console.log(data);
    // res.send(data);
  } catch (err) {
    console.log("the system is down");
  }
}

// helper functions

// needs rewrite client side to be cleaner here
// if api url => pass thru else construct url
const getUrl = (query) => {
  var q = url.parse(query, true);
  if (q.hostname == "api.github.com") {
    var adr = q.href;
  } else {
    let [owner, repo, path = ""] = q.path.split("/").filter((i) => i);
    var adr = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  }
  return adr;
};
