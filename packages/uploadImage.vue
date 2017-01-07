<template>
  <el-upload
    ref="file"
  :action="uploadUrl"
  :data="uploadType"
  with-credentials
  :on-success="handleSuccess">

    <!--:show-upload-list="false"-->
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
</template>

<script>
  import Lib from 'assets/Lib.js'
  export default {
    name: 'uploadImage',
    data() {
      return {
        uploadUrl:Lib.C.devServerURI+'/wechat/file/upload',
      }
    },
    props: {
      checkChange: Function,
      uploadType:{
        type: Object,
        default:() =>{
          return
        }
      }
    },
    mounted() {
    },
    methods: {
      handleSuccess(response, file, fileList) {
        var date = file.response;
        if(date.status && date.data){
          this.$message({
            showClose: true,
            message: '恭喜你，上传成功'
          });
          this.$emit('checkChange',date.data)
        }else {
          this.$message({
            type:'error',
            showClose: true,
            message: '上传失败'
          });
        }
        this.$refs.file.clearFiles()
      }
    }
  }
</script>

<style scoped>

</style>
