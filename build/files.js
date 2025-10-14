/* global require module */
"use strict";

const fs = require("fs");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

async function createUserStyl(version, title, description) {
  try {
    const files = await Promise.all([
      readFile("./build/template.user.styl", "utf8"),
      readFile("./build/style.styl", "utf8")
    ]);

    const processedTemplate = processTemplate(files, version, title, description);
    await writeFile("youtube-tweaks.user.styl", processedTemplate, "utf8");
  } catch (error) {
    console.log("Error creating user CSS:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

function processTemplate(files, version, title, description) {
  const template = files.join("\n");
  const processedTemplate = template
  .replace(/\[\[VERSION\]\]/g, version)
    .replace("[[NAME]]", title)
    .replace("[[DESCRIPTION]]", description);

  return processedTemplate;
}


async function del(name) {
  try {
    await unlink(name);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.log(`Error deleting ${name}:`, error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }
}

module.exports = {
  del,
  createUserStyl
};
