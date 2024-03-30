# Realtime Custom CSS, for Firefox
Real-time changes for Firefox custom CSS.

## Usage
0. You have to install [Deno](https://deno.com).

1. Clone this repo
2. Run command:
```sh
deno run -A main.ts custom.css
```

### Options
```sh
deno run -A main.ts [CSS Path] (--port={port})
```

## Limitations
- An error may occur when moving the directory because the client file is read in a relative path.
- This project is in beta.
