<template>
    <div>
      <!-- 面包屑区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图区域 -->
      <el-card class="box-card">
        <el-table
          :data="rightLists"
          border
          style="width: 100%"
          stripe>
          <el-table-column
            type="index"
            label="#">
          </el-table-column>
          <el-table-column
            prop="authName"
            label="权限名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="path"
            label="路径">
          </el-table-column>
          <el-table-column
            prop="level"
            label="权限等级">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '0'">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
              <el-tag type="warning" v-else-if="scope.row.level === '2'">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 用户权限列表
      rightLists: []
    }
  },
  created () {
    // 获取权限列表
    this.getRightList()
  },
  methods: {
    // 获取权限列表
    async getRightList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.rightLists = res.data
    }
  }
}
</script>

<style>
.el-table td, .el-table th {
  text-align: center !important;
}
</style>

<style lang="less" scoped>

</style>
