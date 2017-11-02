<style scoped>
    .quill-editor{
        /*height: 400px;*/
        overflow: auto;
    }
</style>
<template>
    <el-dialog :size="size" @close="cancel" :title="title" :visible.sync="show">
        <el-form :model="formItems" ref="dialogForm" label-width="140px">
            <el-form-item v-for="(item,index) in config" :key="index" :rules="item.rules"  v-if="!!item.show?item.show(formItems):true" :label="item.name + ':'" :prop="item.key">

                <el-date-picker  v-if="['date','daterange','datetimerange'].indexOf(item.type) >-1"
                                v-model="formItems[item.key]"
                                :type="item.type" :placeholder="'请选择'+item.name">
                </el-date-picker>

                <el-select v-else-if="item.type=='select'" type="number" @change = "item.change&&item.change(formItems[item.key],item.data,formItems)" v-model="formItems[item.key]" :placeholder="'请选择'+item.name">
                    <el-option v-for="(select,index) in item.data"
                            :key="index"
                            :label="item.props?select[item.props.name]:select['name']"
                            :value="item.props?select[item.props.value]:select['value']">
                    </el-option>
                </el-select>

                <!--<remote-select v-else-if="item.type=='remoteSelect'" v-model="formItems[item.key]" :prop="item.prop" :url="item.url"></remote-select>-->
                <el-radio-group v-else-if="item.type=='radio'" v-model="formItems[item.key]">

                    <el-radio
                            v-for="(select,index) in item.data"
                            :key="index"
                            :label="select[item.prop?item.prop.value:'value']">
                        {{select[item.prop ? item.prop.name : 'name']}}
                    </el-radio>
                </el-radio-group>
                <select-tree v-else-if="item.type=='selectTree'" v-model.string="formItems[item.key]" :props="item.props" :stateKey="item.stateKey" :placeholder="'请输入'+item.name"></select-tree>
                <el-input v-else-if="item.type=='number'" v-model.number="formItems[item.key]" :placeholder="'请输入'+item.name"></el-input>
                <el-input type="textarea" v-else-if="item.type=='textarea'" v-model="formItems[item.key]" :placeholder="'请输入'+item.name"></el-input>
                <!--<quill-editor :options="editorOption" v-else-if="item.type=='editor'"  class="quill-editor" v-model="formItems[item.key]"></quill-editor>-->
                <vue-editor :path="path" :options="editorOption" v-else-if="item.type=='editor'"  class="quill-editor" v-model="formItems[item.key]"></vue-editor>
                <div v-else-if="item.type=='upload'" style="display: flex">

                    <div style="width: 200px;height: 200px;background-size: 100%;background-position: center center;background-repeat: no-repeat" v-if="formItems[item.key]" :style="{backgroundImage: 'url('+formItems[item.key]+')'}" ></div>
                    <upload-image :path="path" v-model="formItems[item.key]"></upload-image>
                    <el-input style="flex: 1" v-model="formItems[item.key]"></el-input>
                </div>
                <el-input v-else v-model="formItems[item.key]" :placeholder="'请输入'+item.name"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="cancel" icon="el-icon-close">取 消</el-button>
            <el-button type="primary" @click.native="submit()" icon="plus" :loading="loading">确 定</el-button>
        </div>
    </el-dialog>

</template>

<script>

    import Vue from 'vue'
    import remoteSelect from './remoteSelect.vue'
    import selectTree from './selectTree.vue'
    import uploadImage from './uploadImage.vue'
    import {request} from 'utils'
//    import { quillEditor } from 'vue-quill-editor'
//    import { vueEditor } from './vueEditor.vue'

    module.exports = {
        name: 'dialogForm',
        components: {
            uploadImage,
            selectTree,
            remoteSelect,
//            quillEditor,
//            vueEditor
        },
        data: function () {
            return {
                editorOption: {
                    imageHandler(image, callback){
                        console.log(image, callback)
                    }
                },
                serverUrl:request.serverUrl,
                show:false,
                formItems:{},
                query: {},
                loading:false
            }
        },
        props: {
            selectionChange: Function,

            config: {
                type: Array,
                default: function () {
                    return []
                }
            },

            fromData: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            title: {
                type: String,
                default: function () {
                    return '编辑'
                }
            },
            path: {
                type: String,
                default: function () {
                    return ''
                }
            },
            size: {
                type: String,
                default: function () {
                    return 'small'
                }
            },
            value: {
                type: Boolean,
                default: function () {
                    return false
                }
            },
            button: {
                type: Boolean,
                default: function () {
                    return true
                }
            },
        },
        mounted(){
            this.formItems =  Object.assign({},this.fromData)
        },
        watch: {
            fromData(newVal,oldVal){
                if (newVal != oldVal) {
                    this.formItems = Object.assign({},newVal)
                }
            },
            value(newVal,oldVal){

                if (newVal != oldVal) {

                    this.show = newVal
                }
            },
            config(newVal,oldVal){

               console.log(newVal)
            }
        },
        methods: {
            cancel() {
                this.$emit('input', false);
                return false
            },
            submit () {
                this.$refs.dialogForm.validate((valid) => {
                    if (valid) {
                        this.$emit('submit', this.formItems);
                    } else {
                        return false;
                    }
                });

            }
        }
    }
</script>

<style scoped>
    .queryForm .el-form-item {
        margin: 5px 0;
    }
</style>
