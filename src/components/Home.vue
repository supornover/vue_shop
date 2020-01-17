<template>
    <el-container class="home-container">
      <!-- 头部区域-->
      <el-header>
          <div>
              <img src="../assets/heima.png" alt="黑马">
              <span>电商后台管理系统</span>
          </div>
          <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 中心区域-->
      <el-container>
        <!-- 侧边栏区域-->
        <el-aside :width="isCollapse? '64px': '200px'">
            <div class="toggle-button" @click="toggle"> | | | </div>
            <el-menu
      background-color="#333743"
      text-color="#fff"
      active-text-color="#ffd04b"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="activePath">
       <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span>
        </template>
        <el-menu-item-group>
        <!-- 二级菜单 -->
          <el-menu-item :index="'/'+child.path" v-for="child in item.children " :key="child.id"
          @click="saveStatus('/'+child.path)">
              <i class="el-icon-menu"></i>
             <span>{{child.authName}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
        </el-aside>
        <!-- 内容显示区域-->
        <el-main>
          <!--  路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      // 是否折叠
      isCollapse: false,
      // 激活状态
      activePath: ''
    }
  },
  created () {
    this.getAsideList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取侧边栏信息
    async getAsideList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.meta.message
        })
      }
      this.menuList = res.data
      console.log(res)
    },
    toggle () {
      this.isCollapse = !this.isCollapse
    },
    // 被激活的链接地址
    saveStatus (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
      display: flex;
      align-items: center;
      span {
          margin-left: 15px;
      }
  }
}
.el-aside{
  background-color: #333743;
  .el-menu {
      border-right: none;
      .el-submenu {
        background-color:  #333743;
      }
  }
}
.el-main{
  background-color: #eaedea;
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
