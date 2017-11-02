

<template>
  <el-upload
    ref="file"
  :action="uploadUrl"
  :data="uploadData"
    :before-upload="beforeUpload"
  with-credentials
  :on-success="handleSuccess">

    <!--:show-upload-list="false"-->
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
</template>

<script>
  import assets from 'assets'
  import {request} from 'utils'
  import config from 'config'
  export default {
    name: 'uploadImage',
    data() {
      return {
          serverUrl:request.serverUrl,
          token:request.getToken(),
          uploadData:{
              key:'',
              token:'',
          }
      }
    },
    props: {
      checkChange: Function,
      uploadType:{
        type: Object,
        default:() =>{
          return
        }
      },
        path:{
        type: String,
        default:() =>{
          return ''
        }
      },

      uploadUrl:{
        type: String,
        default:() =>{
          return config.uploadUrl
      }
      }
    },
      watch: {
          uploadType(val,old) {
              if(val,old){
                  this.uploadData.assign(val)
              }
          },

      },
    mounted() {
//        request.get(config.qntokenUrl,'',(data)=>{
//            this.uploadData.token =data.data;
//        })
    },
    methods: {
        beforeUpload(file){
//            this.uploadData.key = assets.M.fileName(file,this.path)
        },
      handleSuccess(response, file, fileList) {
        var date = file.response;
        if(date.code == 200){
          this.$message({
            showClose: true,
            message: '恭喜你，上传成功'
          });
          this.$emit('input',date.data[0]);
          this.$emit('checkChange',date.data[0])
        }
        this.$refs.file.clearFiles()
      }
    }
  }
</script>

<style scoped type="less">

</style>
