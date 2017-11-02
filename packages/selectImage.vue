<template>
  <el-select
    ref="select"
    v-model="value"
    placeholder="请选择图片"
    :loading="loading">
    <el-option class="option" :label="label" :value='value'>
      <div ref="conter" class="conter" v-on:click.stop="">
        <div class="card image"  :style="'background-image: url('+item.url+')'" :class="{'active': item.fileId === value}" v-for="item in images" v-on:click.stop="nodeClick(item)">

            <span class="name">{{item.filename}}</span>

          <!--<div class="footer">-->
              <!--<time class="time">{{ item.createTime|formatDate }}</time>-->
              <!--<el-button type="text" @click="nodeClick(item)" class="button">选择</el-button>-->
          <!--</div>-->
        </div>

        <div class="clearfix"></div>
      </div>
      <div class="page" v-on:click.stop="">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageLength"
          :current-page="currPage">
        </el-pagination>
      </div>
    </el-option>
  </el-select>
</template>

<script>
//  import Lib from 'assets/Lib.js'
  export default {
    name: 'selectImage',
    data() {
      return {
        currentValue:'',
        total:0,
        pageLength:10,
        currPage:1,
        loading: false,
        images:[]
      }
    },

    props: {

      url:{
        type: String,
        default:() =>{
          return ''
        }
      },
      label:[String, Number],
      value: [String, Number],
      checkChange: Function
    },
    mounted() {
      this.getList();
    },
    methods: {
      nodeClick(data, checked, indeterminate) {
        this.$emit('checkChange',[data]);//通知上级事件
        this.$refs.select.handleClose()
//        this.label =data['filename'];
//        this.$emit('input', data['fileId']);
      },
      handleSizeChange(val) {
        this.pageLength = val;
        this.getList()
      },
      handleCurrentChange(val) {//切换页
        this.currPage = val;
        this.getList()
      },
      getList () { //获取列表
        var _this =this;
        var currPage = this.currPage;
        var start = (currPage - 1) * this.pageLength;
        //模拟数据
        var query = {
          length : this.pageLength,
          start:start
        };
        this.$http.post(this.url, query).then(function (response) {

          var data = response.data;
          console.log(data);
          if (data.status) {

            _this.images = data.data.list;
            _this.total = data.data.total;
            //add to tree
          }else {
            _this.$message.error({
              message: data.message
            });
          }
        }).catch(function (err) {
          _this.$message.error({
            message: err.statusText?err.statusText:'请求失败'
          });
        });
      }
    }
  }
</script>

<style scoped  lang="less" type="text/css" rel="stylesheet/less">
  .option{
    max-width: 700px;
    background: none;
    height: auto;
    color: #000;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  .conter{
    background-color:#fff ;
    cursor: default;
  }
  .card{
    height: 150px;
    width: 24%;
    line-height: 20px;
    text-indent: 2em;
    background-size: cover;
    border: 1px solid #d3dce6;
    border-radius: 4px;
    background-color: #fff;
    overflow: hidden;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    float: left;
    margin: 0.5%;
    display: flex;
    flex-direction: column;
    position: relative;
    cursor: pointer;
    background-position: center;
  }

  .active{
    box-shadow: 0 2px 4px 0 #4db3ff,0 0 6px 0 #4db3ff;
    border: 1px solid #4db3ff;

  }
  .time {
    font-size: 13px;
    color: #999;
  }
  .card .footer{
    padding: 14px;
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: rgba(65, 57, 57, 0.28);
  }
  .name{
    height: 30px;
    display: block;
    line-height: 30px!important;
    background-color: rgba(79, 168, 234, 0.33);
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }
  .page{
    float: left;
    width: 100%;
    text-align: right;
    background-color: #fff;
    span{
      line-height: 28px!important;
    }
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
