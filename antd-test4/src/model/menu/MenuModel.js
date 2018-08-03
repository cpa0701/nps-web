import {observable, action} from 'mobx';

class MenuModel {
    @observable collapsed = false;

    @observable menuInfos = [];

    @observable menuMaps = {};

    @action toggle = () => {
        this.collapsed = !this.collapsed;
    }
    menuMapsList = {};
    @action setMenuInfos = (menuInfos) => {
        this.menuInfos = menuInfos;
        this.setMenuMap(menuInfos);
        this.menuMaps = this.menuMapsList;
    }

    @action setMenuMap = (menuInfos) => {
        if (!menuInfos) {
            return;
        }

        for (let i = 0; i < menuInfos.length; i++) {
            let menu = menuInfos[i];
            this.menuMapsList[menu.menuUrl]=menu.menuName;
            let children = menu.children;
            //递归
            this.setMenuMap(children);
        }
        return false;
    }
}

export default new MenuModel();
