// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseLayer from "../base/base_layer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends BaseLayer {
    
    initLayer(params: any): void {
        
    }
    
}
