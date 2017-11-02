<style scoped lang="less">
    .replyContent {
        background-color: #dbeaf3;
        padding: 10px;
        p {
            margin: 10px 0;
        }
    }
</style>
<template>
    <el-dialog class="dialogForm" :size="size" @close="cancel" :title="title" v-model="show">
        <div class="replyContent">
            <p v-for="i in config" v-if="!i.show">
                <strong>{{i.name}} : </strong>
                <span v-if="i.type =='img'"><img v-for="j in formItems[i.key]" :src="'/file/'+j[i.url]" alt=""></span>
                <span v-else>{{!!i.filter ? filter(i.filter, formItems[i.key]) : formItems[i.key]}}</span>
            </p>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="cancel" icon="el-icon-close">取 消</el-button>
            <slot name="button"></slot>

        </div>
    </el-dialog>

</template>

<script>

    import Vue from 'vue'
    import {request} from 'utils'

    module.exports = {
        name: 'viewDetails',
        components: {},
        data: function () {
            return {
                serverUrl: request.serverUrl,
                show: false,
                formItems: {},
                query: {},
                loading: false
            }
        },
        props: {
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
            size: {
                type: String,
                default: function () {
                    return 'tiny'
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
        mounted() {
            this.formItems = Object.assign({}, this.fromData)
        },
        watch: {
            fromData(newVal, oldVal) {
                if (newVal != oldVal) {
                    this.formItems = Object.assign({}, newVal)
                }
            },
            value(newVal, oldVal) {

                if (newVal != oldVal) {

                    this.show = newVal
                }
            },
            config(newVal, oldVal) {

                console.log(newVal)
            }
        },
        methods: {
            filter(name, value) {
                if (name == 'date') {

                    return Vue.filter('formatDate')(value, 'YYYY-MM-DD HH:mm:ss')
                }
                return Vue.filter('dictionary')(value, name)
            },
            cancel() {
                this.$emit('input', false);
                return false
            }
        }
    }
</script>

