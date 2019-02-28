#!/usr/bin/env node
"use strict";

const fs = require("fs-extra");
const path = require("path");
const minify = require("minify");

const {exit} = require("./utils");
const pkg = require("../package.json");

const files = {
  style: "./tools/src/style.css",
  usercss: "./style.user.css",
  template: "./tools/usercss-template.css",
};

async function replaceVars(css) {
  function extractThemeName(css) {
    return css
      .substring(2, css.indexOf("*/"))
      .trim()
      .toLowerCase();
  }

  const themes = await fs.readdir("./optionals/");

  const styles = await Promise.all(themes.map(theme => fs.readFile("./optionals/" + theme, "utf8")));

  styles.forEach(style => {
    const name = extractThemeName(style);
    css = css.replace(`{{${name}}}`, minify.css(style));
  });

  css = css.replace("{{title}}", pkg.title);
  css = css.replace("{{version}}", pkg.version);
  css = css.replace("{{description}}", pkg.description);
  css = css.replace("{{main}}", pkg.main);
  css = css.replace("{{license}}", pkg.license);

  return css;
}

return fs.unlink(files.usercss).catch(() => { })
  .then(() => fs.readFile(files.template, "utf8"))
  .then(css => fs.readFile(files.style, "utf8").then(style => css + style))
  .then(async css => fs.writeFileSync(files.usercss, await replaceVars(css)))
  .then(() => console.log("\x1b[32m%s\x1b[0m", `${pkg.title} usercss update complete`))
  .catch(exit);
