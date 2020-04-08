一个React数据流的学习文件

主要是`Redux`、`Mobx`

### Redux

- `react-redux`
- `redux-thunk`
- `redux-promise`
- `redux-actions`
- `redux-saga`

### Mobx

- `react-mobx`

### 依赖

```npm
npm i react-router react-router-dom redux react-redux redux-thunk redux-promise redux-actions mobx mobx-react @babel/plugin-proposal-decorators -S
```

如果要在项目中使用装饰器（decorators）的写法，用于mobx，则需要安装和配置：

```npm
npm i @babel/plugin-proposal-decorators -S
```

在`package.json`文件中增加配置

```json
"babel": {
    "presets": [
      "react-app"
    ],
    "plugins": [
      [
        "@babel/plugin-proposal-decorators",
        {
          "legacy": true
        }
      ]
    ]
  }
```

