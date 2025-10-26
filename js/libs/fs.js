// libs/fs.js
// hFS - hac3d file system

import { getShellPrompt } from "./os.js";
import { SendError } from "./errorHandler.js";

// fs checks
if (!localStorage.getItem("/.config/")) {
  localStorage.setItem("/.config/", "hFS:typeFolder");
}

if (!localStorage.getItem("/README.txt")) {
  localStorage.setItem("/README.txt", "This is a filesystem that will stay here after reboot!\nThis file will always be here, no matter what you do.");
}

// fs variables
const hFS = {};
hFS.config = "/.config/";

window.hFS = hFS;

export function RemoveItem({ print, terminal }, ...args) {
  if (!args || args.length === 0) {
    print("Usage: rm [-r|-f|-v] <item>");
    return;
  }

  if (Array.isArray(args[0])) args = args[0];

  let recursive = false;
  let force = false;
  let verbose = false;
  const targets = [];

  // Parse flags properly, including combined ones
  for (const arg of args) {
    if (arg.startsWith("-") && arg.length > 1) {
      const flags = arg.slice(1).split("");
      if (flags.includes("r")) recursive = true;
      if (flags.includes("f")) force = true;
      if (flags.includes("v")) verbose = true;
    } else {
      targets.push(arg);
    }
  }

  if (targets.length === 0) {
    print("rm: missing operand");
    return;
  }

  let currentPath = window.hFScurrentPath || "/";
  if (!currentPath.endsWith("/")) currentPath += "/";

  const normalize = (path) => {
    path = path.trim();
    if (!path.startsWith("/")) path = currentPath + path;
    path = path.replace(/\/+/g, "/");
    if (path !== "/" && path.endsWith("/")) path = path.slice(0, -1);
    return path;
  };

  const deleteRecursively = (prefix) => {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(prefix)) {
        if (verbose) print(`removed: ${key}`);
        localStorage.removeItem(key);
      }
    }
  };

  for (const target of targets) {
    const fullPath = normalize(target);
    const folderKey = fullPath + "/";
    const value = localStorage.getItem(fullPath) ?? localStorage.getItem(folderKey);

    if (value === null) {
      if (!force) print(`rm: cannot remove '${target}': No such file or directory`);
      continue;
    }

    // Folder logic
    if (value === "hFS:typeFolder" && value.endsWith("/")) {
      if (!recursive) {
        print(`rm: cannot remove '${target}': Is a directory`);
        continue;
      }
      if (!force) print(`rm: removing directory '${target}'`);
      deleteRecursively(folderKey);
      localStorage.removeItem(folderKey);
      print(`removed directory: ${target}`);
      continue;
    }

    // File logic
    localStorage.removeItem(fullPath);
    if (verbose || !force) print(`removed: ${target}`);
  }

  // Reset current directory if it was deleted
  if (targets.some(t => normalize(t) === window.hFScurrentPath.replace(/\/$/, ""))) {
    window.hFScurrentPath = "/";
  }
}

export function ChangeDirectory({ print, terminal }, args) {
  if (!args || args.length === 0) {
    print("Usage: cd <folder>");
    return;
  }

  let target = args;
  let currentPath = window.hFScurrentPath || "/";

  if (args === "/") {
    currentPath = "/";
    window.hFScurrentPath = "/";
    getShellPrompt();
    return;
  }

  if (args === "..") {
    if (currentPath === "/") {
      print("Already at root directory.");
      return;
    }

    const parts = currentPath.split("/").filter(Boolean);
    parts.pop(); // remove the last folder
    const newPath = "/" + (parts.length > 0 ? parts.join("/") + "/" : "");

    // Ensure parent exists or assume root
    const parentValue = localStorage.getItem(newPath);
    if (newPath === "/" || parentValue === "hFS:typeFolder") {
      window.hFScurrentPath = newPath;
      getShellPrompt();
    } else {
      window.hFScurrentPath = "/";
      getShellPrompt();
    }
    return;
  }

  // --- Normalize other paths ---
  const normalize = (path) => {
    if (!path.startsWith("/")) path = currentPath + path;
    if (!path.endsWith("/")) path += "/";
    path = path.replace(/\/+/g, "/");
    return path;
  };

  const newPath = normalize(target);
  const value = localStorage.getItem(newPath);

  if (value === "hFS:typeFolder") {
    window.hFScurrentPath = newPath;
    getShellPrompt();
  } else {
    print(`cd: no such directory: ${target}`);
  }
}

export function MakeDirectory({ print, terminal }, args) {
  if (!args || args.length === 0) {
    print("Usage: mkdir <foldername>");
    return;
  }

  let folderName = args;
  if (folderName.includes("/")) {
    print("mkdir: folder name cannot contain '/'");
    return;
  }

  let currentPath = window.hFScurrentPath || "/";
  if (!currentPath.endsWith("/")) currentPath += "/";

  const newFolderPath = currentPath + folderName + "/";

  if (localStorage.getItem(newFolderPath)) {
    print(`mkdir: cannot create directory '${folderName}': already exists`);
    return;
  }

  localStorage.setItem(newFolderPath, "hFS:typeFolder");
  print(`Directory created: ${newFolderPath}`);
}