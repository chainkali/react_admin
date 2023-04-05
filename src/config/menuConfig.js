const menuList=[
    {
        title: '首页', // 菜单标题名称
        key: '/home', // 对应的path
        icon: 'home', // 图标名称
        isPublic: true, // 公开的
    },
    {
        title: '医护人员',
        key: '/person',
        icon: 'user'
    },
    {
        title: '核酸站点管理',
        key: '/naLocation',
        icon: 'home'
    },
    // {
    //     title: '实时核酸站点查询',
    //     key: '/实时核酸站点查询',
    //     icon: 'user'
    // },
    {
        title: '核酸记录',
        key: '/narecord',
        icon: 'user'
    },
    {
        title: '物资管理',
        key: '/goods',
        icon: 'medicine-box'
    },
    {
        title: '用户管理',
        key: '/user',
        icon: 'user'
    },
    {
        title: '管理员管理',
        key: '/manage',
        icon: 'safety',
    },

    // {
    //     title: '图形图表',
    //     key: '/charts',
    //     icon: 'area-chart',
    //     children: [
    //         {
    //             title: '柱形图',
    //             key: '/charts/bar',
    //             icon: 'bar-chart'
    //         },
    //         {
    //             title: '折线图',
    //             key: '/charts/line',
    //             icon: 'line-chart'
    //         },
    //         {
    //             title: '饼图',
    //             key: '/charts/pie',
    //             icon: 'pie-chart'
    //         },
    //     ]
    // },

]
export default menuList

