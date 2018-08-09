import Http from '../common/Http';

class DeptService {
    // 获取部门树
    getDeptTree = async (param) => {
        var url = 'mock/dept/getDeptTree';
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
    //获取员工数据
    getStaffData = async (param) => {
        var url = 'mock/dept/getStaffData';
        return await Http.post(url, param);
    }
    // 新增员工
    addStaff = async (param) => {
        var url = 'mock/dept/addStaff';
        return await Http.post(url, param);
    }
    //修改员工
    ediStaff = async (param) => {
        var url = 'mock/dept/ediStaff';
        return await Http.post(url, param);
    }
    //删除员工
    dleStaff = async (param) => {
        var url = 'mock/dept/dleStaff';
        return await Http.post(url, param);
    }
    // 获取角色树
    getRoleTree= async (param) => {
        var url = 'mock/dept/getRoleTree';
        return await Http.post(url, param);
    }
    // 新增角色
    addRole= async (param) => {
        var url = 'mock/dept/addRole';
        return await Http.post(url, param);
    }
    // 新增角色
    editAuthority= async (param) => {
        var url = 'mock/dept/editAuthority';
        return await Http.post(url, param);
    }
    // 删除角色
    dleRole= async (param) => {
        var url = 'mock/dept/dleRole';
        return await Http.post(url, param);
    }
    // 获取权限树
    getAuthorityTree= async (param) => {
        var url = 'mock/dept/getAuthorityTree';
        return await Http.post(url, param);
    }
    // 获取所有权限数据
    getAllAuthorityData= async (param) => {
        var url = 'mock/dept/getAllAuthorityData';
        return await Http.post(url, param);
    }
    // 更改部门
    changeDept= async (param) => {
        var url = 'mock/dept/changeDept';
        return await Http.post(url, param);
    }
}

export default new DeptService();
