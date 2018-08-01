import Http from '../common/Http';

class LoginService {

    //获取菜单
    getMenuList = async (param) => {
        var url = 'ISystemManageBO/queryAllMenuList.json';
        return await Http.post(url, param);
    }

}

export default new LoginService();
