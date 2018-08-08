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

//获取部门树
Mock.mock('mock/dept/initDeptTree', (params) => {
    let params1 = JSON.parse(params.body);
    if (!params1.rowId)
        return Mock.mock({
            'treeData|5': [{
                'rowId|+1': 1,
                'ideptId|+1': 12131,
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
//判断部门唯一性
Mock.mock('mock/dept/checkDeptName', (params) => {
    let params1 = JSON.parse(params.body);
    return Mock.mock({
        'result': {
            'code': 0
        }
    })
})
//新增部门
Mock.mock('mock/dept/addDept', (params) => {
    let params1 = JSON.parse(params.body);
    return Mock.mock({
        'result': {
            'code': 0
        }
    })
})
//删除部门
Mock.mock('mock/dept/dleDept', (params) => {
    let params1 = JSON.parse(params.body);
    return Mock.mock({
        'result': {
            'code': 0
        }
    })
})
//编辑部门
Mock.mock('mock/dept/ediDept', (params) => {
    let params1 = JSON.parse(params.body);
    return Mock.mock({
        'result': {
            'code': 0
        }
    })
})

//编辑部门
Mock.mock('mock/dept/getStaffData', (params) => {
    let params1 = JSON.parse(params.body);
    return Mock.mock({
        'dataList': [
            {
            "rowId": "1",
            "iRecCount": "3",
            "totalCount": "3",
            "RN": "1",
            "dBirthday": null,
            "dEntryDate": null,
            "sOutEmail": null,
            "cCDMA": "18122038821",
            "sPHS": null,
            "iKnowledge": "0",
            "iPubAccount": "2",
            "sRemark": null,
            "dAvailBeginDate": "2012-10-01 00:00:00.0",
            "dAvailEndDate": "2040-10-19 23:59:59.0",
            "iStaffId": "211033",
            "iDeptId": "2306575",
            "iTitleId": "-1",
            "iDomainId": "1010001",
            "sStaffNo": "1",
            "sStaffName": "nocjktest",
            "sTelphone": "18122038821",
            "sMobile": "18122038821",
            "sInEmail": null,
            "sFaxCode": null,
            "sDispName": "/常规/集团NOC/集团北京NOC/",
            "sDomainName": "集团",
            "sStaffAccount": "nocjktest",
            "iSex": "1",
            "sValid": "有效",
            "sSex": "男",
            "iDelFlag": "正常",
            "sTitleName": null,
            "iIsSynch": "0",
            "iLeaderId": null,
            "sLeaderName": null,
            "sLeaderAccount": null
        }, {
            "rowId": "2",
            "iRecCount": "3",
            "totalCount": "3",
            "RN": "2",
            "dBirthday": null,
            "dEntryDate": null,
            "sOutEmail": null,
            "cCDMA": null,
            "sPHS": null,
            "iKnowledge": "0",
            "iPubAccount": "2",
            "sRemark": null,
            "dAvailBeginDate": "2018-08-01 00:00:00.0",
            "dAvailEndDate": "2018-08-24 23:59:59.0",
            "iStaffId": "1748300853",
            "iDeptId": "412530",
            "iTitleId": "-1",
            "iDomainId": "1010001",
            "sStaffNo": "123",
            "sStaffName": "123",
            "sTelphone": null,
            "sMobile": null,
            "sInEmail": null,
            "sFaxCode": null,
            "sDispName": "/常规/",
            "sDomainName": "集团",
            "sStaffAccount": "123",
            "iSex": "1",
            "sValid": "有效",
            "sSex": "男",
            "iDelFlag": "待修改密码",
            "sTitleName": null,
            "iIsSynch": null,
            "iLeaderId": null,
            "sLeaderName": null,
            "sLeaderAccount": null
        }, {
            "rowId": "3",
            "iRecCount": "3",
            "totalCount": "3",
            "RN": "3",
            "dBirthday": null,
            "dEntryDate": null,
            "sOutEmail": null,
            "cCDMA": null,
            "sPHS": null,
            "iKnowledge": "0",
            "iPubAccount": "2",
            "sRemark": null,
            "dAvailBeginDate": "2018-07-03 00:00:00.0",
            "dAvailEndDate": "2018-07-31 23:59:59.0",
            "iStaffId": "1748300840",
            "iDeptId": "412530",
            "iTitleId": "1748300843",
            "iDomainId": "1010001",
            "sStaffNo": "1314",
            "sStaffName": "李亚会",
            "sTelphone": null,
            "sMobile": null,
            "sInEmail": null,
            "sFaxCode": null,
            "sDispName": "/常规/",
            "sDomainName": "集团",
            "sStaffAccount": "lyh",
            "iSex": "1",
            "sValid": "失效",
            "sSex": "男",
            "iDelFlag": "待修改密码",
            "sTitleName": "牛逼的职位",
            "iIsSynch": null,
            "iLeaderId": null,
            "sLeaderName": null,
            "sLeaderAccount": null
        }],
        'pageInfo':{
            'totalRow':'@integer(1,500)',
            'pageNum':10,
            'pageIndex':'@integer(1,50)'
        }
    })
})
//获取部门页面角色树
Mock.mock('mock/dept/getRoleTree', (params) => {
    let params1 = JSON.parse(params.body);
    if (!params1.rowId)
        return Mock.mock({
            'treeData|5': [{
                'rowId|+1': 1,
                'ideptId|+1': 12131,
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
                'ideptId|+1': params1.rowId * 10 + 1,
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
//获取部门页面权限树
Mock.mock('mock/dept/getAuthorityTree', (params) => {
    let params1 = JSON.parse(params.body);
    if (!params1.rowId)
        return Mock.mock({
            'treeData|5': [{
                'rowId|+1': 1,
                'ideptId|+1': 12131,
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
                'rowId|+1': params1.rowId * 100 + 1,
                'ideptId|+1': params1.rowId * 10 + 1,
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
            key: '0',
            isParent: false,
            children: [
                {
                    name: '系统管理员',
                    key: '1.1',
                    isParent: true,
                    parentId: '0',
                    children: [
                        {
                            name: '角色A',
                            key: '1.1.1',
                            isParent: true,
                            parentId: '1.1',
                        },
                        {
                            name: '角色B',
                            key: '1.1.2',
                            isParent: true,
                            parentId: '1.1',
                        }
                    ]
                },
                {
                    name: '业务员',
                    key: '1.2',
                    isParent: true,
                    parentId: '0',
                    children: [
                        {
                            name: '角色C',
                            key: '1.2.1',
                            isParent: true,
                            parentId: '1.2',
                        },
                        {
                            name: '角色D',
                            key: '1.2.2',
                            isParent: true,
                            parentId: '1.2',
                        }
                    ]
                },
            ]
        }
    ]
})
//区域管理
Mock.mock("mock/SystemController/doMain",{
    "domainData" : [
        {
            key: 1,
            name: '区域树',
            type: '省',
            id: '',
            No:'1',
            'children': [{
                key: 11,
                name: '集团',
                'type|1': [1, 2, 3],
                'id|1': [1, 2, 3],
                No:'2',
                'children|3': [
                    {
                        key: "@natural(1,10000)",
                        name: '@cname',
                        'type|1': [1, 2, 3],
                        'id|1': [1, 2, 3],
                        No: "@natural(1,10000)",
                    }],
            }]
        },{
            key: 12,
            name: '重保域',
            type: '本地网',
            id: 'ZB',
            No:'5'
        }],

})
//获取用户表数据
Mock.mock('mock/system/rolesController/getUserDate', {
    "userData": [
        {
            id: 1,
            userName: '张三',
            deptName: '综合管理',
            create: '人事1'
        },
        {
            id: 2,
            userName: '李四',
            deptName: '研发部',
            create: '人事2'
        },
        {
            id: 3,
            userName: '王五',
            deptName: '财务',
            create: '人事1'
        }
    ]
})