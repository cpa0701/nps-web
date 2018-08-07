import Http from '../common/Http';

class SysRoleMgService {
  // 角色树查询
  qryRoleTree = async (param) => {
      let url = 'mock/system/rolesController/qryRolesTree';
      return await Http.post(url, param);
  };
  // 平台角色新增
  addRoles = async (param) => {
    let url = 'system/rolesController/addRoles';
    return await Http.post(url, param);
  };
  // 平台角色删除
  delRoles = async (param) => {
    let url = 'system/rolesController/delRoles';
    return await Http.post(url, param);
  };
  // 平台角色批量删除
  delAllRoles = async (param) => {
    let url = 'system/rolesController/delAllRoles';
    return await Http.post(url, param);
  };
  // 平台角色修改
  editRoles = async (param) => {
    let url = 'system/rolesController/editRoles';
    return await Http.post(url, param);
  };
  // 增加角色权限
  addRolePriv = async (param) => {
    let url = 'system/rolePrivController/addRolePriv';
    return await Http.post(url, param);
  };
  // 删除角色权限
  delRolePriv = async (param) => {
    let url = 'system/rolePrivController/delRolePriv';
    return await Http.post(url, param);
  }
}

export default new SysRoleMgService();
