import Http from '../common/Http';

class AuthorityService {
    // 获取权限树
    getAuthorityList=async (param)=>{
        var url = 'mock/systemController/Authority';
        return await Http.post(url,param);
    }

}

export default new AuthorityService();