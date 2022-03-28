const { ccclass, property } = cc._decorator;
import LayerManager from "./layer_manager";
import BaseComponent from "./base_component";

@ccclass
export default class BaseLayer extends BaseComponent {
    public _layerName: string = null;
    private _LayerManager: LayerManager = LayerManager.Instance;
    protected _params = null;
    public _callback: Function = null;
    protected _resCache: { [name: string]: cc.Asset } = {};

    initLayer(params) {
        this._params = params;
    }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    /**缓存资源饮用 */
    cacheRes(url: string, type?: typeof cc.Asset) {
        if (!url) return;
        this._resCache[url] = cc.resources.get(url, type);
    }

    /**获取资源 */
    getCacheRes(url: string) {
        return this._resCache[url];
    }

    /**点击回掉 */
    onTouchEnd() {
        if (typeof this._callback == "function") {
            this._callback();
        }
        return;
    }

    onDestroy() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    closeLayer() {
        this._LayerManager.closeLayer(this._layerName);
    }

    // 关闭所有层级
    closeAllLayer() {
        this._LayerManager.closeAllLayer();
    }

    loadRes(resUrls: string[], callback: Function) {
        this._LayerManager.loadRes(this._layerName, resUrls, callback);
    }

    loadSingleRes(url: string, type: typeof cc.Asset, callback: Function) {
        this._LayerManager.loadResByType(this._layerName, url, type, callback);
    }

    /**加载英雄的头像 */
    loadHeroIcon(url: string, callback: (res: cc.SpriteFrame) => void) {
        this.loadSingleRes(url, cc.SpriteFrame, (res) => {
            if (res) {
                callback && callback(res);
            }
        })
    }


}
