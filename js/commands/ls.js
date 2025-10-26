// commands/ls.js
import { getSystemProps } from "../libs/os.js";
import { returnUserColors } from "../libs/loadConfig.js";
export function ListFilesInLocalStorage({ print }, ...args) {
  let currentPath = window.hFScurrentPath || "/";

  if (Array.isArray(args[0])) args = args[0];

  let showAll = false;
  let longFormat = false;
  const targets = [];

  // Parse flags properly, including combined ones
  for (const arg of args) {
    if (arg.startsWith("-") && arg.length > 1) {
      const flags = arg.slice(1).split("");
      if (flags.includes("a")) showAll = true;
      if (flags.includes("l")) longFormat = true;
    } else {
      targets.push(arg);
    }
  }

//   console.log(`showAll: ${showAll},
// longFormat: ${longFormat},
// currentPath: ${currentPath},
// args: ${args}`);

  // Collect all keys in the current directory
  const allKeys = Object.keys(localStorage);

  const folders = new Set();
  const files = [];

  for (const key of allKeys) {
    if (!key.startsWith(currentPath)) continue;
    if (key === currentPath) continue;

    const relative = key.slice(currentPath.length);

    // Ignore nested paths (only direct children)
    if (relative === "" || relative.includes("/") && relative.split("/").length > 2) continue;

    const parts = relative.split("/");
    if (parts.length === 2 && parts[1] === "") {
      // Direct folder
      folders.add(parts[0] + "/");
    } else if (parts.length === 1 && parts[0]) {
      // Direct file
      files.push(parts[0]);
    }
  }

  // Merge folders and files
  let entries = [...Array.from(folders).sort(), ...files.sort()];

  if (!showAll) {
    entries = entries.filter(f => !f.startsWith("."));
  }

  if (entries.length === 0) {
    print("No files found in this directory.");
    return;
  }

longFormat = true;

if (longFormat) {
  const iconMap = {
    ".txt": "",
    ".js": "",
    ".json": "",
    ".html": "",
    ".css": "",
    ".md": "",
    ".png": "",
    ".jpg": "",
    ".jpeg": "",
    ".gif": "",
    ".zip": "",
    ".tar": "",
    ".gz": "",
    ".mp3": "",
    ".wav": "",
    ".mp4": "",
    ".mov": "",
    ".pdf": "",
    ".sh": "",
    ".exe": "",
  };
  // Use <pre> to preserve spacing and monospaced alignment
  let output = `<pre><b>Permissions      Size   User     Date Modified      Name</b>\n`;

  entries.forEach((entry) => {
    const fullPath = currentPath + entry;
    const value = localStorage.getItem(fullPath);
    const isDir = entry.endsWith("/") && value === "hFS:typeFolder";

    // Determine if hidden (starts with ".")
    const isHidden = entry.startsWith(".");

    // Fake metadata
    const permissions = isDir ? "drwxr-xr-x" : "-rw-r--r--";
    const user = getSystemProps("username") || "root";
    const date = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).replace(",", "");

    const sizeBytes = isDir ? 0 : (value?.length || 0);
    const size =
      sizeBytes < 1024
        ? `${sizeBytes}B`
        : sizeBytes < 1024 * 1024
        ? `${(sizeBytes / 1024).toFixed(1)}K`
        : `${(sizeBytes / (1024 * 1024)).toFixed(1)}M`;

    let icon;
    if (isDir) {
      icon = isHidden ? "󱞞" : ""; // Hidden folder / normal folder
    } else {
      const extMatch = entry.match(/\.[^/.]+$/);
      const ext = extMatch ? extMatch[0].toLowerCase() : "";
      icon = iconMap[ext] || (isHidden ? "󰘓" : ""); // Default file / hidden file
    }

    const nameColor = isDir ? returnUserColors(1) : "#ffffff";
    const name = `<span style="color:${nameColor}">${icon} ${entry}</span>`;

    // Pad + align text columns nicely
    const line =
      permissions.padEnd(13) +
      size.padStart(8) +
      user.padStart(7) +
      date.padStart(17) +
      "       " +
      name +
      "\n";

    output += line;
  });

  output += `</pre>`;
  print(output);
} else {
    const cols = 4;
    let row = "";
    print("<br>");
    entries.forEach((entry, i) => {
      const fullPath = currentPath + entry;
      const value = localStorage.getItem(fullPath);
      const isDir = entry.endsWith("/") || value === "hFS:typeFolder";
      const displayName = isDir ? `${entry}` : entry;
      row += displayName.padEnd(25, " ");
      if ((i + 1) % cols === 0 || i === entries.length - 1) {
        print(row);
        row = "";
      }
    });
    print("<br>");
  }
}