import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const htmlFiles = fs
  .readdirSync(root)
  .filter((file) => file.endsWith(".html") && !file.endsWith(".tmp.html"))
  .sort();
const metadataOptionalFiles = new Set(["Creatives-clean.html"]);
const cssFiles = fs.readdirSync(root).filter((file) => file.endsWith(".css"));
const jsFiles = [
  "engineering.js",
  "creatives.js",
  "site-header.js",
  "portfolio-page.js"
].filter((file) => fs.existsSync(path.join(root, file)));

const failures = [];

function addFailure(file, message) {
  failures.push(`${file}: ${message}`);
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function existsLocal(ref, file) {
  if (
    !ref ||
    ref.startsWith("#") ||
    ref.startsWith("/") ||
    ref.startsWith("http://") ||
    ref.startsWith("https://") ||
    ref.startsWith("mailto:") ||
    ref.startsWith("tel:") ||
    ref.startsWith("data:")
  ) {
    return true;
  }

  const clean = ref.replace(/^\.\//, "").split("?")[0].split("#")[0];
  return fs.existsSync(path.resolve(path.dirname(path.join(root, file)), clean));
}

function scanHtmlRefs(file) {
  const text = read(file);
  const attrPattern = /(?:src|href)=["']([^"']+)["']/g;
  const styleUrlPattern = /url\(["']?([^"')]+)["']?\)/g;

  for (const pattern of [attrPattern, styleUrlPattern]) {
    for (const match of text.matchAll(pattern)) {
      const ref = match[1];
      if (ref === "#") {
        addFailure(file, 'contains forbidden dead link `href="#"`');
        continue;
      }
      if (!existsLocal(ref, file)) {
        addFailure(file, `missing local reference ${ref}`);
      }
    }
  }
}

function scanJsRefs(file) {
  const text = read(file);
  const quotedPathPattern = /["']([^"']+\.(?:html|css|png|jpe?g|svg|gif|webp|mp4))["']/g;
  for (const match of text.matchAll(quotedPathPattern)) {
    const ref = match[1];
    if (!existsLocal(ref, file)) {
      addFailure(file, `missing local reference ${ref}`);
    }
  }
}

function scanContent(file) {
  const text = read(file);
  const phraseChecks = [
    /Content coming soon/i,
    /Project page coming soon/i,
    /\(placeholder\)/i,
    /Placeholder #/i,
    /\[Insert .* here\]/i,
    /path-to-your-video\.mp4/i,
    /href="#"/i
  ];

  phraseChecks.forEach((pattern) => {
    if (pattern.test(text)) {
      addFailure(file, `contains blocked placeholder content matching ${pattern}`);
    }
  });
}

function scanMetadata(file) {
  if (metadataOptionalFiles.has(file)) return;

  const text = read(file);
  const checks = [
    { pattern: /<meta\s+name=["']description["']\s+content=["'][^"<>]{50,}["']/i, label: "meta description of at least 50 characters" },
    { pattern: /<meta\s+property=["']og:title["']\s+content=["'][^"<>]+["']/i, label: "Open Graph title" },
    { pattern: /<meta\s+property=["']og:description["']\s+content=["'][^"<>]{50,}["']/i, label: "Open Graph description" },
    { pattern: /<meta\s+property=["']og:image["']\s+content=["'][^"<>]+["']/i, label: "Open Graph image" },
    { pattern: /<link\s+rel=["']canonical["']\s+href=["'][^"<>]+["']/i, label: "canonical URL" }
  ];

  checks.forEach(({ pattern, label }) => {
    if (!pattern.test(text)) addFailure(file, `missing ${label}`);
  });
}

htmlFiles.forEach((file) => {
  scanHtmlRefs(file);
  scanContent(file);
  scanMetadata(file);
});

cssFiles.forEach((file) => {
  const text = read(file);
  const styleUrlPattern = /url\(["']?([^"')]+)["']?\)/g;
  for (const match of text.matchAll(styleUrlPattern)) {
    const ref = match[1];
    if (!existsLocal(ref, file)) {
      addFailure(file, `missing local reference ${ref}`);
    }
  }
});

jsFiles.forEach((file) => {
  scanJsRefs(file);
  scanContent(file);
});

if (failures.length) {
  console.error("Site integrity check failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Site integrity check passed for ${htmlFiles.length} HTML files.`);
