
/**资源管理器 */

export default class ResourcesManager {
    
    private _commonMap: string[] = [];
    private _resourcesMap:{[key: string]: number} = {};

    private static _instance: ResourcesManager = null;

    public static get Instance (): ResourcesManager{
        if(this._instance === null) {
            this._instance = new ResourcesManager();
        }
        return this._instance;
    }

    public loadCommonRes(progressCb, completeCb) {
        cc.resources.loadDir("./common", (finish: number, total: number, item) => {
            if(typeof progressCb == 'function') {
                progressCb(finish, total, item);
            }
        }, (error: Error, assets: Array<cc.Asset>) => {
            if(error) return;
            for(let i = 0; i < assets.length; i ++) {
                let asset = assets[i]; 
                if(asset && asset.loaded == true) {
                    let uuid: string = asset['_uuid'];
                    let objs: string[] = cc.assetManager.dependUtil.getDepsRecursively(uuid);
                    for(var idx in objs) {
                        let isExist = false; 
                        for(let idx2 in this._commonMap) {
                            if(this._commonMap[idx2] == objs[idx]) {
                                isExist = true; 
                                break; 
                            }
                        }
                        if(isExist) continue;
                        this._commonMap.push(objs[idx]); 
                    }
                }
            }
            console.log("公共资源数量", this._commonMap.length); 
            completeCb();
        });
    
    }

    public load_res(urls: string[], callback: Function) {
        var uuids = [];
        cc.resources.load(urls, (completedCount, totalCount, item) => {
            uuids.push(item.uuid);
        }, (error, resources) => {
            if(error) {
                cc.error("error: ", error);
                return
            }
            for(let obj of uuids) {
                if(obj in this._resourcesMap) {
                    this._resourcesMap[obj] ++; 
                }
                else {
                    this._resourcesMap[obj] = 1;
                }
            }
            callback();
        })
    }

    // 
    public load_res_uuid(resList: { [ url: string]: typeof cc.Asset }, progressCb, callback) {
        let uuids = [];
        for(let url in resList) {
            let res = cc.resources.getInfoWithPath(url, resList[url]);
            if(res) 
                uuids.push({ uuid: res.uuid});
        }
        cc.resources.load( uuids, progressCb, (err, data: []) => {
            if(err) return;
            let num = 0;
            for(let res of data) {
                let uuids2 = cc.assetManager.dependUtil.getDepsRecursively(res['_uuid']);
                num += uuids2.length;
                for(let obj of uuids2) {
                    if(obj in this._resourcesMap) {
                        this._resourcesMap[obj] ++; 
                    } else {
                        this._resourcesMap[obj] = 1;
                    }
                }
            }
            console.log("单次资源加载数量 ===>", num)
            callback();
        })
    }


    public load_single_res(url: string, type: typeof cc.Asset, callback: Function) {
        cc.resources.load(url, type, (error, res: cc.Asset) => {
            if(error) {
                console.log(error);
                return;
            };
            let uuid = res['_uuid']
            if(this._resourcesMap[uuid]) {
                this._resourcesMap[uuid] ++; 
            } else {
                this._resourcesMap[uuid] = 1;
            }
            callback(res);
        })
    }

    public releaseRes(path: string): void {
        let res = cc.resources.get(path);
        var objs = cc.assetManager.dependUtil.getDepsRecursively(res['_uuid']);
        console.log("释放路径:" + path + "相关引用数量:", objs.length)
        for(var obj of objs) {
            var isExist = false; 
            for(var i = 0; i < this._commonMap.length; i ++) {
                if(obj === this._commonMap[i]) {
                    isExist = true;  
                    break; 
                }
            }
            if(isExist == false) {
                this._resourcesMap[obj] --; 
                if(this._resourcesMap[obj] <= 0) {
                    delete this._resourcesMap[obj]; 
                    cc.resources.release(obj);
                }
            }
        }
    }

}
    

