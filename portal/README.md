# 说明

## 开发准备

### 安装vscode插件
1. Path Autocomplete
2. Prettier
3. vscode-fileheader 代码头快速注释
4. Todo Tree
5. Code Spell Checker

### 增加vscode配置(vscode/settings.json)
```
{
  ...
  "typescript.tsserver.pluginPaths": ["typescript-plugin-css-modules"],
}
```

## script命令

### `npm start`

运行开发模式
运行地址 [http://localhost:3000](http://localhost:3000).

### `npm run build`

代码打包

## 开发规范

1. TODO 代码注释规范, 后期会通过插件检查所有的TODO项
   ```
   // TODO: xxxxx


## 开发说明
1.  useSelector
```
  // 1. 默认useSelector会对返回值进行 === 比较

  // 2. 如果你要对页面中的多个状态值放到一个对象中返回, 需要使用如下方法, 以避免每次返回对象造成re-render
  const {isLogin} = useSelector((state: RootState) => ({isLogin: state[id].login.loading}), shallowEqual);
  // 请区分上下两种用法
  const isLogin = useSelector(state => state[id].login.loading);
  
  // 3. 写多个selector会造成多次re-render吗? 不会 react有默认的batch render行为

  // 4. 如果selector依赖于props
  const selectNumOfToTosWithIsDoneValue = createSelector(
    state => state.toTos,
    (_, isDone) => isDone,
    (toTos, isDone) => toTos.filter(todo => todo.isDone === isDone).length
  )

  export const TodoCounterForIsDoneValue = ({ isDone }) => {
    const NumOfToDosWithIsDoneValue = useSelector(state =>
      selectNumOfToDosWithIsDoneValue(state, isDone)
    )

    return <div>{NumOfToDosWithIsDoneValue}</div>
  }
```

2. API请求
```
    // 1. 不需要try...catch包裹, 框架会统一抓取接口调用错误
    const {data, code} = await fetchIndexPicListNoAuth();

    // 2. 需要判断业务正确
    if (code === '200' && data) {
      const tokens = data.map((v) => v.ipicFiletoken);

      const picsPathResponse = await fetchImageUrlMap(tokens);

      if (picsPathResponse.code === '200' && picsPathResponse.data) {
        const pics = data.map((pic) => {
          const {ipicFiletoken} = pic;

          return {...pic, src: picsPathResponse.data![ipicFiletoken] || ''};
        });

        dispatch(action.setLoginPics(pics));
      }
    } else {
      // 3. code !== '200' 的情况根据业务情况判断需不需要处理
       notification.error({
          message: '接口调用失败, 这可能是我参数调用的不对, 或者是业务上正常的逻辑失败.',
          description: msg || '',
        });
    }

```
