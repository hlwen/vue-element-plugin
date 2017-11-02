<template>
    <div class="queryForm" @keyup.enter="handleQuery" >
        <el-form :inline="true" :model="query" ref="queryform" label-width="100px" class="demo-query">
            <el-form-item v-for="(item,index) in config" v-if="item.query" :key="index" :label="item.name + ':'"  :rules="item.queryRules?item.rules:[]" :prop="item.key">
                <el-date-picker v-if="['date','daterange','datetimerange'].indexOf(item.type) >-1"
                                v-model="query[item.key]"
                                :type="item.type" placeholder="请选择"></el-date-picker>
                <el-select v-else-if="item.type=='select'" @change="item.change&&item.change(query[item.key],item.data)"
                           v-model="query[item.key]" placeholder="请选择">
                    <el-option
                            v-for="(select,index) in item.data"
                            :key="index"
                            :label="select[item.props?item.props.name:'name']"
                            :value="select[item.props?item.props.value:'value']">
                    </el-option>
                </el-select>
                <remote-select v-else-if="item.type=='remoteSelect'" v-model="query[item.key]" :prop="item.prop"
                               :url="item.url"></remote-select>
                <el-radio-group v-else-if="item.type=='radio'" v-model="query[item.key]">
                    <el-radio
                            v-for="(select,index) in item.data"
                            :key="index"
                            :label="select[item.prop?item.prop.value:'value']">
                        {{select[item.prop ? item.prop.name : 'name']}}
                    </el-radio>
                </el-radio-group>
                <el-input v-else v-model="query[item.key]" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item v-if="button">
                <el-button type="primary" @click="handleQuery"><i class="nytfont nyt-sousuo"></i>查询</el-button>
                <el-button @click="handleReset"><i class="nytfont nyt-chongzhi"></i>重置</el-button>
                <slot name="button"></slot>

            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    import Vue from 'vue'
    import remoteSelect from './remoteSelect.vue'


    module.exports = {
        name: 'queryForm',
        components: {
            remoteSelect
        },
        data: function () {
            return {
//                formItems:[],
                query: {},
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
            button: {
                type: Boolean,
                default: function () {
                    return true
                }
            },
        },
//        watch: {
//            config(newVal, oldVal){
//                if (newVal != oldVal) {
//                    this.formItems = Object.assign({}, newVal)
//                }
//            },
//        },
        mounted(){
            var queryData = {}
            this.config.forEach(item => {
                if(item.query ){
                    queryData[item.key] = ''
                }
                
            });
            this.query = queryData;
            this.$emit('input', queryData);
        },
        methods: {
            handleReset() {
                this.$refs.queryform.resetFields();
                this.$emit('query', this.query);
            },
            handleQuery () { //
                this.$emit('input', this.query);
                this.$emit('query', this.query);
            }
        }
    }
</script>

<style scoped>
    .queryForm .el-form-item {
        margin: 5px 0;
    }
</style>
