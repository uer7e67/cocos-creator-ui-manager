'use strict';

const Fs = require('fire-fs');
const Path = require('fire-path');

module.exports = {
    load() {
        // execute when package loaded
    },

    unload() {
        // execute when package unloaded
    },

    // register your ipc messages here
    messages: {
        'open'() {
            // open entry panel registered in package.json
            Editor.Panel.open('layer_export');
        },
        'say-hello'() {
            Editor.log('Hello World!');
            // send ipc message to panel
            Editor.Ipc.sendToPanel('layer_export', 'layer_export:hello');
        }
    },
};