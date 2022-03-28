import { layer_config } from "./base/layer_config.js";
import LayerManager from "./base/layer_manager.js";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    onLoad() {
        LayerManager.Instance.openLayer(layer_config.start_panel.name)
    }

}
