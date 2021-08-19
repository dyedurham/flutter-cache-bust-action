const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const replace = require('replace-in-file');

try {
    const hash = github.context.sha;
    const buildPath = core.getInput('build-path');
    const version = core.getInput('version');

    let filename;
    if (!version) {
        filename = `main-${hash}.dart.js`;
    } else {
        filename = `main-${version}.dart.js`;
    }

    const htmlPath = `${buildPath}/index.html`;
    const jsPath = `${buildPath}/main.dart.js`;
    const flutterServiceWorkerPath = `${buildPath}/flutter_service_worker.js`;

    fs.rename(jsPath, `${buildPath}/${filename}`, () => {
        console.log(`Renamed main.dart.js to ${filename}`);
    });

    const options = {
        files: [ htmlPath, flutterServiceWorkerPath ],
        from: /main\.dart\.js/,
        to: filename
    };
    replace(options).then(changedFiles => {
        console.log('Modified files: ', changedFiles.join(', '));
    });
} catch (error) {
    core.setFailed(error.message);
}