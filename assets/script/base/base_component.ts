const {ccclass, property} = cc._decorator;
import EventManager from "./event_manager";

// 事件结构
type EvtType = {
    name: string;
    func: Function,
    obj: any,
}

@ccclass
export default class BaseComponent extends cc.Component {

    private _events: EvtType[] = [];
    private _cache: { [ nName: string ]: cc.Node } = {};   // 节点缓存

    initView(...args) {}

    refreshView(...args) {}

    listenEvent(evtName: string, callback: Function, target: any = null) {
        let evt: EvtType = { name: evtName, func: callback, obj: target}
        this._events.push(evt)
        EventManager.Instance.on(evtName, callback, target);
    }

    dispatchEvent(evtName: string, evtData: any) {
        evtName = evtName.toString();
        EventManager.Instance.emit(evtName, evtData);
    }

    onDestroy() {
        for(let i = 0; i < this._events.length; i ++) {
            this.removeEvent(this._events[i].name, this._events[i].func, this._events[i].obj)
        }
    }

    removeEvent(evtName: string, evtFunc: Function, target: any = null) {
        evtName = evtName.toString();
        EventManager.Instance.off(evtName, evtFunc, target);
    }
}
