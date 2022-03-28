export default class TempManager {
    private static _instance: TempManager = null;
    public static get Instance(): TempManager {
        if (this._instance == null) {
            this._instance = new TempManager();
        }
        return this._instance;
    }

    /**文件缓存 */
    private _tempCache: { [key: string]: cc.JsonAsset } = {};

    /**获取模板文件 */
    public getTemp<T>(key: string): Array<T> {
        if (this._tempCache[key]) {
            return this._tempCache[key].json;
        }
    }

    /**加载模版 */
    public loadTempByName(name: string, completeFunc: Function) {
        cc.resources.load("./temp/" + name, cc.JsonAsset, (err, res: cc.JsonAsset) => {
            if (err) return;
            this._tempCache[name] = res;
            completeFunc();
        });
    }

    /**加载本地模板 */
    public localLoad(progressFunc: Function, completeFunc: Function) {
        cc.resources.loadDir(
            "./temp",
            (completedCount, totalCount) => {
                if (progressFunc) {
                    progressFunc(completedCount, totalCount);
                }
            },
            (err, assets: [any]) => {
                if (err) {
                    console.log("error ====>", err);
                } else {
                    for (let idx in assets) {
                        let item = assets[idx];
                        this._tempCache[item.name] = item;
                    }
                }
                if (typeof completeFunc == "function") {
                    console.log("模板文件加载成功，数量", assets.length);
                    completeFunc(err);
                }
            }
        );
    }
}
