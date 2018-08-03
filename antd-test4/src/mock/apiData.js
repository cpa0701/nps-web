import Mock from 'mockjs'

Mock.setup({
    timeout: '1000'
});
Mock.mock("mock/test",{
    "usercode": "00000",
})
Mock.mock("mock/menuInfoController/qryMenu",{
    "menuData": [
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
                    children:[
                        {
                            menuName: '问卷申请',
                            menuUrl: '/system/domain',
                            menuId: 221,
                        },
                        {
                            menuName: '问卷审核',
                            menuUrl: '/system/dept',
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
            menuUrl: 'system',
            menuId: 7
        }
    ],
})