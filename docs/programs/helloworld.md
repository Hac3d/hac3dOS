# Hac3dOS Documentation
## Writing a simple "Hello, World" program and adding it to the terminal
First, you'll need to open a code editor and open the project's folder.

Create a new file under ``js/commands/hello.js`` where "hello" is it's name.

Secondly, you'll need to create an exported function with it's own name (not the filename you chose, but something unique. For example: ``helloWorld``)
Then passthrough the "print" variable. (For more information about variables, check out ``docs/system/variables.md``) This is what that would look like:
```js
export function helloWorld({ print }) {

}
```
Then add the print command with ``print("Hello, World.");``
This is what the final output would look like:

```js
export function helloWorld({ print }) {
  print("Hello, World.");
}
```
In order to actually run this command, you'll need to add it to the commands group in the terminal.

To do that you need to import the command into the ``boot.js`` script.

At the top of the script, add:

``import { helloWorld } from "./commands/hello.js";``

Then add the command in the commands group:
```js
commands: {
  hello: {
    name: "hello",
    description: "command description",
    func: helloWorld
  }
}
```
### Created on: 2025-10-13 15:15
### Last updated on: 2025-10-13 15:15
### 2025 Hac3d.
