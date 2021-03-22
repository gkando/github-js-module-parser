var url = require("url");
const fetch = require("node-fetch");
const acorn = require("acorn");
const jsx = require("acorn-jsx");

const parser = acorn.Parser.extend(require("acorn-jsx")());
const opts = { sourceType: "module" };

const getContents = (query, cb) => {
  var adr = getUrl(query);
  return fetch(adr, {
    headers: {
      accept: "application/json",
      "accept-language": "en-US,en;q=0.9",
    },
  })
    .then((r) => r.json())
    .then((result) => {
      // console.log("RESULTS: ", result);
      return cb(result);
    })
    .catch((err) => console.log(err));
};

// parse response for file
const parseFile = (result) => {
  let content = parseB64(result);
  let node = parser.parse(content, opts).body;
  const imports = node.filter((obj) => obj.type === "ImportDeclaration");
  const dependencies = imports.map((item) => item.source.value);
  // console.log(dependencies);
  return dependencies;
};

// parse repo & return only folders & js files
const parseDir = async (tree) => {
  console.log(tree);
  const regex = /\.(js|json|jsx)$/g;
  let directory = tree
    .map((item) => {
      return {
        type: item.type,
        path: item.path,
        // download_url: item.download_url,
        url: item.url,
      };
    })
    .filter((i) => i.type == "tree" || regex.exec(i.path));
  return dirPathsObj(directory);
};

// helper functions

const dirPathsObj = (directory) => {
  const dirObj = {};
  Object.keys(directory).forEach(function (item) {
    directory[item].path.split("/").reduce(function (r, e) {
      return (r[e] = r[e] || (r[e] = {}));
    }, dirObj);
  });
  return mergeDirObj(directory, dirObj);
};

function deepValue(obj, path, value) {
  var parts = path.split("/");
  var curr = obj;
  for (var i = 0; i < parts.length - 1; i++) curr = curr[parts[i]] || {};
  curr[parts[parts.length - 1]] = value;
}

const mergeDirObj = (paths, dirObj) => {
  Object.keys(paths).forEach(function (item) {
    if (paths[item].type !== "blob") {
      return;
    }
    deepValue(dirObj, paths[item].path, paths[item]);
  });
  return dirObj;
};

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

// decode base64 response for file contents
const parseB64 = (res) => {
  var data = res.content;
  // console.log(data);
  let content = Buffer.from(data, "base64").toString("ascii");
  return content;
};

// filter json by keys & return flat arr of values
const filterObj = (obj, keys) => {
  return Object.keys(obj)
    .filter((k) => keys.includes(k))
    .flatMap((k) => Object.keys(obj[k]));
  // Node 11+ required for flatMap
};

const getPackages = (url) => {
  const regex = /.*?\/contents/gm;
  let adr = url.match(regex) + "/package.json";
  // console.log("PACKAGES:  ", adr);
  return fetch(adr, {
    headers: {
      accept: "application/json",
      "accept-language": "en-US,en;q=0.9",
    },
  })
    .then((r) => r.json())
    .then((result) => {
      let content = parseB64(result);
      let jsonContent = JSON.parse(content);
      return filterObj(jsonContent, ["dependencies", "devDependencies"]);
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getContents,
  parseFile,
  parseDir,
  getPackages,
};
