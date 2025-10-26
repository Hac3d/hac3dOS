// libs/loadConfig.js
// This loads the configuration for the terminal colors.

// Default colours:
// .textColorPink {
//     color: #ff00afff !important;
// }

// .textColorLighterPurple {
//     color: #ef7fef !important;
// }

// .textColorLightPurple {
//     color: #a432a4 !important;
// }

// .textColorPurple {
//     color: #5f00a3ff !important;
// }

// .textColorGreen {
//     color: #00cc00 !important;
// }

// .textColorGray {
//     color: #696969 !important;
// }

// .textColorRed {
//     color: #ff0000 !important;
// }

// .textColorYellow {
//     color: #ffff00 !important;
// }

// .textColorCyan {
//     color: #00ffff !important;
// }

// .textColorWhite {
//     color: #ffffff !important;
// }

// .textColorBlue {
//     color: #0000ff !important;
// }

// .textColorBlack {
//     color: #000000 !important;
// }
export function setUserColors() {
    if (!localStorage.getItem("/.config/hac3dos/")) {
        localStorage.setItem("/.config/hac3dos/", `hFS:typeFolder`);
    }
    if (!localStorage.getItem("/.config/hac3dos/colors.json") || localStorage.getItem("/.config/hac3dos/colors.json").value === "") {
        localStorage.setItem("/.config/hac3dos/colors.json", `{userColor:"#a432a4"}`);
        document.head.innerHTML += `<style type="text/css">.textColorUserPref{color:#a432a4 !important;}</style>`;
        return;
    } else {
        document.head.innerHTML += `<style type="text/css">.textColorUserPref{color:#1ab591ff !important;}</style>`;
        return;
    }
}

export function returnUserColors(index = null) {
    const key = "/.config/hac3dos/colors.json";

    let colorData = localStorage.getItem(key);

    // If not present, create default JSON properly formatted
    if (!colorData || colorData.trim() === "") {
        const defaultColors = {
            userColors: ["#ef7fef", "#a432a4", "#c16affff"]
        };
        localStorage.setItem(key, JSON.stringify(defaultColors));
        colorData = JSON.stringify(defaultColors);
    }

    // Parse JSON safely
    let parsed;
    try {
        parsed = JSON.parse(colorData);
    } catch (err) {
        console.error("Error parsing color config:", err);
        parsed = { userColors: ["#ef7fef", "#a432a4", "#c16affff"] };
        localStorage.setItem(key, JSON.stringify(parsed));
    }

    // --- Create or update CSS styles ---
    let styleEl = document.querySelector("#userColorStyles");
    if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "userColorStyles";
        styleEl.type = "text/css";
        document.head.appendChild(styleEl);
    }

    // Build CSS text dynamically
    let css = ":root {\n";

    // Add --terminal-accent-color (third color or fallback)
    const accentColor = parsed.userColors[2] || parsed.userColors[0];
    css += `  --terminal-accent-color: ${accentColor} !important;\n`;
    css += "}\n\n";

    // Add numbered user color classes
    parsed.userColors.forEach((color, idx) => {
        css += `.textColorUserPref${idx} { color: ${color} !important; }\n`;
    });

    styleEl.textContent = css;

    // --- Handle single color request ---
    if (index === "random") {
        const randomIndex = Math.floor(Math.random() * parsed.userColors.length);
        return parsed.userColors[randomIndex];
    } else if (typeof index === "number") {
        return parsed.userColors[index] || parsed.userColors[0];
    }

    // Default: return all colors
    return parsed.userColors;
}