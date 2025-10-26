# Hac3dOS Documentation
## Program Variables
In Hac3dOS, programs can use certain variables to interact with the terminal.

### All functions (ordered in most to least used in source)
| Name             | Function                                       |
| ---------------- | ---------------------------------------------- |
| print            | Prints to the terminal (in HTML)               |
| start            | Disables prompt and allows terminating with ^C |
| stop             | Enables the prompt and it's inputs.            |
| terminal         | Changes settings for the terminal.             |
| setPrompt        | Set's the prompts text.                        |
| run              | Runs a command like the terminal would.        |
| commandContainer | Gives the program the terminal's container     |

### Special uses for functions
The print command can use HTML to display text in the terminal.
This means that special styles/classes can be added.
There are classes to use in the text to colour them:

.textColorPink - #ff00afff
.textColorLighterPurple - #ef7fef
.textColorLightPurple - #a432a4
.textColorPurple - #5f00a3ff

.textColorGreen - #00cc00
.textColorGray - #696969
.textColorRed - #ff0000
.textColorYellow - #ffff00

.textColorCyan - #00ffff
.textColorWhite - #ffffff
.textColorBlue - #0000ff
.textColorBlack - #000000

.textColorUserPref - #a432a4 (default)
**textColorUserPref is set by the user!**

```
Created on: 2025-10-13 15:39
Last updated on: 2025-10-13 15:52
2025 Hac3d.
```
