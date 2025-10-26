// imports

import { createTXDEditor } from "./commands/txdEditor.js";
import { ListFilesInLocalStorage } from "./commands/ls.js";
import { packageCmd } from "./commands/package.js";
import { osfetch } from "./commands/osfetch.js";
import { catCmd } from "./commands/cat.js";
import { bashCmd } from "./commands/bash.js";
import { helloWorldProgram } from "./commands/hello.js";
import { getOSVersion, getSystemProps, printText, getShellPrompt } from "./libs/os.js";
import { SendError } from "./libs/errorHandler.js";
import { ChangeDirectory, MakeDirectory, RemoveItem } from "./libs/fs.js";
import { returnUserColors } from "./libs/loadConfig.js";

async function secureHash(str, algorithm = "SHA-256") {
  const textEncoder = new TextEncoder();
  const data = textEncoder.encode(str);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hexHash}`;
}

let BootHash = "";

secureHash(hashGen + getSystemProps + getOSVersion + ChangeDirectory + MakeDirectory + RemoveItem).then(hash => {
  BootHash = hash;
});

// terminal
async function hashGen() {
window.addEventListener("DOMContentLoaded", () => {
        document.querySelector("#terminal").innerHTML = `Downloading kernel v${getOSVersion("version")}...`;
        console.log(`Downloading kernel v${getOSVersion("version")}...`);
        returnUserColors();
        (setTimeout(() => {
            document.querySelector("#terminal").innerHTML = "";
            const terminal = ttty.initTerminal({
                host: document.querySelector("#terminal"),
                welcomeMessage: `
            <span class="textColorUserPref0">
            ▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀<br>
            Hac3dOS Kernel version ${getOSVersion("full")}.<br>
            Copyright (C) Hac3d ${getOSVersion("buildYear")}.<br>
            ▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀<br><br>
            SHA-256 ${BootHash}
            </span><br><br>
                `,
                prompt: `[${getSystemProps("username")}@${getSystemProps("hostname")}]# `,
                commands: {
                        echo: {
                            name: "echo", 
                            description: "the echo command",
                            argDescriptions: ["you cant echo nothing"],
                            func: ({ print }, argument) => { print(argument) } 
                        },
                        hello: {
                            name: "hello",
                            description: "a hello world program.",
                            func: helloWorldProgram
                        },
                        multiply: {
                            name: "multiply",
                            description: "Multiply two numbers",
                            noIndex: true,
                            argDescriptions: ["number one", "number two"],
                            func: ({ print }, one, two) => { print(Number(one) * Number(two)) }
                        },
                        clear: {
                        name: 'clear',
                        description: 'Clears the history',
                        func: ({ commandContainer }) => { commandContainer.innerHTML = '' }
                        },
                        uname: {
                            name: 'uname',
                            description: 'Displays system information',
                            func: ({ print }) => { print('Hac3dOS Kernel version 0.0.69 (main/electronjs)') }
                        },
                        whoami: {
                            name: 'whoami',
                            description: 'Displays the current user',
                            func: ({ print }) => { print('root') }
                        },
                        help: {
                            name: 'help',
                            description: 'Lists all available commands',
                        },
                        ls: {
                            name: 'ls',
                            description: 'Lists files in localStorage (supports -l and -a flags)',
                            func: ListFilesInLocalStorage
                        },
                        cd: {
                            name: 'cd',
                            description: 'changes the current directory',
                            func: ChangeDirectory
                        },
                        mkdir: {
                            name: 'mkdir',
                            description: 'creates a new directory',
                            func: MakeDirectory
                        },
                        cat: {
                            name: 'cat',
                            description: 'Displays the content of a file from localStorage',
                            argDescriptions: ['filename'],
                            func: catCmd
                        },
                        rm: {
                            name: 'rm',
                            description: 'Removes a file from localStorage',
                            func: RemoveItem
                        },
                        touch: {
                            name: 'touch',
                            description: 'Creates or updates a file in localStorage',
                            argDescriptions: ['filename', 'content'],
                            func: ({ print }, filename, ...content) => {
                                if (!filename) {
                                    print('Filename is required.');
                                    return;
                                }
                                localStorage.setItem(`/${filename}`, content.join(' '));
                                print(`File "${filename}" created/updated in localStorage.`);
                            }
                        },
                        bash: {
                            name: 'bash',
                            description: 'Executes a bash-like script stored in localStorage',
                            argDescriptions: ['scriptname'],
                            func: bashCmd
                        },
                        download: {
                            name: 'download',
                            description: 'Downloads a script from a URL and saves it to localStorage',
                            argDescriptions: ['url', 'filename'],
                            func: async ({ print }, url, filename) => {
                                if (!url || !filename) {
                                    print('URL and filename are required.');
                                    return;
                                }
                                try {
                                    const response = await fetch(url);
                                    if (!response.ok) {
                                        print(`Failed to download script from "${url}".`);
                                        return;
                                    }
                                    const scriptContent = await response.text();
                                    localStorage.setItem(filename, scriptContent);
                                    print(`Script downloaded from "${url}" and saved as "${filename}" in localStorage.`);
                                } catch (error) {
                                    print(`Error downloading script: ${error.message}`);
                                }
                            }
                        },
                        export: {
                            name: 'export',
                            description: 'Exports a file from localStorage to your computer',
                            argDescriptions: ['filename'],
                            func: ({ print }, filename) => {
                                if (!filename) {
                                    print('Filename is required.');
                                    return;
                                }
                                const content = localStorage.getItem(filename);
                                if (content === null) {
                                    SendError({
                                        print,
                                        terminal,
                                        errorType: "FileNotFound",
                                        errorDisplayName: filename,
                                        errorDetails: `'${filename}' does not exist in localStorage.`
                                    });
                                    return;
                                }
                                const blob = new Blob([content], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = filename;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                                print(`File "${filename}" exported to your computer.`);
                            }
                        },
                        // THE TXD EDITOR :fire: :fire: :fire:
                        txd: {
                        name: "txd",
                        description: "A simple text editor to create or edit files in localStorage",
                        argDescriptions: ["filename"],
                        func: createTXDEditor
                        },
                        // the package manager from hac3denv
                        package: {
                        name: "package",
                        description: "The package manager from hac3denv.",
                        func: packageCmd
                        },
                        // osfetch from hac3denv
                        osfetch: {
                        name: "osfetch",
                        description: "like neofetch, but for hac3denv.",
                        func: osfetch
                        }
                }
            });
            console.log("Kernel loaded into memory.");
            const inputs = document.querySelectorAll('input');

            inputs.forEach(input => {
            input.setAttribute('autocomplete', 'off')
            input.setAttribute('autocorrect', 'off')
            input.setAttribute('autocapitalize', 'off')
            input.setAttribute('spellcheck', false)
            })
            terminal.input.focus()
            window.hOSprompt = terminal.setPrompt;
            window.hOSexec = terminal.run;
            getShellPrompt();
            window.hFScurrentPath = "/";
        }, 1000));
});
}
hashGen();