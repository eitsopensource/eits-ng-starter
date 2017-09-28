#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const semver = require('semver');
const colors = require('colors');

const filenames = process.argv.slice(2);
const release = '2017-01';
const starterFolder = `eits-ng-starter-${release}`;
const devStarterFolder = `eits-ng-starter-${release}-dev`;

const starter = JSON.parse(fs.readFileSync(path.resolve(__dirname, starterFolder, 'package.json')));
const starterDeps = Object.keys(starter.dependencies);
const devStarter = JSON.parse(fs.readFileSync(path.resolve(__dirname, devStarterFolder, 'package.json')));
const starterDevDeps = Object.keys(devStarter.dependencies);

filenames.forEach(filename => {
    console.log(`>> Atualizando arquivo "${filename}"...`.green);
    const packageDefinition = JSON.parse(fs.readFileSync(filename));

    if(typeof packageDefinition.dependencies === 'object') {
        if(packageDefinition.dependencies['@angular/core']) {
            if(!semver.intersects('^4.0.0', packageDefinition.dependencies['@angular/core'])) {
                console.error(`O arquivo "${filename}" depende de uma versão do angular anterior ao Angular 4 (${packageDefinition.dependencies['@angular/core']}). Por favor, atualize manualmente.`.red);
                return;
            }
        }

        Object.keys(packageDefinition.dependencies).filter(dep => starterDeps.includes(dep)).forEach(dep => {
            delete packageDefinition.dependencies[dep];
        });
    } else {
        console.warn(`O arquivo "${filename}" não possui um bloco de dependências.`.yellow);
        packageDefinition.dependencies = {};
    }

    console.log(`Adicionando dependência em ${starterFolder}@^${starter.version}`);
    packageDefinition.dependencies[starterFolder] = `^${starter.version}`;


    if(typeof packageDefinition.devDependencies === 'object') {
        Object.keys(packageDefinition.devDependencies).filter(dep => starterDevDeps.includes(dep)).forEach(dep => {
            delete packageDefinition.devDependencies[dep];
        });
    } else {
        console.warn(`O arquivo "${filename}" não possui um bloco de dependências de desenvolvimento.`.yellow);
        packageDefinition.devDependencies = {};
    }

    console.log(`Adicionando dependência de desenvolvimento em ${devStarterFolder}@^${devStarter.version}`);
    packageDefinition.devDependencies[devStarterFolder] = `^${devStarter.version}`;

    fs.unlinkSync(filename);
    fs.writeFileSync(filename, JSON.stringify(packageDefinition, null, 2));
});
