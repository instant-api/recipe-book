# Instant Recipes Book API

> A CLI to create a small Todo List API

This package let you quickly create a small JSON API to

- Add a recipe
- List all recipes
- Update a recipe
- Delete a recipe
- List all tags
- List all recipes for a tag

It uses a single JSON file to store data.

## Why ?

The aim of this package is to provide an API for front-end exercices, allowing student to use an API without having to set on up themself.

## Who made this ?

Hi ! I'm Etienne, you can [follow me on Twitter](https://twitter.com/Etienne_dot_js) 😉

## Usage

```bash
npx @instant-api/recipe-book
```

## Options

- `--port` or `-p`: The port to use
- `--file` or `-f`: The path to the json file used to store data.

**Note**: By default the `file` is set to `recipe-book-db.json`.

```bash
npx @instant-api/recipe-book --port 9000 --file recipes.json
```

If you provide an argument with no name is will be used as the `file argument`

```bash
npx @instant-api/recipe-book --file recipes.json
```
