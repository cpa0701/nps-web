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
            name: '首页',
            icon: 'home',
            path: '/',
            id: 1
        },
        {
            name: '调研问卷管理',
            icon: 'form',
            path: '/nps/surveyQstnaire',
            id: 2,
            children: [
                {
                    name: '题目管理',
                    path: '/questionLibMgr',
                    id: 21,
                },
                {
                    name: '问卷管理',
                    path: 'questionMgr',
                    id: 22,
                    children:[
                        {
                            name: '问卷申请',
                            path: 'questionnaireFor',
                            id: 221,
                        },
                        {
                            name: '问卷审核',
                            path: 'questionnaireReview',
                            id: 222,
                        },
                        {
                            name: '问卷库',
                            path: 'questionnaireLibrary',
                            id: 223,
                        }
                    ]
                }
            ],
        },
        {
            name: '调研任务管理',
            icon: 'table',
            path: 'list',
            id: 3,
            children: [
                {
                    name: '触发式调研任务申请',
                    path: 'table-list',
                    id: 31,
                },
                {
                    name: '调研任务申请',
                    path: 'basic-list',
                    id: 32,
                },
                {
                    name: '调研任务审核',
                    path: 'card-list',
                    id: 33,
                },
                {
                    name: '调研任务终止',
                    path: 'basic-list',
                    id: 34,
                },
                {
                    name: '周期性调研',
                    path: 'card-list',
                    id: 35,
                }
            ],
        },
        {
            name: '调研资源管理',
            icon: 'profile',
            path: 'profile',
            id: 4,
            children: [
                {
                    name: '调研资源规划',
                    path: 'basic',
                    id: 41,
                },
                {
                    name: '调研资源统计图',
                    path: 'advanced',
                    authority: 'admin',
                    id: 42,
                },
            ],
        },
        {
            name: '满意度运营分析',
            icon: 'check-circle-o',
            path: 'result',
            id: 5,
            children: [
                {
                    name: '调研结果分析',
                    path: 'success',
                    id: 51,
                }
            ]
        },
        {
            name: '客户忠诚度感知',
            icon: 'user',
            path: 'profile',
            id: 6,
            children: [
                {
                    name: '感知总视图',
                    path: 'basic',
                    id: 61,
                },
                {
                    name: '支局视图',
                    path: 'advanced',
                    authority: 'admin',
                    id: 62,
                },
                {
                    name: '用户视图',
                    path: 'basic',
                    id: 63,
                },
                {
                    name: '统计报表',
                    path: 'advanced',
                    authority: 'admin',
                    id: 64,
                },
            ],
        },
        {
            name: '系统管理',
            icon: 'setting',
            path: 'result',
            id: 7
        }
    ],
})