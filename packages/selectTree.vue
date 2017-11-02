<template>
    <el-select
            ref="select"
            v-model="value2"
            placeholder="请选择">
        <el-option style="background: none;height: auto;color: #000;padding: 0;" :label="dataName" :value='value2'>
            <el-tree
                    style="border: none;flex: 1;overflow: auto;max-height: 232px;" class="menuTree"
                    :props="props"
                    :nodeKey="nodeKey"
                    ref="tree"
                    show-checkbox
                    check-strictly
                    accordion
                    :default-checked-keys="defaultChecked"
                    :expand-on-click-node="true"
                    highlight-current
                    :data="treeData"
                    @node-click="nodeClick"
                    @check-change="nodeClick"
            ></el-tree>
        </el-option>
    </el-select>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {POST_TYPE_GET} from 'store/tree'
    //  import Lib, {Vue} from 'assets/Lib.js'
    export default {
        name: 'selectTree',
        data() {
            return {
                defaultChecked:[],
                expand: false,
                dataName: '',
                value2: ''
            }
        },
        props: {
            checkChange: Function,
            value: '',
            label: '',
            props: {
                label: 'label',
                children: 'children'
            },
            nodeKey: {
                type: String,
                default: function () {
                    return 'id'
                }
            },
            stateKey: {//数据显示
                type: String,
                default: function () {
                    return ''
                }
            },
            defaultExpandKeys: [],
            defaultCheckedKeys: [],
            showCheckbox: false,
//      treeData: {
//        type: Array,
//        default: function () {
//          return []
//        }
//      },
            selectData: {}
        },
        watch: {
            value(val) {
                this.value2 = val;
                 this.$refs.tree.setCheckedKeys([this.value2-0])
            },
            label(val) {
                this.dataName = val
            },
        },
        mounted(){
            this.dataName = this.label;
            this.value2 = this.value;
        },
        computed:{
            treeData: {
                get () {
                    return this.$store.state.tree[this.stateKey]
                },
            }
        },
        methods: {
            nodeClick(data, checked, indeterminate) {

                this.dataName = data[this.props.label];
                this.$emit('input', data[this.nodeKey] + '');
                this.$refs.tree.setCheckedKeys([]);
            }
        }
    }
</script>


<style type="less" scoped>
    .el-select {
        width: 100%;
    }
</style>
