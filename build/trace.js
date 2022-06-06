// run this file with: npm run trace

const fs = require('fs');
const path = require('path');
const { zip } = require('lodash');
const  { traceSvg, ensureDirectory } = require('./utils');

const INPUT_DIRECTORIES = [
    // relative to this file
    '../svg',
    '../node_modules/feather-icons/dist/icons',
// map to absolute
].map((relativeDirectory) => path.join(__dirname, relativeDirectory));

const OUTPUT_DIRECTORY = path.join(__dirname, '../traced');

function svgPathsFromDirectory(baseDirectory) {
    return fs.readdirSync(baseDirectory)
        .filter(f => f.endsWith('.svg'))
        .map((fileName) => path.join(baseDirectory, fileName));
}

function svgPathsFromDirectories(directories) {
    let allPaths = [];
    for (let directory of directories) {
        allPaths.push(...svgPathsFromDirectory(directory));
    }
    return allPaths;
}

function readFileToString(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error, contents) => {
            if (error) {
                reject(error);
            }
            resolve(contents);
        });
    });
}

function writeStringToFile(string, filePath) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, string, (error) => {
            if (error) {
                reject(error);
            }
            resolve();
        });
    });
}

function writeStringsToFiles(strings, filePaths) {
    const stringsToPaths = zip(strings, filePaths);
    return Promise.all(
        stringsToPaths.map(([string, filePath]) => writeStringToFile(string, filePath))
    );
}

function pathsToContents(paths) {
    return Promise.all(paths.map(item => readFileToString(item)));
}

function pathsToNames(paths) {
    return paths.map(item => path.basename(item));
}

function namesToPaths(names, destinationDirectory) {
    return names.map(name => path.join(destinationDirectory, name));
}

function contentsToTraced(contentsArray) {
    return Promise.all(contentsArray.map(contents => traceSvg(contents)));
}

(async () => {
    console.log(`Reading svg files from: ${INPUT_DIRECTORIES.join(', ')}`);
    const svgSourcePaths = svgPathsFromDirectories(INPUT_DIRECTORIES);
    const svgContents = await pathsToContents(svgSourcePaths);
    console.log(`Read ${svgContents.length} svg files, now tracing...`);
    const svgTracedContents = await contentsToTraced(svgContents);
    console.log(`Traced ${svgTracedContents.length} svg files, now writing to: ${OUTPUT_DIRECTORY}`);
    ensureDirectory(OUTPUT_DIRECTORY);
    const svgNames = pathsToNames(svgSourcePaths);
    const svgDestinationPaths = namesToPaths(svgNames, OUTPUT_DIRECTORY);
    await writeStringsToFiles(svgTracedContents, svgDestinationPaths);
    console.log('DONE!');
})();


