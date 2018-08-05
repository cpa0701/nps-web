import {observable, action} from 'mobx';
import en from '../../locales/en';
import zh from '../../locales/zh-CN';

class i18nModel {
    wordLists = {
        'en': en,
        'zh-cn': zh
    }
    @observable locale = (localStorage.getItem('locale') ? localStorage.getItem('locale') : (navigator.language || navigator.browserLanguage).toLowerCase());

    @observable outputLocale = this.wordLists[this.locale];

    @action changeLocale(value) {
        this.locale = value;
        this.outputLocale = this.wordLists[value];
    }
}

export default new i18nModel();
