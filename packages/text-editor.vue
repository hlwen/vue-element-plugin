<style lang="less">
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
</style>

<template>
    <div  v-loading="loading">
        <!--<Card shadow>-->
            <textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
        <!--</Card>-->
        <!--<Spin fix v-if="spinShow">-->
            <!--<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>-->
            <!--<div>加载组件中...</div>-->
        <!--</Spin>-->
    </div>
</template>

<script>
    import tinymce from 'tinymce';
    export default {
        name: 'textEditor',
        data () {
            return {
                loading:false,
                spinShow: true
            };
        },
        methods: {
            init () {
               let _this = this;
               let url = '/public/upload';
                tinymce.PluginManager.add('uploadimage', function (editor) {

                    function selectLocalImages() {
                        let dom = editor.dom;
                        let f = document.createElement("form");
                        f.style.display ='none';
                        document.body.appendChild(f);
                        let i = document.createElement("input");

                        i.type = "file";
                        i.name = "thumbnail";
                        i.multiple = "multiple";
                        i.accept = "image/jpg,image/jpeg,image/png,image/gif";

                        f.appendChild(i);

                        i.onchange=function (e) {
                            var fileObj = e.target.files; // js 获取文件对象
                            var form = new FormData(); // FormData 对象
                            for(let j=0;j<fileObj.length;j++){
                                form.append("mf"+j, fileObj[j]); // 文件对象
                            }
                            let xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
                            xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
                            xhr.onload = uploadComplete; //请求完成
                            xhr.onerror =  uploadFailed; //请求失败
//                            xhr.upload.onprogress = progressFunction;//【上传进度调用方法实现】
                            xhr.upload.onloadstart = function(){//上传开始执行方法
                                _this.loading =true;
//                                ot = new Date().getTime();   //设置上传开始时间
//                                oloaded = 0;//设置上传开始时，以上传的文件大小为0
                            };
                            xhr.send(form); //开始上传，发送form数据
                        }
                        //上传成功响应
                        function uploadComplete(evt) {
                            //服务断接收完文件返回的结果
                            if(this.statusText == ("OK"||"ok")){
                                let data =JSON.parse(this.responseText)
                                if (data && data.code ==200) {
                                    editor.focus();
                                    data.data.forEach(function (src) {
                                        editor.selection.setContent(dom.createHTML('img', {src: src}));
                                    })
                                    alert("上传成功！");
                                }
                            }

                            _this.loading =false;

                        }
                        //上传失败
                        function uploadFailed(evt) {
                            alert("上传失败！");

                            _this.loading =false;
                        }
                        //取消上传
                        function cancleUploadFile(){
                            xhr.abort();
                        }
                        i.click()
                    }

                    editor.addCommand("mceUploadImageEditor", selectLocalImages);

                    editor.addButton('uploadimage', {
                        icon: 'image',
                        tooltip: '上传图片',
                        onclick: selectLocalImages
                    });

                    editor.addMenuItem('uploadimage', {
                        icon: 'image',
                        text: '上传图片',
                        context: 'tools',
                        onclick: selectLocalImages
                    });
                });
                this.$nextTick(() => {
                    let vm = this;
                    var height = document.body.offsetHeight - 300;
                    tinymce.init({
                        selector: '#tinymceEditer',
                        branding: false,
                        elementpath: false,
                        height: height,
                        language_url:'https://qiniu.tlty.org/tinymce/zh_CN.js',
                        language: 'zh_CN',
                        menubar: 'edit insert view format table tools',
                        plugins: [
                            'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                            'searchreplace visualblocks visualchars code fullpage',
                            'insertdatetime media nonbreaking save table contextmenu directionality',
                            'emoticons paste textcolor colorpicker textpattern imagetools codesample uploadimage'
                        ],
                        toolbar1: ' newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample uploadimage',
                        autosave_interval: '20s',
                        image_advtab: true,
                        table_default_styles: {
                            width: '100%',
                            borderCollapse: 'collapse'
                        },
                        images_upload_credentials: true,
                        automatic_uploads: false,
                        file_browser_callback_types: 'file image media',
                        upload_image_url: '/upload/cloud', //配置的上传图片的路由
                        images_upload_handler: function (blobInfo, success, failure) {
                            var xhr, formData;

                            xhr = new XMLHttpRequest();
                            xhr.withCredentials = false;
                            xhr.open('POST', 'postAcceptor.php');

                            xhr.onload = function() {
                                var json;

                                if (xhr.status != 200) {
                                    failure('HTTP Error: ' + xhr.status);
                                    return;
                                }

                                json = JSON.parse(xhr.responseText);

                                if (!json || typeof json.location != 'string') {
                                    failure('Invalid JSON: ' + xhr.responseText);
                                    return;
                                }

                                success(json.location);
                            };

                            formData = new FormData();
                            formData.append('file', blobInfo.blob(), blobInfo.filename());

                            xhr.send(formData);
                        },
                        setup: function (editor) {
                            editor.on('init', function (e) {
                                vm.spinShow = false;
                                if (localStorage.editorContent) {
                                    tinymce.get('tinymceEditer').setContent(localStorage.editorContent);
                                }
                            });
                            editor.on('keydown', function (e) {
                                localStorage.editorContent = tinymce.get('tinymceEditer').getContent();
                            });
                        }
                    });
                });
            }
        },
        created () {
            this.init();
            console.log(11)
        },
        destroyed () {
            tinymce.get('tinymceEditer').destroy();
        }
    };
</script>

<style>
</style>