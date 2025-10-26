// commands/mkdir.js
export function MakeDirectory({ print, args, terminal }) {
  if (!args || args.length === 0) {
    print("Usage: mkdir <foldername>");
    return;
  }

  let folderName = args[0];
  if (folderName.includes("/")) {
    print("mkdir: folder name cannot contain '/'");
    return;
  }

  let currentPath = terminal.currentPath || "/";
  const newFolderPath = currentPath + folderName + "/";

  if (localStorage.getItem(newFolderPath)) {
    print(`mkdir: cannot create directory '${folderName}': already exists`);
    return;
  }

  localStorage.setItem(newFolderPath, "hFS:typeFolder");
  print(`Directory created: ${newFolderPath}`);
}