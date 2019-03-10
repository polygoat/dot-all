# **Run doT (JavaScript template engine) over all files in a directory, including their filenames**

This uses [doT.js](http://olado.github.io/doT/index.html) to walk through directories and parse all directory names, filenames, and file contents for doT templates with supplied data. See the [doT.js documentation](http://olado.github.io/doT/index.html) for more.

## Installation:
```bash
npm i -s dot-all
```


## Using `dotAll`:

```js
const dotAll = require('dotAll');

dotAll.renderDir('template_directory', {
  app: {
    name: "FlamingoApp"
  }
});

```

## Methods:
### `.renderDir(templateDirPath, data)`

The method `renderDir` walks through a directory and renders all files, directories, and filenames using doT. It takes two arguments: 
  
    `templateDirPath`   |     *String*    | "path/to/templates"
    `data`              |     *Object*    | { app: { name: "FlamingoApp" } }

### `.render(templateString, data)`

The method `render` takes a string and renders it using doT. 
It takes two arguments: 

    `templateString`    |     *String*    |   "Welcome to the {{_self.app.name}}!"
    `data`              |     *Object*    |   { app: { name: "FlamingoApp" } }

----

## Templates
Template tags are formed using two consecutive curly brackets and an underscore, and rely on `self` for data:

```html
<h1>{{_self.app.name}}</h1>
```
