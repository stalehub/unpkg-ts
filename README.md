# Sorry-Nx

[![npm](https://img.shields.io/npm/v/@grnx/sx)](https://www.npmjs.com/package/@grnx/sx)
[![License](https://img.shields.io/github/license/gearonix/sorry-nx)](https://github.com/gearonix/sorry-nx)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/gearonix/sorry-nx)

[Sorry-Nx](github.com/gearonix/sorry-nx)  is a tiny alternative to the Nx Runner CLI, providing comprehensive task running capabilities.

It supports 4 package managers, dependency graphs, custom schemas, multitasking, and more.

The library seamlessly integrates with `package.json` scripts, making it a flexible choice for your project needs.

## Quick Features

- 🧨 Comprehensive TypeScript support
- 🤯 Faster task executions
- 🔢 Out-of-the-box support for npm, yarn, pnpm, and bun
- 💣 Custom configuration
- 🗿 Nx-like schemas (project.json)
- 🔥 Interactive mode
- 👍 Schema generation

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Sorry-Nx](#sorry-nx)
  - [Quick Features](#quick-features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [`sx` - Run Target](#sx---run-target)
  - [Interactive Mode](#interactive-mode)
    - [`sx run-many` - Run Multiple Commands](#sx-run-many---run-multiple-commands)
  - [`targets.json` - Schemas](#targetsjson---schemas)
    - [`sx migrate` - Migrate from package.json Scripts](#sx-migrate---migrate-from-packagejson-scripts)
    - [`sx show` - Show Workspace Projects](#sx-show---show-workspace-projects)
  - [Configuration](#configuration)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Installation

You can install [sorry-nx](github.com/gearonix/sorry-nx) via your preferred package manager:

```bash
# using pnpm
$ pnpm add -g @grnx/sx

# using yarn
$ bun install -g @grnx/sx

# using npm
$ npm install -g @grnx/sx
```

<br>

## Usage

### `sx` - Run Target

Execute a command defined in project targets or package.json scripts.

It automatically detects your package manager and is built on the workspaces pattern.

```bash
sx serve frontend

# npm run serve --workspace=frontend --silent
# yarn --silent workspace frontend run serve
# pnpm --filter=frontend run serve --silent
# cd ~/my-prj/frontend && bun run frontend --silent
```

For the root workspace:

```bash
sx serve

# with extra options
sx serve --parallel --envFile .env.development
sx serve --cwd ~/dsk/backend
```

<br>

## Interactive Mode

Running the command without arguments initiates the interactive mode, allowing you to select projects and commands to run.

```bash
sx # without arguments
```

### `sx run-many` - Run Multiple Commands

Run multiple targets and multiple projects. (similar to [nx/run-many](https://nx.dev/nx-api/nx/documents/run-many)).

```bash
sx run-many --parallel=3 projects=frontend,backend
sx run-many --parallel=10 exclude=backend
sx run-many --all
```

<br>

### `targets.json` - Schemas

Define custom configurations for each script, similar to Nx [project.json](https://nx.dev/reference/project-configuration).

Create a `targets.json` file in the root of each workspace.

```bash
.
+-- targets.json
`-- packages
   +-- frontend
   |   `-- targets.json
   `-- backend
       `-- targets.json
```

Example of `targets.json`

```json
{
  "build": "vite build",
  "preview": {
    "description": "Add description here",
    "commands": ["vite preview", "rimraf tmp/logs"],
    "args": "--host 127.0.0.1",
    "cwd": "packages/frontend",
    "parallel": true,
    "envFile": ".env.production"
  },
  "dev": {
    "command": "vite dev",
    "env": {
      "VITE_PORT": 3000
    }
  }
}
```

<br>

### `sx migrate` - Migrate from package.json Scripts

Generate a `targets.json` file from package.json scripts for the project. Works for all nested projects with the `all` flag.

```bash
sx migrate frontend
sx migrate --all # deep migration to targets.json
```

<br> 

### `sx show` - Show Workspace Projects

Display the dependency graph, structured on workspaces using any package manager.  

```bash
sx show
sx show --json # json format
```
```bash
# output
@nx/react-native - /home/grnx/hub/nx/packages/react-native
@nx/remix - /home/grnx/hub/nx/packages/remix
@nx/rollup - /home/grnx/hub/nx/packages/rollup
@nx/storybook - /home/grnx/hub/nx/packages/storybook
```


<br>


## Configuration

```ini
; .sxrc

preferredResolvingOrder[] = package-scripts
preferredResolvingOrder[] = targets

; default = targets.json
commandsFile = commands.json
```

Set a custom configuration file path:

```bash
# ~/.bashrc

export SX_CONFIG_FILE="$HOME/.sxrc"
```

For Windows:

```powershell
# Set a custom configuration file path in PowerShell accessible within the `$profile` path
$Env:SX_CONFIG_FILE = 'C:\to\your\config\location'
```

> **Contribution:** If you encounter any bugs, please submit an issue.
