import { getOSVersion, getSystemProps } from "../libs/os.js";
import { SendError } from "../libs/errorHandler.js";
import { getPackages } from "./package.js";

export function osfetch({ print, terminal }, args) {
    // --- Fake CPU info for browser environment ---
    const os = require('os');
    const cpus = os.cpus();
    let firstCpu = "";
    if (cpus.length > 0) {
        firstCpu = cpus[0];
    }

    const packages = getPackages();
    const packageCount = Array.isArray(packages) ? packages.length : packages;

    const minimal = args === "-m" || args === "--minimal";

    if (minimal) {
        print(`OS: ${getOSVersion("full")}`);
        print(`Shell: ${getSystemProps("shell")}`);
        print(`Terminal: ${getSystemProps("terminal")}`);
        print(`Packages: ${packageCount}`);
        print(`CPU: ${firstCpu.model} @ ${firstCpu.speed / 1000} GHz`);
        return;
    }

    if (!args || args === "") {
        print("<br>");
        // img height (lines * line height * font size)
        print(`<img src="./assets/images/bananahh.webp" style="float:left; margin-right: 18px; width:auto; height:calc(6 * 1.5 * 14px)" />`);
        print(`<span class="textColorUserPref1">${getSystemProps("username")}</span>@<span class="textColorUserPref1">${getSystemProps("hostname")}</span>`);
        print("-------------");

        const info = [
            ["OS", `Hac3dOS ${getOSVersion("version")}`],
            ["Channel", getOSVersion("channel")],
            ["Packages", `${packageCount} (package)`],
            ["Shell", getSystemProps("shell")],
            ["Terminal", getSystemProps("terminal")],
            ["CPU", `${firstCpu.model} @ ${firstCpu.speed / 1000} GHz`]
        ];

        info.forEach(([key, value]) => {
            print(`<span class="textColorUserPref0">${key}</span>: <span style="position: absolute; left: 250px;">${value}</span>`);
        });

        print("<br>");
        return;
    }

    // Unknown argument
    SendError({
        print,
        terminal,
        errorType: "UnknownArg",
        errorDetails: `Unknown argument '${args}'`
    });
}