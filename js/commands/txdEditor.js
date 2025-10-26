// commands/txdEditor.js
import { ChangeDirectory, MakeDirectory, RemoveItem } from "../libs/fs.js";
const defaultConfig = {
  theme: {
    backgroundColor: "#000",
    textColor: "#fff",
    lineNumberBackground: "#111",
    lineNumberColor: "#888",
    statusBarBackground: "#222",
    statusBarTextColor: "#fff"
  },
  font: {
    family: '"Courier New", Courier, monospace',
    size: "14px",
    lineHeight: "1.4"
  },
  dimensions: {
    minHeight: "400px",
    maxHeight: "600px",
    lineNumberMinWidth: "30px"
  }
};

let configJSON = hFS.config + ".txd/config.json";

export function createTXDEditor({ print, commandContainer, terminal, start, stop }, filename) {
  start();

  if (!filename) {
    print("Error: filename is required.");
    return;
  }

  console.log();

  if (!localStorage.getItem(configJSON) || (localStorage.getItem(configJSON).value === "")) {
    localStorage.setItem(hFS.config + ".txd/", "hFS:typeFolder")
    localStorage.setItem(configJSON, JSON.stringify(defaultConfig));
  }

  // --- Normalize file path ---
  let currentPath = window.hFScurrentPath || "/";
  if (!currentPath.endsWith("/")) currentPath += "/";
  if (!filename.startsWith("/")) filename = currentPath + filename;
  filename = filename.replace(/\/+/g, "/"); // remove duplicate slashes

  // --- Load file content ---
  let content = localStorage.getItem(filename) || "";

  // --------------------------
  // Pause terminal input
  // --------------------------
  if (terminal && terminal.input) {
    terminal.input.disabled = true;
    terminal.input.style.opacity = "0";
  }

  // --------------------------
  // Determine file type
  // --------------------------
  let fileType = "TXT";
  if (filename.endsWith(".js")) fileType = "JavaScript";
  else if (filename.endsWith(".html")) fileType = "HTML";
  else if (filename.endsWith(".css")) fileType = "CSS";
  else if (filename.endsWith(".py")) fileType = "Python";
  else if (filename.endsWith(".json")) fileType = "JSON";
  else if (filename.endsWith(".md")) fileType = "Markdown";
  else if (filename.endsWith(".xml")) fileType = "XML";
  else if (filename.endsWith(".sh")) fileType = "Shell Script";
  else if (filename.endsWith(".bat")) fileType = "Batch File";
  else if (filename.endsWith(".yml") || filename.endsWith(".yaml")) fileType = "YAML";
  else if (filename.endsWith(".c")) fileType = "C Source";
  else if (filename.endsWith(".cpp")) fileType = "C++ Source";
  else if (filename.endsWith(".h")) fileType = "C/C++ Header";
  else if (filename.endsWith(".java")) fileType = "Java";
  else if (filename.endsWith(".rb")) fileType = "Ruby";
  else if (filename.endsWith(".go")) fileType = "Go";
  else if (filename.endsWith(".rs")) fileType = "Rust";
  else if (filename.endsWith(".php")) fileType = "PHP";
  else if (filename.endsWith(".ts")) fileType = "TypeScript";
  else if (filename.endsWith(".tsx")) fileType = "TSX";
  else if (filename.endsWith(".jsx")) fileType = "JSX";

  // --------------------------
  // Load editor config
  // --------------------------
  let config = loadConfig();

  function loadConfig() {
    try {
      return JSON.parse(localStorage.getItem(configJSON)) || defaultConfig;
    } catch (e) {
      console.warn("Invalid editor config, using defaults.", e);
      return defaultConfig;
    }
  }

  function applyConfig() {
    // Wrapper
    Object.assign(editorWrapper.style, {
      backgroundColor: config.theme.backgroundColor,
      color: config.theme.textColor,
      fontFamily: config.font.family,
    });

    // Line numbers
    Object.assign(lineNumbers.style, {
      backgroundColor: config.theme.lineNumberBackground,
      color: config.theme.lineNumberColor,
      fontSize: config.font.size,
      lineHeight: config.font.lineHeight,
    });

    // Textarea
    Object.assign(textarea.style, {
      backgroundColor: config.theme.backgroundColor,
      color: config.theme.textColor,
      fontFamily: config.font.family,
      fontSize: config.font.size,
      lineHeight: config.font.lineHeight,
    });

    // Status bar
    Object.assign(statusBar.style, {
      backgroundColor: config.theme.statusBarBackground,
      color: config.theme.statusBarTextColor,
    });

    // Dimensions
    textarea.style.minHeight = config.dimensions.minHeight;
    textarea.style.maxHeight = config.dimensions.maxHeight;
    lineNumbers.style.maxHeight = config.dimensions.maxHeight;
    lineNumbers.style.minWidth = config.dimensions.lineNumberMinWidth;
  }

  // --------------------------
  // Editor wrapper
  // --------------------------
  const editorWrapper = document.createElement("div");
  Object.assign(editorWrapper.style, {
    border: "1px solid #555",
    margin: "8px 0",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    zIndex: 10,
  });

  const editorContainer = document.createElement("div");
  Object.assign(editorContainer.style, {
    display: "flex",
    position: "relative",
    alignItems: "stretch",
  });
  editorWrapper.appendChild(editorContainer);

  // Line numbers
  const lineNumbers = document.createElement("div");
  Object.assign(lineNumbers.style, {
    textAlign: "right",
    padding: "8px",
    userSelect: "none",
    overflow: "hidden",
  });
  editorContainer.appendChild(lineNumbers);

  // Textarea
  const textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.spellcheck = false;
  Object.assign(textarea.style, {
    flex: "1",
    width: "100%",
    padding: "8px",
    border: "none",
    outline: "none",
    resize: "none",
    overflowY: "auto",
  });
  editorContainer.appendChild(textarea);

  const updateLineNumbers = () => {
    const lines = textarea.value.split("\n").length;
    lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join("<br>");
  };
  textarea.addEventListener("input", updateLineNumbers);
  textarea.addEventListener("scroll", () => { lineNumbers.scrollTop = textarea.scrollTop; });
  updateLineNumbers();

  // Status bar
  const statusBar = document.createElement("div");
  let displayPath = filename.startsWith(currentPath) ? filename.slice(currentPath.length) : filename;
  statusBar.innerHTML = `<span style="background-color: rgba(95,0,163,1); padding-left:5px; padding-right:6px;">[${fileType}] ${displayPath}</span>  ^S Save  ^Q Quit  ^X Exit without Saving`;
  Object.assign(statusBar.style, {
    fontSize: "0.9em",
    padding: "4px 8px",
    borderTop: "1px solid #555",
    whiteSpace: "pre",
  });
  editorWrapper.appendChild(statusBar);

  applyConfig();

  // Add editor to container and focus
  commandContainer.appendChild(editorWrapper);
  textarea.focus();

  // Terminal input suppression
  const terminalInputDiv = document.querySelector(".terminal-type");
  if (terminalInputDiv) {
    terminalInputDiv.style.pointerEvents = "none";
    terminalInputDiv.style.userSelect = "none";
  }
  const terminalSuppressHandler = (event) => {
    if (document.activeElement !== textarea) {
      event.stopPropagation();
      event.preventDefault();
    }
  };
  commandContainer.addEventListener("keydown", terminalSuppressHandler, true);
  commandContainer.addEventListener("keypress", terminalSuppressHandler, true);
  commandContainer.addEventListener("keyup", terminalSuppressHandler, true);

  // Keep focus on textarea
  const focusTrap = () => textarea.focus();
  textarea.addEventListener("blur", focusTrap);

  // --------------------------
  // Save / Exit functions
  // --------------------------
  const saveFile = () => {
    content = textarea.value;
    localStorage.setItem(filename, content);
    print(`File "${filename}" saved.`);
    exitEditor();
  };

  const exitEditor = (withoutSaving = false) => {
    if (withoutSaving) print(`Exited "${filename}" without saving.`);
    textarea.removeEventListener("keydown", keyHandler);
    textarea.removeEventListener("blur", focusTrap);

    if (terminalInputDiv) {
      terminalInputDiv.style.pointerEvents = "";
      terminalInputDiv.style.userSelect = "";
      stop();
    }

    commandContainer.removeEventListener("keydown", terminalSuppressHandler, true);
    commandContainer.removeEventListener("keypress", terminalSuppressHandler, true);
    commandContainer.removeEventListener("keyup", terminalSuppressHandler, true);

    commandContainer.removeChild(editorWrapper);

    if (terminal && terminal.input) {
      terminal.input.disabled = false;
      terminal.input.style.opacity = "";
      terminal.input.focus();
    }
  };

  // --------------------------
  // Key handling
  // --------------------------
  const keyHandler = (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveFile();
    }
    if (event.ctrlKey && ["q", "x"].includes(event.key.toLowerCase())) {
      event.preventDefault();
      exitEditor(true);
    }
    if (event.ctrlKey && event.key.toLowerCase() === "r") {
      event.preventDefault();
      config = loadConfig();
      applyConfig();
      print("Editor config reloaded.");
    }
    if (event.key === "Enter") {
      const lines = textarea.value.split("\n");
      if (lines[lines.length - 1] === ":wq") {
        event.preventDefault();
        saveFile();
      }
    }
  };
  textarea.addEventListener("keydown", keyHandler);
}