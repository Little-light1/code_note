/*
 * @Author: gxn
 * @Date: 2022-03-31 17:27:10
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-08-18 15:21:43
 * @Description: ambari
 */
/**
 * 前端配置文件
 * 注意:不要随意修改
 */

window.portalConfigs = {
    // 微应用配置
    microApps: [
        // 大数据平台
        {
            name: 'dataplat',
            entry: '//localhost:3001',
            activeRule: '/dataplat',
        },
        {
            name: 'am',
            entry: '//localhost:3002',
            activeRule: '/am',
        },
        {
            name: 'bi',
            entry: '//localhost:3003',
            activeRule: '/bi',
        },
        {
            name: 'apollo',
            entry: '//localhost:3004',
            // entry: '//10.15.9.45:3004',
            activeRule: '/apollo',
        },
        {
            name: 'outsource',
            entry: '//localhost:3005',
            activeRule: '/outsource',
        },
    ],

    // 排除框架劫持（这里虽然apollo相关的配置会通过ambari配置附带，但是这里还是冗余写，因为有可能会有现场直接通过pm2启动）
    excludeAssets: ['BI', 'sphm', 'sphm_standard', 'webroot', 'zeppelin', '.css', 'GDGS', 'GWJB'],

    // // 产品路由地址, 由于系统服务还没有路径配置, 所以这里对应冗余配置
    // // 这里的属性值一定要和产品的code匹配, 否则菜单不会出现
    // productsPath: {
    //   OC: {path: '/'},
    //   AM: {path: '/am'},
    //   BI: {path: '/bi'},
    //   DATAPLAT: {path: '/dataplat', index: '/dataplat/overview'},
    //   EDGE: {path: '/dataplat', index: '/dataplat/modelManage'},
    //   SPHM: {},
    // },

    // loadMicro

    // isScaling
    scalingUrls: [
        '/apollo/view/sphm/5yfgoD16dC3IxQul', // 模型管理
        '/apollo/view/sphm/KhG1L4UhckuNQiC0', // 任务管理
        '/apollo/view/sphm/C87Ydw4qRUXiq02b', // 大屏版首页
        '/apollo/view/sphm/PzEmrHJOUUchxWcT', // 健康度
        '/apollo/view/sphm/qiLWwdu7mQNLUZkq', // 完结率
        '/apollo/view/sphm/17fuC5geDSIK3lSt', // 准确率
        '/apollo/view/sphm/Kq9yjvgjfHrRPCHV', // 可视化分析
    ],
};

window.fdreConfig = {
    baseServiceUrl: '',
    fcBaseUrl: '',
    // bffSocketUrl: 'wss://localhost:3000/', // 开发环境
    // bffSocketUrl: 'wss://10.64.200.217:4899/', // 测试环境
    socketInitParams: {
        path: '/apollo_ws',
    },
    debug: true,
};

// ambari 默认配置
window.aappAmbariConfigs = {
    API_PLAT_URL: 'https://10.64.200.215:8387',
    THING_PLAT_URL: 'https://10.64.200.215:7000',
    ML_PLAT_URL: 'https://10.64.200.215:4001',
    SHOW_ML: 'true',
};

// 根据菜单名称动态配置菜单地址
window.linkProcessByName = {
    远程专家支持系统: (url) => {
        try {
            const {loginName} = JSON.parse(localStorage.getItem('userInfo'));
            return `${url}?name=${loginName}`;
        } catch (error) {
            return url;
        }
    },
};

// 标记Tab唯一值方法。（一个tab对应一份生命周期注册函数）
// 注意usePage的getUniquePath要和这个保持一致，否则生命周期函数触发会存在异常
window.getTabUniqueKey = {
    '/apollo/view/sphm/(.*)': ({pathname, search}) => pathname,
    '/apollo/view/sphm_standard/(.*)': ({pathname, search}) => pathname + search,
};

// 现场临时切换图片使用
window.systemPictures = {
    // logo: '/public/image/logo.svg',
    // name: '/public/image/systemName.svg',
    logo: '',
    name: '金风新能源智慧运营平台',
};
