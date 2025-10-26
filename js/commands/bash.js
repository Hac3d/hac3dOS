// commands/bash.js
// Executes bash-like scripts stored in localStorage using the terminal's run() function

export async function bashCmd({ print, run }, scriptname) {
  if (!scriptname) {
    print("Usage: bash <scriptname>");
    return;
  }

  const scriptContent = localStorage.getItem(scriptname);
  if (scriptContent === null) {
    print(`Script "${scriptname}" not found in localStorage.`);
    return;
  }

  // Split script into valid, non-empty, non-comment lines
  const commands = scriptContent
    .split("\n")
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("#"));

  for (let i = 0; i < commands.length; i++) {
    const line = commands[i];

    try {
      // Support quoted arguments — e.g. echo "hi there"
      const parsed = line.match(/(?:[^\s"]+|"[^"]*")+/g)?.map(arg => arg.replace(/^"|"$/g, "")) || [];

      // Reconstruct clean command string to pass into run()
      const cleanCommand = parsed.join(" ");

      // Execute via terminal.run() (await if async)
      const result = run(cleanCommand);
      if (result instanceof Promise) await result;

    } catch (err) {
      print(`bash: line ${i + 1}: error executing "${line}"`);
      print(`→ ${err.message}`);
    }
  }
}