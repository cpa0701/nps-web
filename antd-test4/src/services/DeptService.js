import Http from '../common/Http';

class DeptService {
    // 获取部门树
    getDeptTree = async (param) => {
        var url = 'mock/dept/initDeptTree';
        return await Http.post(url, param);
    }
    //校验部门名唯一性
    checkDeptName = async (param) => {
        var url = 'mock/dept/checkDeptName';
        return await Http.post(url, param);
    }
    // 新增部门
    addDept = async (param) => {
        var url = 'mock/dept/addDept';
        return await Http.post(url, param);
    }
    //修改部门
    ediDept = async (param) => {
        var url = 'mock/dept/ediDept';
        return await Http.post(url, param);
    }
    //删除部门
    dleDept = async (param) => {
        var url = 'mock/dept/dleDept';
        return await Http.post(url, param);
    }
    //删除部门
    getStaffData = async (param) => {
        var url = 'mock/dept/getStaffData';
        return await Http.post(url, param);
    }
    // 获取角色树
    getRoleTree= async (param) => {
        var url = 'mock/dept/getRoleTree';
        return await Http.post(url, param);
    }
    // 获取权限树
    getAuthorityTree= async (param) => {
        var url = 'mock/dept/getAuthorityTree';
        return await Http.post(url, param);
    }
}

export default new DeptService();
