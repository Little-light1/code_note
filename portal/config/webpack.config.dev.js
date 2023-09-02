const path = require('path');
const os = require('os');
const {merge} = require('webpack-merge');
const commonConfigConstructor = require('./webpack.config');
const paths = require('./paths');
process.env.NODE_ENV = 'development';

// 开发环境
// apollo
const apollo_path = 'https://10.111.11.3:4899';
// ambari配置获取，一般直接转到线上的4000环境
// const ambari_config_path = 'http://10.64.200.215:4003';
const ambari_config_path = 'http://10.111.11.4:4003';
// const aapp_gateway_path = 'http://10.12.42.18:8888'; // 开发环境
// const aapp_gateway_path = 'https://10.64.200.219:8080'; // https开发环境
const aapp_gateway_path = 'http://10.12.64.82:8888'; // 标准测试环境-集群
//  const aapp_gateway_path = 'http://10.111.11.4:8888'; // 标准测试环境-单机
// const aapp_gateway_path = 'http://10.12.20.14:8888';  // 性能测试环境-集群
// const aapp_gateway_path = 'http://10.12.20.24:8888'; // 性能测试环境-单机
// const aapp_gateway_path = 'http://10.10.2.14:8888';  // 解绑挂帅
const finebi_path = 'http://10.64.200.109:37799';
const map_path = 'http://10.64.200.49:8844';
// const zeppelin_path = 'http://10.12.9.158:8811';
const zeppelin_path = 'https://10.12.9.158:8443';
const THING_PLAT_URL = 'http://10.12.9.159:27000';
const ml_config_path = 'http://10.64.200.220:8080';

const API_AM6_URL = 'http://222.130.23.101:8930';

// 测试环境
// apollo
// const apollo_path = 'https://10.64.200.217:4899';
// const aapp_gateway_path = 'http://10.64.200.218:8080';
// const finebi_path = "http://10.64.200.109:37799";

/**
 * 获取当前机器的ip地址
 */
function getIpAddress() {
    var ifaces = os.networkInterfaces();

    for (var dev in ifaces) {
        let iface = ifaces[dev];

        for (let i = 0; i < iface.length; i++) {
            let {family, address, internal} = iface[i];

            if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
                return address;
            }
        }
    }
}

const ipAddress = getIpAddress();

const webpackConfig = merge(commonConfigConstructor(), {
    mode: 'development',

    devtool: 'inline-source-map',

    // 使用webpck-dev-server时配置
    devServer: {
        compress: false, //启用压缩后，资源请求时间变长
        server: 'https',
        http2: false,
        historyApiFallback: true,
        hot: true,
        open: true,
        port: 3000,
        // clientLogLevel: "error", // none, error, warning 或者 info
        // contentBase: paths.appBuild,
        // publicPath: './js',
        // contentBase: './',
        // host: '0.0.0.0', //如果你想让你的服务器可以被外部访问,配置'0.0.0.0'
        // inline: true, // todo  缺少浏览器路由会报错
        // noInfo: true,
        // progress: true,
        // quiet: true,
        // useLocalIp: true,
        headers: {
            'Real-Client-IP': ipAddress,
        },
        proxy: {
            '/aapp-api/': {
                target: aapp_gateway_path,
                pathRewrite: {
                    '^/aapp-api': '',
                },
                secure: false,
                changeOrigin: true,
            },
            '/aapp_socket': {
                target: `ws://${aapp_gateway_path.split('//')[1]}/`,
                pathRewrite: {
                    '^/aapp_socket': 'aapp/websocket',
                },
                ws: true,
                secure: false,
                changeOrigin: true,
            },
            // 获取ambari配置
            '/aapp-config/': {
                target: ambari_config_path,
                pathRewrite: {
                    '^/aapp-config': '',
                },
                secure: false,
            },
            // 大数据平台接口代理
            '/dataplat-api/': {
                target: aapp_gateway_path,
                pathRewrite: {
                    '^/dataplat-api': '',
                },
                secure: false,
            },

            // --------------apollo--------------↓
            '/api': {
                target: apollo_path,
                secure: false,
            },
            '/apollo_ws': {
                target: `${apollo_path}/`,
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/apollo_ws': 'socket.io',
                },
                secure: false,
            },
            '/apolloImgCache': {
                target: apollo_path,
                secure: false,
            },
            '/npm_packages': {
                target: apollo_path,
                secure: false,
            },
            '/sphm': {
                target: apollo_path,
                secure: false,
            },
            '/BI': {
                target: apollo_path,
                secure: false,
            },
            '/sphm_standard': {
                target: apollo_path,
                secure: false,
            },
            '/GWJB': {
                target: apollo_path,
                secure: false,
            },
            '/proxy/map': {
                target: map_path,
                pathRewrite: {
                    '^/proxy/map': '',
                },
            },
            // 操作模型下发代理地址
            '/proxy/apollo': {
                target: apollo_path,
                pathRewrite: {
                    '^/proxy/apollo': '/apollo',
                },
                secure: false,
            },
            // sphm导入、导出服务地址
            '/proxy/sphm': {
                target: aapp_gateway_path,
                pathRewrite: {
                    '^/proxy/sphm': '',
                },
            },
            // --------------apollo--------------↑

            // --------------finebi--------------↓
            '/finebi': {
                target: finebi_path,
                changeOrigin: true,
                pathRewrite: {
                    '^/finebi/.*/webroot': '/webroot',
                },
            },
            '/webroot': {
                target: finebi_path,
                changeOrigin: true,
            },
            // --------------finebi--------------↑

            // --------------即席查询（zeppelin）--------------
            '/zeppelin': {
                target: zeppelin_path,
                changeOrigin: true,
                ws: true,
                secure: false,
            },
            // --------------即席查询（zeppelin）--------------

            // // --------------美林AI (组态化探索)--------------
            // '/gateway': {
            //   target: ml_config_path,
            //   changeOrigin: true,
            //   ws: true,
            //   secure: false,
            // },

            // '/meilin': {
            //   target: ml_config_path,
            //   changeOrigin: true,
            //   ws: true,
            //   secure: false,
            //   pathRewrite: {
            //     '^/meilin': '',
            //   },
            // },
            // '/portal': {
            //   target: ml_config_path,
            //   changeOrigin: true,
            //   ws: true,
            //   secure: false,
            // },
            // // --------------美林AI (组态化探索)--------------

            // --------------物联接--------------
            '/thingContent': {
                target: THING_PLAT_URL,
                changeOrigin: true,
                pathRewrite: {
                    '^/thingContent': '',
                },
            },
            '/am6/': {
                target: API_AM6_URL,
                pathRewrite: {
                    '^/am6': '',
                },
                secure: false,
                changeOrigin: true,
            },
            // --------------物联接--------------
            debugger: true,
        },

        // https: true
        // headers: {
        //   "X-Custom-Foo": "bar",
        // },
    },
});

module.exports = webpackConfig;
