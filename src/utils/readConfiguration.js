'use strict';

const _ = require('lodash');
const nconf = require('nconf');

const clearUndefined = require('./index').clearUndefined;

const defaults = require.resolve('../config/defaults.json');
const config = require.resolve('../config/config.json');


module.exports = function readConfiguration(argv) {
    nconf.defaults(require(config));
    nconf.overrides(require(defaults));
    let library = nconf.get('library');
    let parseFunc;
    switch (library) {
        case 'hawk':
            parseFunc = parseHawk;
            break;
        default:
            break;
    }
    return parseFunc(nconf.get(library), argv);
}

function parseHawk(config, argv) {
    let argvOptions = parseArgv(argv);
    let opt =  _.defaultsDeep({}, argvOptions, {options: config}, {
        module: nconf.get('library'),
        origin: nconf.get('origin'),
        port: nconf.get('port'),
        prefix: nconf.get('prefix'),
    });
    return clearUndefined(opt);
}

function parseArgv(argv) {
    let commands = argv._;
    return clearUndefined({
        port: argv.port,
        origin: argv.origin,
        prefix: argv.prefix,
        options: clearUndefined({
            id: argv['hawk-id'],
            key: argv['hawk-key'],
            algorithm: argv['hawk-algorithm'],
        }),
    });
}