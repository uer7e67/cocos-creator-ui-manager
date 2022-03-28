const Fs = require('fire-fs');
const Path = require('fire-path');

const assetsUrl = Path.join(Editor.Project.path, 'assets/resources/');
let layers = {};

// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
    // css style for panel
    style: `
        :host { margin: 5px; }
        h2 { color: #f90; }
    `,

    // html template for panel
    template: `
        <h4>layer_export</h4>
        <hr />
        <ui-button id="btn">导出层级</ui-button>
    `,

    // element and variable binding
    $: {
        btn: '#btn'
    },

    // method executed when template and styles are successfully loaded and initialized
    ready() {
        this.$btn.addEventListener('confirm', this.exportLayer.bind(this));
    },

    loadUrl(url = "") {
        let files = Fs.readdirSync(assetsUrl + url);
        for (let i = 0, len = files.length; i < len; i++) {
            let filename = files[i]
            let state = Fs.statSync(assetsUrl + url + "/" + filename);
            if (state.isDirectory()) {
                this.loadUrl(url + "/" + filename);
            }
            else {
                // panel 关键字的默认为层级文件
                if (filename && filename.indexOf("panel") != -1) {
                    if (filename.indexOf("item") === -1 &&
                        filename.indexOf(".meta") === -1) {
                        let path = url.substring(0);
                        let index = filename.indexOf(".");
                        filename = filename.substring(0, index);
                        layers[filename] = {
                            url: path + "/",
                            name: filename,
                            others: [],
                        }
                    }
                }
            }
        }
    },

    // 导出层级文件
    exportLayer() {
        this.loadUrl("prefab");
        Editor.log("层级文件数量:" + Object.keys(layers).length);
        let script_path = Path.join(Editor.Project.path, 'assets/script/base/');
        this.writeFile(script_path + "layer_config.ts", "export const layer_config =" + JSON.stringify(layers))
    },

    // register your ipc messages here
    messages: {
        'layer_export:hello'(event) {
            this.$label.innerText = 'Hello!';
        }
    },

    // 
    writeFile(filename, data) {
        Fs.open(filename, 'w', function (err, handle) {
            if (err) {
                return;
            }
            Fs.write(handle, data, function (e) {
                if (e) {
                    return;
                }
                Editor.log("导出成功...");
            });
        })
    }

});