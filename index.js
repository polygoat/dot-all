const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const doT = require('doT');

const __renderedDir = {};

const __globalData = new Proxy({
	NEWLINE: 	'\n',
	TAB: 		'\t',
}, {
    get(target, name, receiver) {
    	const rv = Reflect.get(target, name, receiver);
    	const def = Reflect.get(target, 'default', receiver);
    	if(_.isUndefined(rv)) return def || `{{_self.${name}}}`;
        return rv;
    }
});

doT.templateSettings.evaluate =    	/\{\{:([\s\S]+?)\}\}/g;
doT.templateSettings.interpolate = 	/\{\{_([\s\S]+?)\}\}/g;
doT.templateSettings.encode =      	/\{\{!([\s\S]+?)\}\}/g;
doT.templateSettings.use =         	/\{\{\+([\s\S]+?)\}\}/g;
doT.templateSettings.define =      	/\{\{\+\+\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g;
doT.templateSettings.conditional = 	/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g;
doT.templateSettings.iterate =     	/\{\{\*\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g;
doT.templateSettings.varname = 	 	'self';
doT.templateSettings.strip = 		true;
doT.templateSettings.append = 		true;
doT.templateSettings.selfcontained= false;

let __saveDir = function(dirs, targetPath) {
	_.each(dirs, structure => {
		if(typeof structure === 'object') {
			const targetFilePath = path.join(targetPath, structure.path);

			if(structure.isDirectory) {
				if(!fs.existsSync(targetFilePath)) {
					fs.mkdirSync(targetFilePath);
				}
				__saveDir(structure, targetPath);
			} else {
				fs.writeFileSync(targetFilePath, structure.content);
			}
		}
		
	});
}

const DotAll = {
	render(templateString, data) {
		_.extend(__globalData, data);
		return doT.template(templateString)(__globalData);
	},
	renderDir(sourcePath, data) {
		let templatePath = `${sourcePath}`;

		if(templatePath.indexOf('*') === -1) {
			templatePath = path.join(templatePath, '**');
		}

		glob.sync(templatePath).forEach(filePath => {
			if(filePath !== sourcePath) {
				filePath = path.resolve(filePath);

				const isDirectory = fs.lstatSync(filePath).isDirectory();
				let fileContent = '';

				__globalData.FILENAME = path.basename(filePath);
				__globalData.FILEPATH = path.dirname(filePath);
	
				if(!isDirectory) {
					fileContent = fs.readFileSync(filePath, 'utf8').replace(/[\n]/g,'{{_self.NEWLINE}}').replace(/\t/g,'{{_self.TAB}}');
					if(fileContent.indexOf('{{_') > -1 && fileContent.indexOf('}}') > -1) {
						fileContent = this.render(fileContent, data);
					}
				}

				if(filePath.indexOf('{{_') > -1) {
					filePath = this.render(filePath, data);
				}
				let storagePath = path.relative(sourcePath, path.resolve(filePath));
				storagePath = '["' + storagePath.replace(new RegExp('\\' + path.sep,'g'), '"]["') + '"]';

				_.set(__renderedDir, storagePath + '.content', fileContent);
				_.set(__renderedDir, storagePath + '.path', path.relative(sourcePath, path.resolve(filePath)));
				_.set(__renderedDir, storagePath + '.isDirectory', isDirectory);
			}
		});
		return this;
	},
	saveTo(targetPath) {
		__saveDir(__renderedDir, targetPath);
		return this;
	}
}

module.exports = DotAll;

/*** TEST: ***
DotAll.renderDir('test', {
	app: {
		targetDevice: 	'mobile',
		language: 		'de-DE',
		name: 			'Blahui'
	},
	actions: 			['hui','blui'],
	the_field: 			() => {},
	get_namespace: 		() => {},
	default: 			'unknown'
}).saveTo('test3');
/***/