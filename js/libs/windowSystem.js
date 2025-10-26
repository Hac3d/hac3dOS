// libs/windowSystem.js
// A library that creates a GUI window in the terminal session

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

export function windowSystem(print, commandContainer, start, stop, dispContent) {
  start();

  let content = dispContent;
  let config = loadConfig();

  function loadConfig() {
    try {
      return defaultConfig;
    } catch (e) {
      console.warn("Invalid editor config, using defaults.", e);
      return defaultConfig;
    }
  }

  function applyConfig() {
    Object.assign(editorWrapper.style, {
      backgroundColor: config.theme.backgroundColor,
      color: config.theme.textColor,
      fontFamily: config.font.family,
    });

    Object.assign(textarea.style, {
      backgroundColor: config.theme.backgroundColor,
      color: config.theme.textColor,
      fontFamily: config.font.family,
      fontSize: config.font.size,
      lineHeight: config.font.lineHeight,
    });

    textarea.style.minHeight = config.dimensions.minHeight;
    textarea.style.maxHeight = config.dimensions.maxHeight;
  }

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

  const textarea = document.createElement("div");
  textarea.innerHTML = content;
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

  applyConfig();
  commandContainer.appendChild(editorWrapper);
}