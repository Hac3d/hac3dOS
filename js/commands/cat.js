// cat.js
// displays the content of a file.
import { printText } from "../libs/os.js";

export function catCmd({ print }, filename) {
    if (!filename) {
        print("Usage: cat <filename>");
        return;
    }

    // --- Normalize filename to full path ---
    let currentPath = window.hFScurrentPath || "/";
    if (!currentPath.endsWith("/")) currentPath += "/";
    if (!filename.startsWith("/")) filename = currentPath + filename;
    filename = filename.replace(/\/+/g, "/"); // remove duplicate slashes

    const content = localStorage.getItem(filename);
    if (content === null) {
        print(`File "${filename}" not found in localStorage.`);
    } else {
        print(printText(content));
    }
}