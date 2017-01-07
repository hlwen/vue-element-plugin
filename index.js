/**
 * Created by hlwen on 2016/12/7.
 */
import selectTree from './selectTree.vue'
import selectImage from './selectImage.vue'
import remoteSelect from './remoteSelect.vue'
import queryForm from './queryForm.vue'
import grid from './grid.vue'
import uploadImage from './uploadImage.vue'
import vueHtml5Editor from './vue-html5-editor'


const install = function(Vue, opts = {}) {
    /* istanbul ignore if */
    if (install.installed) return;
    Vue.component(selectTree.name, selectTree);
    Vue.component(selectImage.name, selectImage);
    Vue.component(remoteSelect.name, remoteSelect);
    Vue.component(queryForm.name, queryForm);
    Vue.component(grid.name, grid);
    Vue.component(uploadImage.name, uploadImage);
    // Vue.component(vueHtml5Editor.name, vueHtml5Editor);//需提供配置文件不在在需要使用时安装
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
};

module.exports = {
    version: '1.0.0',
    install,
    selectTree,
    selectImage,
    remoteSelect,
    queryForm,
    grid,
    uploadImage,
    vueHtml5Editor
};

