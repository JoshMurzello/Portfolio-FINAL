import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteUrl = "https://www.joshmurzello.com";
const defaultImage = `${siteUrl}/images/engineer%20cover.JPG`;

const metadata = {
  "index.html": {
    title: "Josh Murzello | Mechanical Engineer and Builder",
    description: "Portfolio of Josh Murzello, a Georgia Tech mechanical engineer building hardware, manufacturing systems, robotics projects, digital tools, and visual stories.",
    image: `${siteUrl}/images/philly%20good.jpg`
  },
  "Engineering.html": {
    title: "Engineering Portfolio | Josh Murzello",
    description: "Engineering portfolio for Josh Murzello, featuring manufacturing internships, robotics prototypes, 3D printing products, BCI experiments, and browser-based CAD tools.",
    image: defaultImage
  },
  "Creatives.html": {
    title: "Creative Portfolio | Josh Murzello",
    description: "Creative portfolio for Josh Murzello, featuring photography, video, product visuals, studio identity work, and visual storytelling for technical projects.",
    image: `${siteUrl}/images/phillu%20good%20closeup.jpg`
  },
  "about.html": {
    title: "About Josh Murzello | Engineering, Creativity, Community",
    description: "Learn about Josh Murzello, a Georgia Tech mechanical engineering student connecting hardware, software, visual storytelling, leadership, and community.",
    image: `${siteUrl}/images/IMG_5660.JPG`
  },
  "tesla.html": {
    title: "Tesla Manufacturing Engineering Internship | Josh Murzello",
    description: "Case study of Josh Murzello's Tesla manufacturing engineering work across automation, fixtures, PLC integration, validation, and production yield.",
    image: `${siteUrl}/images/tesla%20friends.jpg`
  },
  "lg.html": {
    title: "LG Electronics R&D Engineering Internship | Josh Murzello",
    description: "Case study of Josh Murzello's LG Electronics R&D internship work on sensor housings, PCB mechanical design, FEA, DFM, and defect reduction.",
    image: `${siteUrl}/images/LG-Logo.png`
  },
  "price.html": {
    title: "Price Industries Manufacturing Internship | Josh Murzello",
    description: "Case study of Josh Murzello's Price Industries manufacturing engineering internship focused on process improvement, throughput, and shop-floor systems.",
    image: `${siteUrl}/images/price.jpeg`
  },
  "bci.html": {
    title: "Brain Controlled Interface | Josh Murzello",
    description: "Engineering case study for Josh Murzello's brain controlled interface prototype using EEG acquisition, signal handling, Arduino control, and live feedback.",
    image: `${siteUrl}/images/IMG_0754.JPG`
  },
  "sentry-rover.html": {
    title: "Autonomous Tracking Robot | Josh Murzello",
    description: "Josh Murzello's autonomous tracking robot combines MobileNet-SSD person detection, Raspberry Pi 5, Pi Camera 3, ToF ranging, and STM32 motor control.",
    image: `${siteUrl}/images/optimized/tracking-robot-finished.jpg`
  },
  "3Dprint.html": {
    title: "3D Printing Product Series | Josh Murzello",
    description: "Josh Murzello's 3D printing product series covering useful printed objects, CAD iteration, prototype testing, printability, and maker distribution.",
    image: `${siteUrl}/images/A1picture.jpg`
  },
  "camera-storage.html": {
    title: "3D Printed Camera Storage | Josh Murzello",
    description: "Compact case study for Josh Murzello's 3D printed camera storage system, focused on modular organization, fast iteration, and desk-ready utility.",
    image: `${siteUrl}/images/camerame.png`
  },
  "self-balancing-robot.html": {
    title: "Mechatronics Gauntlet Robot | Josh Murzello",
    description: "Josh Murzello's ME 4405 robot: eight labs spanning embedded C, STM32, analog sensing, PWM, encoders, PID, maze navigation, and IMU integration.",
    image: `${siteUrl}/images/optimized/self-balancing-bench-still.jpg`
  },
  "me2110.html": {
    title: "ME 2110 Barbenheimer Bot | Josh Murzello",
    description: "Josh Murzello's ME 2110 Barbenheimer robot project: an autonomous competition build with a cascading lift, CAD model, track layout, and team results.",
    image: `${siteUrl}/images/ME2110cadmodel.png`
  },
  "spacex.html": {
    title: "SpaceX Internship | Josh Murzello",
    description: "Forward-looking portfolio page for Josh Murzello's SpaceX internship, preserving current context while deferring confidential or future details.",
    image: defaultImage
  },
  "cyclodial-actuator.html": {
    title: "Cycloidal Actuator | Josh Murzello",
    description: "Engineering case study for Josh Murzello's 3D printed cycloidal actuator with reduction math, parametric CAD, motor selection, and tolerance iteration.",
    image: `${siteUrl}/images/optimized/cycloidal-actuator-bench-1600.jpg`
  },
  "pomodoro.html": {
    title: "Focus Dial Pomodoro Device | Josh Murzello",
    description: "Engineering case study for Josh Murzello's physical Focus Dial timer combining rotary input, embedded firmware, LED feedback, and distraction reduction.",
    image: `${siteUrl}/images/IMG_0848.png`
  },
  "stl-drops.html": {
    title: "STL Drops | Josh Murzello",
    description: "Prototype storefront concept by Josh Murzello for presenting 3D printable product drops with richer context, previews, licensing, and maker notes.",
    image: `${siteUrl}/images/A1picture.jpg`
  },
  "tools/stl-animator/index.html": {
    title: "STL Animator Tool | Josh Murzello",
    description: "Browser-based STL animation tool by Josh Murzello for loading CAD meshes and creating turntable, dolly, hero, split, and explode-style clips.",
    image: `${siteUrl}/images/ME2110cadmodel.png`
  }
};

const fallbackDescriptions = {
  "dinkrack.html": "Archived engineering project page for Josh Murzello's Dink Rack product concept, preserved as part of the broader 3D printing and design portfolio.",
  "eboard.html": "Archived engineering project page for Josh Murzello's electric skateboard build, preserved as part of the broader mobility and hardware portfolio.",
  "mars.html": "Archived engineering project page for Josh Murzello's MARS research work, preserved as part of the broader hardware and research portfolio.",
  "plant-shelf.html": "Engineering project page for Josh Murzello's 3D printed plant shelf, covering a lightweight tack-mounted shelf designed for small plants and decor.",
  "Creatives-clean.html": "Archived creative portfolio layout for Josh Murzello, preserved as an older visual portfolio draft with photography and studio presentation work."
};

function pageMetadata(file) {
  if (metadata[file]) return metadata[file];
  const title = titleFromFile(file);
  return {
    title,
    description: fallbackDescriptions[file] || `Portfolio page for Josh Murzello covering ${title.toLowerCase()} as part of his engineering, product design, and creative work archive.`,
    image: defaultImage
  };
}

function titleFromFile(file) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  const match = text.match(/<title>(.*?)<\/title>/i);
  if (match && match[1].trim() && match[1].trim() !== "Engineering") return match[1].trim();
  return file
    .replace(/\.html$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) + " | Josh Murzello";
}

function stripManagedMeta(head) {
  return head
    .replace(/\n\s*<meta name="description" content="[^"]*">/gi, "")
    .replace(/\n\s*<meta property="og:[^"]+" content="[^"]*">/gi, "")
    .replace(/\n\s*<meta name="twitter:[^"]+" content="[^"]*">/gi, "")
    .replace(/\n\s*<link rel="canonical" href="[^"]*">/gi, "");
}

function metaBlock(file, data) {
  const canonicalPath = file === "index.html" ? "/" : `/${file}`;
  const canonical = `${siteUrl}${canonicalPath}`;
  return [
    `  <meta name="description" content="${data.description}">`,
    `  <link rel="canonical" href="${canonical}">`,
    `  <meta property="og:title" content="${data.title}">`,
    `  <meta property="og:description" content="${data.description}">`,
    `  <meta property="og:type" content="website">`,
    `  <meta property="og:url" content="${canonical}">`,
    `  <meta property="og:image" content="${data.image}">`,
    `  <meta name="twitter:card" content="summary_large_image">`,
    `  <meta name="twitter:title" content="${data.title}">`,
    `  <meta name="twitter:description" content="${data.description}">`,
    `  <meta name="twitter:image" content="${data.image}">`
  ].join("\n");
}

const htmlFiles = fs
  .readdirSync(root)
  .filter((file) => file.endsWith(".html"))
  .concat(fs.existsSync(path.join(root, "tools/stl-animator/index.html")) ? ["tools/stl-animator/index.html"] : []);

htmlFiles.forEach((file) => {
  const fullPath = path.join(root, file);
  let text = fs.readFileSync(fullPath, "utf8");
  const data = pageMetadata(file);
  text = text.replace(/<title>.*?<\/title>/i, `<title>${data.title}</title>`);
  text = text.replace(/(<title>.*?<\/title>)/i, (match) => {
    const beforeTitle = text.slice(0, text.indexOf(match));
    const afterTitle = text.slice(text.indexOf(match) + match.length);
    return match;
  });
  const headMatch = text.match(/<head>([\s\S]*?)<\/head>/i);
  if (!headMatch) return;
  const cleanedHead = stripManagedMeta(headMatch[1]);
  const nextHead = cleanedHead.replace(/(<title>.*?<\/title>)/i, `$1\n${metaBlock(file, data)}`);
  text = text.replace(headMatch[0], `<head>${nextHead}</head>`);
  fs.writeFileSync(fullPath, text);
});

console.log(`Updated metadata for ${htmlFiles.length} HTML files.`);
