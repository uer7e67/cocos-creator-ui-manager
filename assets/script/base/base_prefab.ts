import BaseComponent from "./base_component";
import BaseLayer from "./base_layer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BasePrefab extends BaseComponent {

    _parent: BaseLayer = null;
    
}
