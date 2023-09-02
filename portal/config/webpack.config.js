const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const paths = require('./paths');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const {name: packageName} = require('../package.json');
// const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const dotenv = require('dotenv');
dotenv.config();

const version = process.env.APP_VERSION;

// public 文件目标目录
const publicPath = '/public';
// css 提取文件命名
const localIdentName = 'static/css/[path][name]__[local]--[hash:base64:5]';
const outputFileNameConstructor = (isEnvDevelopment) =>
    isEnvDevelopment
        ? 'static/js/[name].js'
        : 'static/js/[name].[contenthash:8].js';
const imageFileName = 'static/image/[name].[hash:8][ext]';

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const BaseCSSOptions = {sourceMap: false};

const getStyleLoaders = ({
    cssOptions = {},
    isEnvDevelopment,
    isEnvProduction,
}) => {
    const loaders = [];
    const mergeCSSOptions = {...BaseCSSOptions, ...cssOptions};

    isEnvDevelopment && loaders.push(require.resolve('style-loader'));
    isEnvProduction && loaders.push(MiniCssExtractPlugin.loader);

    return [
        ...loaders,
        {
            loader: require.resolve('css-loader'),
            options: mergeCSSOptions,
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sourceMap: BaseCSSOptions.sourceMap,
            },
        },
    ];
};

module.exports = () => {
    const isEnvDevelopment = process.env.NODE_ENV == 'development';
    const isEnvProduction = process.env.NODE_ENV == 'production';

    // 前端配置文件
    const publicConfigs =
        process.env.NODE_ENV == 'development'
            ? `portal-configs-dev.js`
            : `portal-configs-prod.js`;

    return {
        entry: paths.appJsConfig,
        output: {
            path: paths.appBuild,
            filename: outputFileNameConstructor(),
            publicPath: '/',
            chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
        },
        module: {
            rules: [
                {
                    test: cssRegex,
                    exclude: cssModuleRegex,
                    use: getStyleLoaders({
                        isEnvDevelopment,
                        isEnvProduction,
                        cssOptions: {
                            importLoaders: 1,
                        },
                    }),
                },
                {
                    test: cssModuleRegex,
                    exclude: cssModuleRegex,
                    use: getStyleLoaders({
                        isEnvDevelopment,
                        isEnvProduction,
                        cssOptions: {
                            modules: {
                                importLoaders: 1,
                                localIdentName: localIdentName,
                            },
                        },
                    }),
                },
                {
                    test: sassRegex,
                    exclude: sassModuleRegex,
                    use: [
                        ...getStyleLoaders({
                            isEnvDevelopment,
                            isEnvProduction,
                            cssOptions: {
                                importLoaders: 3,
                            },
                        }),
                        'sass-loader',
                    ],
                },
                {
                    test: sassModuleRegex,
                    use: [
                        ...getStyleLoaders({
                            isEnvDevelopment,
                            isEnvProduction,
                            cssOptions: {
                                importLoaders: 3,
                                modules: {
                                    localIdentName: localIdentName,
                                },
                            },
                        }),
                        'sass-loader',
                    ],
                },
                {
                    test: /\.less$/,
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'},
                        {
                            loader: 'less-loader',
                            options: {
                                lessOptions: {
                                    javascriptEnabled: true,
                                    modifyVars: {
                                        // 以下两个配置使用前提是必须在按需引入那里配置"style": true，否则不起作用，因为这里要是用less变量
                                        // @primary-color是设置antd的主题色，默认是蓝色的
                                        // @ant-prefix是自定义antd组件类名前缀的，需要配合<ConfigProvider prefixCls="portal-antd">使用
                                        '@ant-prefix': 'portal-antd', //只是改变打包css文件里面代码的前缀
                                    },
                                },
                            },
                        },
                    ],
                },
                // {
                //   test: /\.(png|jpg|jpeg|gif)$/,
                //   use: {
                //     loader: 'url-loader',
                //     options: {
                //       limit: 8 * 1024,
                //       name: imageFileName,
                //       esModule: false,
                //       outputPath: 'images',
                //     },
                //   },
                // },
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    type: 'asset',
                    //解析
                    parser: {
                        //转base64的条件
                        dataUrlCondition: {
                            maxSize: 8 * 1024, // 25kb
                        },
                    },
                    generator: {
                        //与output.assetModuleFilename是相同的,这个写法引入的时候也会添加好这个路径
                        filename: imageFileName,
                        //打包后对资源的引入，文件命名已经有/img了
                        // publicPath: '',
                    },
                    // 会有漏依赖情况出现，且项目中图片暂时不多，先不使用该功能
                    // use: [
                    //   {
                    //     loader: 'image-webpack-loader',
                    //     options: {
                    //       bypassOnDebug: true,
                    //     },
                    //   },
                    // ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'static/font/[name].[hash:8][ext]',
                    },
                    // use: {
                    //   loader: 'file-loader',
                    //   options: {
                    //     esModule: false,
                    //     outputPath: 'assets',
                    //   },
                    // },
                },
                {
                    test: /\.(mp3|mp4)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'static/music/[name].[hash:8][ext]',
                    },
                },
                {
                    test: /\.(gltf|obj|mtl)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'static/other/[name].[hash:8][ext]',
                    },
                },
                {
                    test: /\.svg$/,
                    use: ['@svgr/webpack'],
                },
                {
                    test: /\.(js|mjs|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true // node_modules/.cache/babel-loader
                        }
                    },
                },
                {
                    test: /\.(js|mjs|jsx|ts|tsx)$/,
                    include: [
                        path.resolve(__dirname, '../node_modules/@gwaapp'),
                    ],
                    use: {
                        loader: 'babel-loader',
                    },
                },
            ],
        },
        plugins: [
            new webpack.ProvidePlugin({
                process: 'process',
            }),
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            }),
            new InterpolateHtmlPlugin({
                PUBLIC_URL: publicPath,
                PUBLIC_CONFIGS: publicConfigs,
            }),
            new webpack.EnvironmentPlugin({
                APP_NAME: packageName,
                APP_VERSION: version,
                APP_COMPILE_TIME: new Date().toString(),
            }),
            new htmlWebpackPlugin({
                template: paths.appHtml,
                filename: 'index.html',
            }),
            // new CompressionPlugin({
            //     algorithm: 'gzip',
            //     test: new RegExp('\\.(js|css)$'),
            //     // threshold: 10240,
            //     // minRatio: 0.8, // default 0.8
            // }),
            // new ESLintPlugin({
            //     fix: true,
            //     // extensions: ['.js', '.ts', '.jsx', '.tsx'],
            // }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: paths.appPublic,
                        to: './public',
                        filter: async (resourcePath) =>
                            path.resolve(resourcePath) !== paths.appHtml,
                    },
                    {
                        from: paths.appChild,
                        to: './sub',
                    },
                ],
            }),
            new CleanWebpackPlugin(),
            // new MiniCssExtractPlugin({
            //   // Options similar to the same options in webpackOptions.output
            //   // both options are optional
            //   filename: 'static/css/[name].[contenthash:8].css',
            //   chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
            // }),
            // new WebpackManifestPlugin({
            //   fileName: 'asset-manifest.json',
            //   publicPath: publicPath,
            //   generate: (seed, files, entrypoints) => {
            //     const manifestFiles = files.reduce((manifest, file) => {
            //       manifest[file.name] = file.path;
            //       return manifest;
            //     }, seed);
            //     const entrypointFiles = entrypoints.main.filter((fileName) => !fileName.endsWith('.map'));

            //     return {
            //       files: manifestFiles,
            //       entrypoints: entrypointFiles,
            //     };
            //   },
            // }),
        ],
        resolve: {
            extensions: paths.moduleFileExtensions.map((ext) => `.${ext}`),
            alias: {
                '@': paths.appSrc,
                '@common': path.resolve(paths.appSrc, './common'),
                '@constant': path.resolve(paths.appSrc, './common/constant'),
                '@utils': path.resolve(paths.appSrc, './common/utils'),
                '@types': path.resolve(paths.appSrc, './common/types'),
                '@style': path.resolve(paths.appSrc, './common/style'),
                '@components': path.resolve(paths.appSrc, './components'),
                '@services': path.resolve(paths.appSrc, './services'),
                '@features': path.resolve(paths.appSrc, './features'),
            },
        },
    };
};
