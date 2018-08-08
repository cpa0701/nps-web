import Http from '../common/Http';

class Servicedomain {
    // 获取区域树
    getDomainList=async (param)=>{
        var url = 'mock/SystemController/doMain';
        return await Http.post(url,param);
    }

}

export default new Servicedomain();