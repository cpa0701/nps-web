import { observable } from "mobx";

class MenuModel {
    @observable collapsed = false;
}
export default new MenuModel();