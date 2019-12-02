# 使用说明

##1. 安装nodejs
* [安装地址](https://nodejs.org/dist/v10.16.0/node-v10.16.0-x64.msi) 
* 安装过高的版本可能安装不了node依赖，建议控制在v10版本
##2. 开发ide工具
* webstorm
##3. 安装yarn
* 全局安装yarn(nodejs包管理器) 安装命令 npm -g i yarn
##4. 安装bower
* 全局安装bower(前端包管理器)   安装命令 npm -g i bower
##5. 安装node依赖
* 安装命令 yarn
##6. 安装bower依赖
* 安装命令 bower install
##7. 目录结构(src目录)
* favicon  网站图标
* images 图片
* layouts 公共html
* pages 页面
* vendors 第三方组件、bower依赖安装目录
* scripts js脚本
* styles  css样式
##8. 引入公共html
* 使用@@include标签引入，需要使用相对路径。[参考](src/pages/home.html)
##9. 引入js,css,image
* 引入js,css,image等静态资源需要以src作为跟目录引入，并且在路径前加入##。[参考](src/pages/home.html)
##10. 命令
* 开发模式 yarn run dev
* 产品模式 yarn run prod
* 上传服务器 yarn run publish
* 打包并发布 yarn run release

