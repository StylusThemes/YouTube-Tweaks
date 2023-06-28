/* global require */
"use strict";

const pkg = require("../package.json");
const { del, createUserStyl } = require("./files");

del("youtube-tweaks.user.styl")
  .then(() => createUserStyl(pkg.version, pkg.title, pkg.description))
  .then(() => console.log("\x1b[32m%s\x1b[0m", "YouTube Tweaks usercss build complete"))
  .catch(err => {
    throw err;
  });
