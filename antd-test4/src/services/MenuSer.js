/**
 * Created by heChunXiong on 18/02/24.
 */
import Http from '../common/Http';

class MenuSer {
    //分页列表查询
    getMenuList = async (param)=>{
        //var url = 'protal/protalMenuController/qryMenuPage';
        var url = 'menuInfoController/qryMenu';
        return await Http.post(url,param);
    }

    //新增菜单
    addMenu = async (param) => {
        var url = 'protal/menuInfoController/addMenu';
        return await Http.post(url, param);
    }
     //删除菜单
    delMenu = async (param) => {
        //var url = 'protal/menuInfoController/delMenu';
        var url = 'protal/menuInfoController/delMenu';
        return await Http.post(url, param);
    }
     //批量删除菜单
    delAllMenu = async (param) => {
        var url = 'protal/menuInfoController/delAllMenu';
        return await Http.post(url, param);
    }
     //修改菜单
    EditorMenu = async (param) => {
        var url = 'protal/menuInfoController/editMenu';
        return await Http.post(url, param);
    }

    //分类管理列表
    getMenuCatyList = async (param)=>{
        var url = 'protal/menuCatyController/qryMenuCatyPage';

        return await Http.post(url,param);
    }
    //菜单类别列表
    getMenuCategoryList = async (param)=>{
        var url = 'protal/menuInfoController/qryMenuType';

        return await Http.post(url,param);
    }
    // 检查菜单分类编号
    checkMenuCatyNbr = async (param)=>{
        var url = 'protal/menuCatyController/checkMenuCatyNbr';
        return await Http.post(url,param);
    }
    //删除分类菜单
    delCatyMenu = async (param) => {
        var url = 'protal/menuCatyController/delMenuCaty';
        return await Http.post(url, param);
    }
    //批量删除菜单分类
    delAllMenuCaty = async (param) => {
        var url = 'protal/menuCatyController/delAllMenuCaty';
        return await Http.post(url, param);
    }
    //修改分类菜单
    EditorCatyMenu = async (param) => {
        var url = 'protal/menuCatyController/editMenuCaty';
        return await Http.post(url, param);
    }
    //新增分类菜单
    addCatyMenu = async (param) => {
        var url = 'protal/menuCatyController/addMenuCaty';
        return await Http.post(url, param);
    }

    //校正新增菜单编码的唯一性
    checkProtalMenuNbr = async (param) => {
        var url = 'protal/menuInfoController/checkProtalMenuNbr';
        return await Http.post(url, param);
    }

}
export default new MenuSer();
