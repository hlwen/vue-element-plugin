<template>
    <div ref="vueEditor">

    </div>
</template>
<script>
    //    import wangeditor from 'wangeditor'
    import assets from 'assets'
    import {request,getUrlParam} from 'utils'
    import config from 'config'
    module.exports = {
        name: "vueEditor",
        props: {
            value: {
                type: String,
                default: ""
            },
            path: {
                type: String,
                default: ""
            },
    },
        data() {
            return {
                html: '',
                editor:'',
                uploadData:{
                    key:'',
                    token:'',
                }
            }
        },
        watch: {
            value(val, old) {
                var html = this.editor?this.editor.txt.html():'';
                if (val != html && this.editor) {
                    this.editor.txt.html(val)
                }

            }

        },
        methods: {
            onchange(html) {
                this.$emit('input', html);
            },
            computeDashboardStyle() {
                this.dashboardStyle = {'max-height': this.$refs.content.clientHeight + 'px'}
            }
        },
        mounted() {
            let _this =this,wangeditor = require('wangeditor');
//                let e = this.$refs.vueEditor;
            this.editor = new wangeditor(this.$refs.vueEditor);

            //上传七牛获取qntoken
//            request.get(config.qntokenUrl,'',(data)=>{
//                this.uploadData.token =data.data;
//
//            });
//            require.ensure(['wangeditor'], function(require){




            this.editor.customConfig.onchange = this.onchange;
//            editor.customConfig.uploadImgParams = {
//                token: request.getToken()   // 属性值会自动进行 encode ，此处无需 encode
//            }
            this.editor.customConfig.uploadImgServer = config.uploadUrl;
            this.editor.customConfig.uploadFileName = 'file';
//            editor.customConfig.uploadImgHooks = {
//
//            }

            this.editor.create();
            this.editor.config.uploadImgParams ={};
            this.editor.config.uploadImgHooks={
                // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
                customInsert: function (insertImg, result, editor) {

                    if(result.key){
                        insertImg(config.qnDownloadUrl+ result.key +'?imageView2/2/w/1000/h/1000/q/100|imageslim')
                    }else {
                        alert('上传失败')
                    }
//                    var url = result.url


                },
                'before':(xhr, editor1, files) => {
                    _this.uploadData.key = assets.M.fileName(files[0],_this.path);
                    var formdata = new FormData();
                    formdata.append('file', files[0]);
                    formdata.append('token', _this.uploadData.token);
                    formdata.append('key', _this.uploadData.key);
                    // 跨域传 cookie
                    xhr.withCredentials = true;
                    xhr.send(formdata);
//                    editor.config.uploadImgParams = _this.uploadData
                    // 图片上传之前触发
                }
            }
            if (this.value) {
                this.editor.txt.html(this.value)
            }
//            });

        },

    }
</script>
