<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src='../assets/logo.png'/>
            </div>
            <div>
                <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginForm" :rules="loginrules">
                    <el-form-item prop="name">
                        <el-input prefix-icon="iconfont icon-f-user" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input prefix-icon="iconfont icon-f-password" v-model="loginForm.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item class="btns">
                        <el-button type="primary" @click="login">登陆</el-button>
                        <el-button type="info" @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginrules: {
        name: [
        //   { required: true, message: '用户名称不能为空', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetFrom () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          console.log('登录失败')
        }
        console.log('登录成功')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
    background-color: aqua;
    height: 100%;
}
.login_box{
    width: 450px;
    height:300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
    .avatar_box {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #eee;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50px;
            background-color: #eee;
        }
    }
}
.login_form {
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns {
    display: flex;
    justify-content: flex-end;
}

</style>
