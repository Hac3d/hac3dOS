// libs/os.js
// Adds features for the OS to use.
// example usage: import { getOSVersion, getSystemProps } from "../libs/os.js";

export function getOSVersion(type) {
    let buildYear = "2025";
    let buildMonth = "10";
    let versionNum = `${buildYear}${buildMonth}.4.34`;
    let channel = "main/electronjs";
    if (type === "full") {
        return `${versionNum} (${channel})`;
    } else if (type === "version") {
        return versionNum;
    } else if (type === "channel") {
        return channel;
    } else if (type === "buildYear") {
        return buildYear;
    } else {
        return "null";
    }
}

export function getSystemProps(type) {
    if (type === "username") {
        return "root";
    } else if (type === "hostname") {
        return "hac3dos";
    } else if (type === "shell") {
        return "hac3dprompt";
    } else if (type === "terminal") {
        return "hac3dtty-beta";
    }
}
 
export function printText(input) {
  const div = document.createElement("div");
  div.textContent = input; 
  return div.innerHTML.replace(/\n/g, "<br>");
}

export function getShellPrompt() {
    const username = getSystemProps("username");
    const hostname = getSystemProps("hostname");

    let currentPath = window.hFScurrentPath || "/";
    if (!currentPath) currentPath = "/";

    window.hOSprompt(`[${username}@${hostname} ${currentPath}]# `);
}