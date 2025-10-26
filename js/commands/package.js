import { SendError } from "../libs/errorHandler.js";
import { getOSVersion } from "../libs/os.js";

// Mock package database
let installedPackages = [];

export function packageCmd({ print, terminal }, args, args2) {
    // If no argument, show overview
    if (!args) {
        print("<br>");
        print("----------------------------------------");
        print("[] package (the Hac3dOS package manager)");
        print("For help, type 'package help'");
        print("----------------------------------------");
        print("<br>");
        return;
    }

    const cmd = args.toLowerCase();

    // Define handlers
    const commands = {
        help: () => {
            print("<br>");
            print("? package help");
            print("---------------------------------------------");
            const helpText = [
                ["update", "Updates all packages"],
                ["push", "Uploads package files to Hac3dNetwork"],
                ["purge", "Removes all cached files"],
                ["info", "Views package info"],
                ["install", "Installs packages"],
                ["remove", "Removes packages"],
                ["version", "Displays the current version"],
                ["help", "Displays this menu"]
            ];
            helpText.forEach(([cmd, desc]) => {
                print(`${cmd.padEnd(10)} - ${desc}`);
            });
            print("---------------------------------------------");
            print("<br>");
        },

        update: () => {
            if (installedPackages.length === 0) {
                print("No packages to update.");
            } else {
                print("Updating packages...");
                installedPackages.forEach(pkg => {
                    print(`Updated: ${pkg}`);
                });
            }
        },

        version: () => {
            print(`package ${getOSVersion("version")}-rewrite`);
        },

        list: () => {
            if (installedPackages.length === 0) {
                print("No packages are installed.");
            } else {
                print("Installed packages:");
                installedPackages.forEach(pkg => print(`- ${pkg}`));
            }
        },

        install: (pkgName = args2) => {
            if (!pkgName) {
                print("Usage: package install <package-name>");
                return;
            }
            if (!installedPackages.includes(pkgName)) {
                installedPackages.push(pkgName);
                print(`Installed package: ${pkgName}`);
            } else {
                print(`Package "${pkgName}" is already installed.`);
            }
        },

        remove: (pkgName = args2) => {
            if (!pkgName) {
                print("Usage: package remove <package-name>");
                return;
            }
            const index = installedPackages.indexOf(pkgName);
            if (index !== -1) {
                installedPackages.splice(index, 1);
                print(`Removed package: ${pkgName}`);
            } else {
                print(`Package "${pkgName}" not found.`);
            }
        }
    };

    // Execute command
    if (commands[cmd]) {
        // Some commands need extra arguments
        if (["install", "remove"].includes(cmd)) {
            const extra = args.split(" ")[1];
            commands[cmd](extra);
        } else {
            commands[cmd]();
        }
    } else {
        SendError({
            print,
            terminal,
            errorType: "UnknownArg",
            errorDetails: `Unknown argument '${args}'`
        });
    }
}

// Example getter
export function getPackages() {
    return installedPackages.length === 0 ? "0" : installedPackages;
}