# net-cloud-music
仿网易云音乐

## 运行方法
1. 下载代码`git clone `
2. `cd net-cloud-music`
3. `npm install`
4. `npm run serve`

## 更改主题的逻辑
> 最后这个功能没有写完，只写了初步的实现，准备直接换vue3了
 1. 创建一个全局的状态管理器，用于存储当前的主题模式
 2. 在App.vue当中监听主题的变化，动态修改根元素的class名字
 3. 自定义一个组件，用于切换主题模式
 4. 在入口文件main.js当中引入全局样式，加入两个不同的class
 5. 在全局文件当中写上class的内容