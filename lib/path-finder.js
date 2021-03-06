var fs = require('fs');
var glob = require('glob');

function parseTestFiles(pattern, encoding) {
    var paths = {}; 
    glob.sync(pattern).find((path, index, array) => {
      parseTestFile(paths, path, testFileData(path, encoding));
    });
    return paths;
}

function testFileData(path, encoding) {
    return removeNewLines(removeComments(fs.readFileSync(path, encoding)));
}

function removeComments(data) {
    return data.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');
}

function removeNewLines(data) {
    return data.replace(/\r?\n|\r/g, '');
}

function parseTestFile(paths, path, data) {
  var regex = regexPattern();  
  while ((result = regex.exec(data)) != null) {
    var type = result[2] || result[3];
    var text = result[5];
    if (paths[path] == undefined) {
        paths[path] = { describe: [], it: [] };
    };
    if (type == 'describe') {
        paths[path].describe.push(text);
    }
    if (type == 'it') {
        paths[path].it.push(text);
    }
  }
}

function regexPattern() {
    return new RegExp('((describe)|(it))\\s*\\(\\s*(\`|\'|\")(.*?)\\4,', 'gi');
  }

function testFile(paths, describe, it) {
  var testFile = Object.keys(paths).find(path => 
    exist(paths, path, describe, it));
  if (testFile == undefined) { 
    throw new Error('Test file path not found!');
  }
  return testFile;
}

function exist(paths, path, describe, it) {
    return existDescribe(paths, path, describe) && 
           existIt(paths, path, it);
}

function existDescribe(paths, path, describe) {
    return (paths[path].describe.includes(describe) ||
            paths[path].describe.includes(escapeQuotes(describe)));
}

function existIt(paths, path, it) {
    return (paths[path].it.includes(it) ||
            paths[path].it.includes(escapeQuotes(it)));
}

function escapeQuotes(str) {
  return str.replace(/\\([\s\S])|("|')/g,"\\$1$2");
}

module.exports = {
    parseTestFiles: parseTestFiles,
    testFile: testFile 
};