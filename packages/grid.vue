<template>
    <div  v-loading="loading2" style="width:99.9%" element-loading-text="拼命加载中">
        <el-table
                :data="gridData"
                border
                style="width: 100%"
                :height="height"
                highlight-current-row
                @selection-change="selectionChange"
                @row-click="rowClick1">
            <el-table-column
                    v-if="table.selection"
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column :min-width="table.minWidth" v-for="(item,index) in table.column"
                             :key="index"
                             template
                             :label="item.name"
                             :fixed="item.fixed"
                             :width="item.width?item.width:''">
                <template slot-scope="props">
                    <div v-if="item.buttons && item.buttons.length">
                        <el-button v-for="(but,index) in item.buttons" :key="index" size="small" v-if="!but.isShow || but.isShow(props.row)"
                                   @click.stop="but.handle&&but.handle(props.$index, props.row)">
                            <i v-if="but.icon" :class="but.icon"></i> {{but.text}}
                        </el-button>
                    </div>
                    <a v-else-if="item.handle" class="handle-a" @click="item.handle && item.handle(props.$index, props.row)">
                        {{props.row[item.key]}}
                    </a>
                    <span v-else-if="!!item.filter">
                        {{ filter(item.filter, props.row[item.key],item.format)}}
                    </span>
                    <img v-else-if="item.type && item.type == 'img'" class="img" :src="props.row[item.key]?props.row[item.key]:img.timg" alt="">
                    <span v-else class="text">
                        {{props.row[item.key]}}
                    </span>
                </template>
            </el-table-column>
        </el-table>

        <el-row type="flex" class="row-bg grid-row-bg" justify="end">
            <slot name="bottom"></slot>
            <div style="flex: 1"></div>
            <el-pagination
                    v-if="pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    :page-size="pageLength"
                    :current-page="current_page">
            </el-pagination>
        </el-row>
    </div>
</template>

<script>


    import Vue from 'vue'
    import {request} from 'utils'
    import moment from 'moment'
    import assets from 'assets'
    module.exports = {
        name: 'grid',
        data: function () {
            return {
                img:assets.I,
                loading2: false,
                gridData: [],
                //分页信息
                paramsPage: 1,
                total: 0, //总条数
                current_page: 1,//当前页
                pageLength: 10,//每页的条数
            }
        },
        props: {
            query: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            queryProp: {
                type: Object,
                default: function () {
                    return {
                        start: 'start',
                        length: 'length'
                    }
                }
            },
            pagination: {//是否显示分页
                type: Boolean,
                default: function () {
                    return true
                }
            },
            dateNames: {//需处理的时间段查询条件
                type: Array,
                default: function () {
                    return []
                }
            },
            data: {//表格数据
                type: Array,
                default: function () {
                    return []
                }
            },
            url: '',//加载的url
            selectionChange: {
                type: Function,
                default: function () {
                    return ''
                }
            },
            load: {//是否默认加载
                type: Boolean,
                default: true
            },
            loading: {//加载时的遮罩
                type: Boolean,
                default: false
            },
            height: {
                type: [String, Number],
                default: function () {
                    return 600
                }
            },
            table: {
                type: Object,
                default: function () {
                    return {
                        column: [],
                        selection: false
                    }
                }

            },
            auto: {
                type: Boolean,
                default: false

            }
        },
        watch: {
            data(newVal){
                if (newVal != this.gridData) {
                    this.gridData = newVal
                }
            },
            loading(newVal,oldVal){
                if (newVal != oldVal) {
                    this.loading2 = newVal
                }
            }
        },
        mounted(){

            !!this.load && this.getList();
        },
        methods: {
             filter(name, value,format) {
                if (name == 'date') {
                    return value?moment(value).format(format?format:'YYYY-MM-DD HH:mm:ss'):'';
                }
                return Vue.filter('dictionary')(value, name)
            },
            handleSizeChange(val) {
                this.pageLength = val;
                this.getList()
            },
            handleCurrentChange(val) {//切换页

                this.current_page = val;
                this.getList()
            },
            rowClick1(val) {//切换页
                this.$emit('row-click', val)
            },
            /**
             * 列表查询
             * @param query
             * @param callback
             * @returns {*}
             */
            getList (query, callback) {
                if (!this.url) {
                    this.gridData = this.data;
                    return ''
                }
                var query = query ? query : Object.assign({}, this.query);
                for (var i in query) {
                    if (query[i] === '') {
                        delete query[i]
                    }
                }
                var _this = this;
                this.loading2 = true;

                request.get(this.url, Object.assign({
                        offset: (this.current_page -1) * this.pageLength,
                        limit: this.pageLength,
                        query:query
                    })
                , function (data, status) {
                    _this.loading2 = false;
                    if (status) {
                        _this.gridData = data.data.rows;
                        _this.total = data.data.count;

                        callback ? callback(data) : '';

//                        if(this.auto){
//                            this.$el.style.width = 'auto'
//                        }
                    }
                })
                return query
            }
        }
    }
</script>


<style scoped lang="less" type="text/css" rel="stylesheet/less">
    .handle-a {
        width: 100%;
        display: block;
        cursor: pointer;
        color: blue;
    }

    .grid-row-bg .el-form-item {
        margin: 0;
    }

    .img {
        height: 40px;
        z-index: 9999;
        cursor: pointer;
    }

    .img:hover {
        max-height: 150px;
        position: absolute;
        top: 0;
        left: 0;
        height: auto;
    }

    .text {
        display: block;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

</style>
