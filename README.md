# **Run doT (JavaScript template engine) over all files in a directory, including their filenames**

This uses [doT.js](http://olado.github.io/doT/index.html) to walk through directories and parse all directory names, filenames, and file contents for doT templates with supplied data. See the [doT.js documentation](http://olado.github.io/doT/index.html) for more.

## Installation:
```bash
npm i -s dotall
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
----

## Methods:
### `.renderDir(templateDirPath, data)`

The method `renderDir` walks through a directory and renders all files, directories, and filenames using doT. It takes two arguments: 
  
argument name | data type | example
--- | --- | ---
*templateDirPath* | *String* | `"path/to/templates"`
*data* | *Object* | `{ app: { name: "FlamingoApp" } }`

### `.render(templateString, data)`

The method `render` takes a string and renders it using doT. 
It takes two arguments: 

argument name | data type | example
--- | --- | ---
*templateString* | *String* | `"Welcome to the {{_self.app.name}}!"`
*data* | *Object* | `{ app: { name: "FlamingoApp" } }`
----

## Templates
Template tags are formed using two consecutive curly brackets and an underscore, and rely on `self` for data:

```html
<h1>{{_self.app.name}}</h1>
```

Here's a list of automagically available properties of `self`:

**FILENAME**    Name of the currently processed file, e.g. _main.js_
**FILEPATH**    Path of the currently processed file, e.g. _C:\\_

### Loops
You can loop through arrays and objects using two curly brackets followed by an asterisk:

```html
<ul id="todo-list">
{{*todos :todo:index}}
    <li>{{_index}}.) {{_action}}</li>
{{*}}
</ul>
```

...combined with the following data:
```js
const = { 
    todos: ['Cleanup', 'Refactor', 'Package'] 
}; 
```

...yields this rendered template:
```html
<ul id="todo-list">
    <li>1.) Cleanup</li>
    <li>2.) Refactor</li>
    <li>3.) Package</li>
</ul>
```

### Fallback
If the data path specified in a template couldn't be found, dotAll looks for a key called `default` in the data you passed and renders it instead. If no `default` key is provided, dotAll leaves these template tags untouched.