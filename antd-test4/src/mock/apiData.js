import Mock from 'mockjs'


let serialize = (str1) => {
    if (str1 === '') {
        return {}
    }
    //修复 jquery.serialize() 会把空格转成'+'的坑
    let str = str1.replace(/\+/g, " ");
    let obj = {};
    let params = str.split('&');
    for (let i = 0; i < params.length; i++) {
        let val = params[i].split("=");
        //多选的select，在jquery.serialize()的时候名称都是相同的，如右：rules=1&rules=3
        //这个时候需要把值以数组的形式保存，如右：rules：[1,3]
        if (obj[val[0]]) {
            let arr = [];
            Object.prototype.toString.call(obj[val[0]]) === "[object Array]" ? arr = arr.concat(obj[val[0]]) : arr.push(obj[val[0]]);
            arr.push(unescape(val[1]));
            obj[val[0]] = arr;
        } else {
            obj[val[0]] = unescape(val[1])
        }
    }
    return obj
};
Mock.setup({
    timeout: '1000'
});

//登录
Mock.mock('mock/test', {
    'usercode': '00000',
})
//菜单
Mock.mock('mock/menuInfoController/qryMenu', {
    'menuData': [
        {
            menuName: '首页',
            icon: 'home',
            menuUrl: '/',
            menuId: 1
        },
        {
            menuName: '调研问卷管理',
            icon: 'form',
            menuUrl: '/nps',
            menuId: 2,
            children: [
                {
                    menuName: '题目管理',
                    menuUrl: '/nps/questionLibMgr',
                    menuId: 21,
                },
                {
                    menuName: '问卷管理',
                    menuUrl: '/nps/questionMgr',
                    menuId: 22,
                    children: [
                        {
                            menuName: '问卷申请',
                            menuUrl: '/nps/questionMgr',
                            menuId: 221,
                        },
                        {
                            menuName: '问卷审核',
                            menuUrl: '/nps/questionMgr',
                            menuId: 222,
                        },
                        {
                            menuName: '问卷库',
                            menuUrl: '/questionnaireLibrary',
                            menuId: 223,
                        }
                    ]
                }
            ],
        },
        {
            menuName: '调研任务管理',
            icon: 'table',
            menuUrl: 'list',
            menuId: 3,
            children: [
                {
                    menuName: '触发式调研任务申请',
                    menuUrl: 'table-list',
                    menuId: 31,
                },
                {
                    menuName: '调研任务申请',
                    menuUrl: 'basic-list',
                    menuId: 32,
                },
                {
                    menuName: '调研任务审核',
                    menuUrl: 'card-list',
                    menuId: 33,
                },
                {
                    menuName: '调研任务终止',
                    menuUrl: 'basic-list',
                    menuId: 34,
                },
                {
                    menuName: '周期性调研',
                    menuUrl: 'card-list',
                    menuId: 35,
                }
            ],
        },
        {
            menuName: '调研资源管理',
            icon: 'profile',
            menuUrl: 'profile',
            menuId: 4,
            children: [
                {
                    menuName: '调研资源规划',
                    menuUrl: 'basic',
                    menuId: 41,
                },
                {
                    menuName: '调研资源统计图',
                    menuUrl: 'advanced',
                    authority: 'admin',
                    menuId: 42,
                },
            ],
        },
        {
            menuName: '满意度运营分析',
            icon: 'check-circle-o',
            menuUrl: 'result',
            menuId: 5,
            children: [
                {
                    menuName: '调研结果分析',
                    menuUrl: 'success',
                    menuId: 51,
                }
            ]
        },
        {
            menuName: '客户忠诚度感知',
            icon: 'user',
            menuUrl: 'profile',
            menuId: 6,
            children: [
                {
                    menuName: '感知总视图',
                    menuUrl: 'basic',
                    menuId: 61,
                },
                {
                    menuName: '支局视图',
                    menuUrl: 'advanced',
                    authority: 'admin',
                    menuId: 62,
                },
                {
                    menuName: '用户视图',
                    menuUrl: 'basic',
                    menuId: 63,
                },
                {
                    menuName: '统计报表',
                    menuUrl: 'advanced',
                    authority: 'admin',
                    menuId: 64,
                },
            ],
        },
        {
            menuName: '系统管理',
            icon: 'setting',
            menuUrl: '/system',
            menuId: 7,
            children: [
                {
                    menuName: '部门人员管理',
                    menuUrl: '/system/dept',
                    menuId: 71,
                },
                {
                    menuName: '角色管理',
                    menuUrl: '/system/role',
                    menuId: 72,
                },
                {
                    menuName: '权限配置管理',
                    menuUrl: '/system/authority',
                    menuId: 73,
                },
                {
                    menuName: '区域管理',
                    menuUrl: '/system/domain',
                    menuId: 74,
                },
            ]
        }
    ],
})

//获取区域树
Mock.mock('mock/region/initRegionInfo', (params) => {
    let params1 = JSON.parse(params.body);
    if (!params1.rowId)
        return Mock.mock({
            'treeData|5': [{
                'rowId|+1': 1,
                'ideptId|+1': '@integer(1,1213123120)',
                'iDeptLevel': '2',
                'sdeptName': '@cname',
                'iParentId': '0',
                'sdispName': '/常规/',
                'spathId': '/0/412530/',
                'idomainId|+1': 1010001,
                'sDomainName': '@cname',
                'iSortIndex': '1',
                'iDeptType|+1': 1,
                'childCount': '2'
            }]
        })
    else {
        return Mock.mock({
            'treeData|2': [{
                'rowId|+1': params1.rowId * 10 + 1,
                'ideptId|+1': params1.ideptId * 10 + 1,
                'iDeptLevel': params1.iDeptLevel + 1,
                'sdeptName': '@cname',
                'iParentId': params1.rowId,
                'sdispName': '/常规/',
                'spathId': '/0/412530/',
                'idomainId|+1': params1.idomainId * 10 + 1,
                'sDomainName': '@cname',
                'iSortIndex': '1',
                'iDeptType|+1': 1,
                'childCount': '@integer(0,10)'
            }]
        })
    }
})
//获取角色树
Mock.mock('mock/system/rolesController/qryRolesTree', {
    "treeData": [
        {
            name: '角色树',
            key: '1',
            isParent: false,
            children: [
                {
                    name: '系统管理员',
                    key: '1.1',
                    isParent: true,
                    children: [
                        {
                            name: '角色A',
                            key: '1.1.1',
                            isParent: true,
                        },
                        {
                            name: '角色B',
                            key: '1.1.2',
                            isParent: true,
                        }
                    ]
                },
                {
                    name: '业务员',
                    key: '1.2',
                    isParent: true,
                    children: [
                        {
                            name: '角色C',
                            key: '1.2.1',
                            isParent: true,
                        },
                        {
                            name: '角色D',
                            key: '1.2.2',
                            isParent: true,
                        }
                    ]
                },
            ]
        }
    ]
})