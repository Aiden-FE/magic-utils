# mobile2
> 

- [mobile2](#projectname)
  - [Features](#features)
    - [主题使用](#主题使用)
    - [状态管理](#状态管理)
    - [网络请求](#网络请求)
    - [样式相关](#样式相关)
    - [SVG 使用](#svg-使用)
    - [Icon 使用](#icon-使用)
    - [国际化](#国际化)

## Features

### 主题使用

基于 [官方主题](https://uniapp.dcloud.net.cn/tutorial/darkmode.html) 方案实现,`theme.json`文件位于根目录

并支持添加'--<变量名>'的 key 来为页面绑定 CSS 变量以便实现动态主题相关

```vue
<script lang="ts" setup>
import { useThemeStore } from '@/stores';

const { currentThemeData } = storeToRefs(useThemeStore());

</script>

<template>
  <view class="app-examples" :style="currentThemeData">
    主题变量绑定在根即可
  </view>
</template>
```

### 状态管理

采用 [官方状态管理](https://uniapp.dcloud.net.cn/tutorial/vue3-pinia.html#%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86-pinia) 方案,该方案基于 pinia 而来.

创建一个新的状态管理可参考`src/stores/context.ts`文件,并在`src/stores/index.ts`中导出

业务中使用参考如下:

```vue
<script lang="ts" setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useContextStore } from '@/stores';

const { context } = storeToRefs(useContextStore());
const { updateContext } = useContextStore();

const usernameValue = ref('');
</script>

<template>
  <view class="app-examples">
    <h3>状态管理示例</h3>
    <view class="app-examples__content">
      <input v-model="usernameValue" style="border: 4rpx solid green;" placeholder="请输入用户名" />
      <button @click="updateContext({ userInfo: { username: usernameValue } })">点击更新用户名</button>
      <p style="font-size: 32rpx;">
        当前 username 是:
        <strong>
          {{ context?.userInfo?.username || '未设置用户名' }}
        </strong>
      </p>
    </view>
  </view>
</template>
```

### 网络请求

全局请求及响应拦截器位于`src/api/core.ts`内,可根据业务情况自行修改

定义一个请求方法可以参考`src/api/index.ts`内的geUserInfo实现

```typescript
/** 获取用户信息 */
export async function geUserInfo(): Promise<any> {
  return uni.request({
    method: 'POST',
    url: '/api/v1/user/info',
    // 可以在 meta 上追加自定义参数以便全局拦截器精确控制
    // meta: {},
  });
}
```

### 样式相关

默认支持 Scss 预处理样式,类命名建议遵循 [BEM](https://getbem.com/) 规范

移动端需要适配不同设备大小的元素建议 px 均换成 rpx 单位实现

详见 [官方说明](https://uniapp.dcloud.net.cn/tutorial/syntax-css.html#%E5%B0%BA%E5%AF%B8%E5%8D%95%E4%BD%8D)

如需在大屏上保持移动端展示态,可在`src/pages.json`中配置`globalStyle`的`maxWidth`即可,如设计稿为 750 宽度,可以配置为 750

### SVG 使用

项目内置了 [vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader) 支持.

svg 资源默认放在 `src/assets/svg` 文件夹下.

使用时如下:

```vue
<script setup>
import MyIcon from '@/assets/svg/arrow.svg'; // 默认会将svg资源以组件模式导入
import MyIconURL from '@/assets/svg/arrow.svg?url'; // 以url方式引用资源
import MyIconRaw from '@/assets/svg/arrow.svg?raw'; // 以原始xml标签方式引用资源
</script>

<template>
  <MyIcon />
  <img :src="MyIconURL" />
  <MyIconRaw />
</template>
```

### Icon 使用

项目内置了 [unplugin-icons](https://github.com/antfu/unplugin-icons), 请参考文档使用

所有 icon 支持自动导入,无需手动 import,类似如下方式直接使用即可:

在 https://icon-sets.iconify.design/ 可以直接搜索所有 icon 资源,antd 的 icon 也一样存在,建议优先选用 AntDesign 的 icon

更多用法参考 [unplugin-icons](https://github.com/antfu/unplugin-icons) 官方文档即可

```vue
<template>
  <i-ant-design-caret-down-outlined />
  <i-mdi-account />
  <i-fa-solid-dice-five />
  <i-heroicons-outline-menu-alt-2 />
  <i-ri-apps-2-line />
  <i-mdi-dice-d12 />
  <i-mdi-light-alarm />
  <i-noto-v1-flag-for-flag-japan />
  <i-ic-twotone-24mp />
  <i-mdi:cactus />
  <i-twemoji-1st-place-medal />
</template>
```

### 国际化

采用 [官方策略](https://uniapp.dcloud.net.cn/tutorial/i18n.html) 实现

在`src/locale`找到对应语言的 json 添加语言key,key 建议为可读的英文字符串.以便在不支持的语言环境默认展示可读内容.

语言表内添加 key 后,在业务中使用如下:

```vue
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <h3>I18n 国际化使用展示</h3>
  <view>{{ t('This is an example') }}</view>
</template>
```
