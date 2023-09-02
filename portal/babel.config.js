module.exports = {
    presets: [
        '@babel/preset-react',
        '@babel/preset-typescript',
        '@babel/preset-env',
    ],
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-class-properties',
        [
            '@babel/plugin-transform-modules-commonjs',
            {
                strictMode: false,
            },
        ],
        [
            'import',
            {
                libraryName: 'antd',
                libraryDirectory: 'lib', // default: lib
                style: true,
                // style: function (name) {
                //   return `${name}/style/index.css`;
                // },
            },
        ],
        [
            'import',
            {
                libraryName: '@ant-design/icons',
                libraryDirectory: 'lib/icons',
                camel2DashComponentName: false,
            },
            '@ant-design/icons',
        ],
    ],
};
