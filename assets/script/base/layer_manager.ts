const { ccclass, property } = cc._decorator;
import ResourcesManager from "./resource_manager";
import BaseLayer from "./base_layer";
import { layer_config } from "./layer_config";

type Layer = {
    name: string;
    resList: string[];
    target: cc.Node;
}

/**层级管理器 */

@ccclass
export default class LayerManager extends cc.Component {

    private _layerList: Layer[] = [];
    private _isLoading: boolean = false;
    private _ResourcesManager: ResourcesManager = ResourcesManager.Instance;
    private _cacheLoadNode: cc.Node = null;

    private static _instance: LayerManager = null;
    public static get Instance(): LayerManager {
        if (this._instance == null) {
            this._instance = new LayerManager()
        }
        return this._instance;
    }

    /**打开层级（完善）*/
    openLayer(name: string, resList: { [url: string]: typeof cc.Asset } = {}, params: {} = null, isAnimation: boolean = false,) {
        if (!name) return;
        if (this._isLoading == true) return;
        this._isLoading = true;
        let starTime = new Date().getTime();
        for (let k in this._layerList) {
            let layer: Layer = this._layerList[k];
            if (name == layer.name) {
                console.log("layer is opened")
                this._isLoading = false;
                return;
            }
        }
        const config = layer_config[name];
        const url: string = config.url + config.name;
        if (!url) {
            console.error("layer can't find ....")
            this._isLoading = false;
            return;
        }
        let scene: cc.Scene = cc.director.getScene();
        let canvas: cc.Node = scene.getChildByName("Canvas");
        resList[url] = cc.Prefab;
        this._cacheLoadNode = this.addLoading();
        this._ResourcesManager.load_res_uuid(resList, () => { }, () => {
            let prefab: any = cc.resources.get(url, cc.Prefab);
            if (!prefab) {
                this._isLoading = false;
                this.removeLoading();
                console.log("load error...");
                return;
            }
            // this.hideAllLayer();
            let node = cc.instantiate(prefab);
            let bg = new cc.Node('bg');
            let l: Layer = { name: name, resList: Object.keys(resList), target: bg };
            let lb: BaseLayer = node.getComponent("base_layer");
            let endTime = new Date().getTime();
            this._layerList.push(l);
            this._isLoading = false;
            this.removeLoading();
            bg.width = cc.winSize.width;
            bg.height = cc.winSize.height;
            bg.addComponent(cc.BlockInputEvents)
            bg.addChild(node);
            lb._layerName = name;
            lb.initLayer(params);
            canvas.addChild(bg);
            console.log("打开层级耗时:", name, (endTime - starTime), "ms")
        });
    }

    /**添加loading */
    addLoading() {
        let n = null;
        if (this._cacheLoadNode) {
            n = this._cacheLoadNode;
        } else {
            let p = cc.resources.get('common/prefab/common_loading', cc.Prefab);
            n = cc.instantiate(p);
        }
        let scene: cc.Scene = cc.director.getScene();
        let canvas: cc.Node = scene.getChildByName("Canvas");
        if (n) {
            canvas.addChild(n);
        }
        return n;
    }

    /**移除loading */
    removeLoading() {
        if (this._cacheLoadNode) {
            this._cacheLoadNode.removeFromParent();
        }
    }

    /**获取层级 */
    getLayer(name: string): Layer {
        for (let idx in this._layerList) {
            let l = this._layerList[idx];
            if (name === l.name) {
                return l;
            }
        }
        return null;
    }

    /**获取层级基类 */
    getBaseLayer(name: string): BaseLayer {
        let layer: Layer = this.getLayer(name);
        if (layer) {
            let bg = layer.target;
            return bg.getChildByName(name).getComponent(BaseLayer);
        }
        return null;
    }


    /**关闭所有层级 */
    closeAllLayer() {
        for (var k in this._layerList) {
            var layer: Layer = this._layerList[k];
            var target = layer.target;
            target.removeFromParent();
            for (var k in layer.resList) {
                this._ResourcesManager.releaseRes(layer.resList[k]);
            }
        }
        this._layerList = [];
    }

    /**清理层级数据  */
    clear() {

    }

    /**
     * 层级中加载资源
     * @param name 层级的名字
     * @param urls 资源列表
     */
    loadRes(name: string, urls: string[], callback: Function) {
        let layer = this.getLayer(name);
        this._ResourcesManager.load_res(urls, () => {
            layer.resList = layer.resList.concat(urls);
            callback();
        })
    }

    /**加载制定类型的资源 */
    loadResByType(name: string, url: string, type: typeof cc.Asset, callback: Function) {
        let layer = this.getLayer(name);
        if (layer == null) {
            return;
        }
        this._ResourcesManager.load_single_res(url, type, (res) => {
            layer.resList = layer.resList.concat(url);
            callback(res);
        })
    }

    /**关闭层级 */
    closeLayer(name: string) {
        let layer: Layer = null,
            i: number = 0;
        for (i = 0; i < this._layerList.length; i++) {
            layer = this._layerList[i];
            if (name === layer.name) {
                this._layerList.splice(i, 1);
                console.log("close layer :", name)
                break;
            }
        }
        if (layer) {
            layer.target.destroy();
            for (var k in layer.resList) {
                this._ResourcesManager.releaseRes(layer.resList[k]);
            }
            console.log("close layer success ", layer.name);
        }
        // this.showEndLayer();
    }


    /**隐藏层级 */
    hideAllLayer() {
        this._layerList.forEach(v => {
            v.target.active = false;
        })
    }

    /**显示剩下的层级 */
    showEndLayer() {
        let len = this._layerList.length;
        if (len > 0) {
            this._layerList[len - 1].target.active = true;
        }
    }

}
