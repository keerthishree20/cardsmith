#!/usr/bin/env node
/*
 * cardsmith.html is written as Artifact body content: the claude.ai viewer supplies
 * the doctype, head, charset/viewport meta and a small CSS reset around it.
 * A plain web server supplies none of that, so this wraps the same source into a
 * standalone docs/index.html for GitHub Pages. One source, two targets.
 */
const fs = require("fs");
const path = require("path");

const root = __dirname;
const src = fs.readFileSync(path.join(root, "cardsmith.html"), "utf8");
const out = path.join(root, "docs");

const DESCRIPTION =
  "Turn notes into flashcards and review them the day before you'd forget. " +
  "Spaced repetition with a real SM-2 scheduler, cloze deletions, tags and search. " +
  "Everything stays in your browser.";

// The favicon the artifact gets from its publish parameter, as an inline SVG.
const FAVICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
    '<rect width="64" height="64" rx="12" fill="#0B6E75"/>' +
    '<rect x="14" y="18" width="30" height="22" rx="3" fill="#fff" opacity=".55"/>' +
    '<rect x="20" y="24" width="30" height="22" rx="3" fill="#fff"/>' +
    "</svg>"
  );

const head = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${DESCRIPTION}">
<meta name="color-scheme" content="light dark">
<meta property="og:title" content="Cardsmith">
<meta property="og:description" content="${DESCRIPTION}">
<meta property="og:type" content="website">
<link rel="icon" href="${FAVICON}">
<style>
  /* the two rules the Artifact wrapper provides; the page depends on both */
  html{color-scheme:light dark}
  body{margin:0}
  img{max-width:100%}
  [hidden]{display:none!important}
</style>
</head>
<body>
`;

const tail = `
</body>
</html>
`;

fs.mkdirSync(out, {recursive: true});
fs.writeFileSync(path.join(out, "index.html"), head + src + tail);
fs.writeFileSync(path.join(out, ".nojekyll"), "");   // serve files starting with _ as-is
fs.writeFileSync(
  path.join(out, "robots.txt"),
  "User-agent: *\nAllow: /\n"
);

const bytes = fs.statSync(path.join(out, "index.html")).size;
console.log("docs/index.html  " + (bytes / 1024).toFixed(1) + " KB");
