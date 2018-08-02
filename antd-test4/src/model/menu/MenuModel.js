import {observable, action} from 'mobx';

class MenuModel {
    @observable collapsed = false;

    @observable menuInfos = [];

    @observable menuMaps = [];

    @action toggle = () => {
        this.collapsed = !this.collapsed;
    }

    @action setMenuInfos = (menuInfos) => {
        this.menuInfos = menuInfos;

        this.setMenuMap(menuInfos);
    }

    @action setMenuMap = (menuInfos) => {
        if (!menuInfos) {
            return;
        }
        for (let i = 0; i < menuInfos.length; i++) {
            let menu = menuInfos[i];
            this.menuMaps.push(menu);
            let children = menu.children;
            //递归
            this.setMenuMap(children);
        }
        return false;
    }
}

export default new MenuModel();
