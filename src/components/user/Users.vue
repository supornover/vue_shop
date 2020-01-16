<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            :clearable="true"
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加</el-button>
          <el-dialog
            title="添加用户"
            :visible.sync="dialogVisible"
            width="50%"
            @close="clearDialog"
          >
            <el-form :model="addList" :rules="addRules" ref="addForm" label-width="80px">
              <el-form-item label="用户姓名" prop="username">
                <el-input v-model="addList.username"></el-input>
              </el-form-item>
              <el-form-item label="用户密码" prop="password">
                <el-input v-model="addList.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addList.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="addList.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUserConfirm">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="管理人员"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="switchChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="openDelete(scope.row.id)"></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改用户的对话框-->
    <el-dialog
    title="修改用户信息"
    :visible.sync="diaVisible"
    width="50%"
    @close="editDialogClose">
    <el-form :model="editFormData" :rules="editFormDatarules" ref="editFormDataRefs" label-width="100px">
      <el-form-item label="用户ID" >
        <el-input v-model="editFormData.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="editFormData.email"></el-input>
      </el-form-item>
      <el-form-item label="用户手机号" prop="mobile">
        <el-input v-model="editFormData.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="diaVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogConfim">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机号
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前页面显示条数
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 添加用户框
      dialogVisible: false,
      // 修改用户框
      diaVisible: false,
      // 添加用户的表单数据
      addList: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 查询到的用户信息
      editFormData: {},
      // 添加用户的验证规则
      addRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户的验证规则
      editFormDatarules: {
        email: [
          { required: true, message: '请输入要修改的用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入要修改的用户手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取所有用户信息
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'warning',
          message: res.meta.msg
        })
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变时的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码改变时的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 修改用户状态的事件
    async switchChange (state) {
      console.log(state)
      const { data: res } = await this.$http.put(
        `users/${state.id}/state/${state.mg_state}`
      )
      if (res.meta.status !== 200) {
        state.mg_state = !state.mg_state
        return this.$message({
          type: 'error',
          message: '更新用户状态失败'
        })
      }
      this.$message({
        type: 'success',
        message: '更新用户信息成功'
      })
    },
    // 打开添加用户对话框
    addUser () {
      this.dialogVisible = true
    },
    // 重置对话框
    clearDialog () {
      this.$refs.addForm.resetFields()
    },
    // 添加用户事件
    addUserConfirm () {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        // 校验通过，发起请求
        const { data: res } = await this.$http.post('users', this.addList)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 查询单条用户信息
    async editDialog (id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editFormData = res.data
      this.diaVisible = true
    },
    // 修改用户事件
    editDialogConfim () {
      this.$refs.editFormDataRefs.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editFormData.id, {
          email: this.editFormData.email,
          mobile: this.editFormData.mobile
        })
        if (res.meta.status !== 200) return this.$message.error('修改用户失败')
        this.$message.success('修改用户信息成功')
        this.diaVisible = false
        this.getUserList()
      })
    },
    // 重置修改用户信息对话框
    editDialogClose () {
      this.$refs.editFormDataRefs.resetFields()
    },
    // 删除事件
    async openDelete (id) {
      const infor = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (infor !== confirm) {
        return this.$message.info('删除操作已取消')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
