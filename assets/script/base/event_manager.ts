
export default class EventManager {

    private static _instance: EventManager = null; 
    public static get Instance(): EventManager {
        if(this._instance == null) {
            this._instance = new EventManager();
        }
        return this._instance;
    }

    private _eventTarget: cc.EventTarget = new cc.EventTarget();

    emit(key: string, data: any){
        this._eventTarget.emit(key, data);    
    }

    on(key: string, callback: Function, target: any) {
        this._eventTarget.on(key, callback, target)
    }

    off(key: string, callback: Function, target: any) {
        this._eventTarget.off(key, callback, target)
    }

}
