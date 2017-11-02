<template>
  <el-select v-model="value11" placeholder="请选择" :loading="loading">
    <el-option
            v-for="(select,index) in data"
            :key="index"
      :label="select[prop.name]"
      :value="select[prop.value]">
    </el-option>
  </el-select>
</template>

<script>
//  import Lib from 'assets/Lib.js'
  import Vue from 'vue'

  module.exports = {
    name: 'remoteSelect',
    data: function () {
      return {
        loading: false,
        value11: '',
        data: []
      }
    },
    props: {
      url: String,
      value:'',
      prop: {
        type: Object,
        default(){
          return {
            'name': 'name',
            'value': 'value'
          }
        }
      }
    },
    watch: {
      value11(newVal){
        if (newVal != this.value) {
          this.$emit('input', newVal);
        }
      },
      value(newVal){
        if (newVal != this.value11) {
          this.value11 = this.value;
        }
      },
      url(newVal){
        this.getData()
      }
    },
    mounted(){
      this.value11 = this.value;
      this.getData()
    },
    methods: {
      getData() {
        var _this = this;
        _this.loading = true;
        this.$http.post(this.url, {length: 10, start: 0}).then(function (response) {
          var data = response.data;
          _this.loading = false;
          if (!!data.status) {
            _this.data = !!data.data && data.data.list ? data.data.list : (data.data || []);
          }
        }).catch(() => {
          _this.loading = false;
        })
      }
    }
  }
</script>

<style scoped>
  .queryForm .el-form-item {
    margin-bottom: 0;
  }
</style>
