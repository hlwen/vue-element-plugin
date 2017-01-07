<template>
  <div class="queryForm">
    <el-form :inline="true" :model="query" ref="queryform" label-width="100px" class="demo-query">
      <el-form-item v-for="item in formItems" :label="item.label + ':'" :prop="item.key">
        <el-date-picker v-if="['date','daterange','datetimerange'].indexOf(item.type) >-1" v-model="query[item.key]"
                        :type="item.type" placeholder="请选择"></el-date-picker>
        <el-select v-else-if="item.type=='select'" v-model="query[item.key]" placeholder="请选择">
          <el-option
            v-for="select in item.data"
            :label="select[item.prop?item.prop.name:'name']"
            :value="select[item.prop?item.prop.value:'value']">
          </el-option>
        </el-select>
        <remote-select v-else-if="item.type=='remoteSelect'" v-model="query[item.key]" :prop="item.prop"
                       :url="item.url"></remote-select>
        <el-radio-group v-else-if="item.type=='radio'" v-model="query[item.key]">
          <el-radio
            v-for="select in item.data"
            :label="select[item.prop?item.prop.value:'value']">{{select[item.prop?item.prop.name:'name']}}
          </el-radio>
        </el-radio-group>
        <el-input v-else v-model="query[item.key]" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleQuery"><i class="nytfont nyt-sousuo"></i>查询</el-button>
        <el-button @click="handleReset"><i class="nytfont nyt-chongzhi"></i>重置</el-button>
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
        query: {},
      }
    },
    props: {
      selectionChange: Function,
      formItems: {
        type: Array,
        default: function () {
          return []
        }
      },
    },
    mounted(){
      var queryData = {}
      this.formItems.forEach(item => {
        queryData[item.key] = ''
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
    margin-bottom: 0;
  }
</style>
