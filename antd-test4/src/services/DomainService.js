/**
 * Created by chenPengAn on 18/03/07.
 */
import Http from '../common/Http';

class DomainService {
    // 获取区域树
    getDomainTree=async(param)=>{
        var url = 'mock/region/initRegionInfo';
        return await Http.post(url, param);
    }
    // 根据条件获取区域树
    getDomainTreeByPage=async(param)=>{
        var url = 'safe/region/initRegionInfoByPage';
        return await Http.post(url, param);
    }
    // 平台菜单批量删除
    DelDomain = async (param) => {
        var url = 'safe/region/deleteRegionInfo';
        return await Http.post(url, param);
    }

    // 平台菜单修改
    EdiDomain = async (param) => {
        var url = 'safe/region/updateRegionInfo';
        return await Http.post(url, param);
    }
     // 平台菜单新增
    AddDomain = async (param) => {
        var url = 'safe/region/addRegionInfo';
        return await Http.post(url, param);
    }
}

export default new DomainService();
