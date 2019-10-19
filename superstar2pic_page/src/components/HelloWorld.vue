<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
     <v-text-field
            label="超星书本阅读地址"
            outlined
            v-model="url"
          ></v-text-field>
    <v-btn :disabled="queryButtonAble" @click="startSpaking">开始下载</v-btn>
    <v-card
    class="mx-auto"
    outlined
    dark
  >
  <v-list-item v-for="item in resultItems" :key="item.key">
      <v-list-item-content>
        <v-list-item-title>{{item.title}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    </v-card>
      <v-snackbar
      v-model="tipshow"
      :color="error"
      :timeout="2000"
      :top="true"
    >
      {{ warningMsg }}
    </v-snackbar>
  </div>
</template>

<script>
const {ipcRenderer}=window.require?window.require("electron"):{}
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  created(){
    this.initObsover()
  },
  mounted(){

  },
  data(){
    return {
      resultItems:[],
      warningMsg:"请填写正确的书本阅读地址",
      url:"",
      queryButtonAble:false,
      tipshow:false,
      queryResultMsg:''
    }
  },
  methods:{
    initObsover(){
      ipcRenderer.on("downloadResult",(event,arg)=>{
        this.generateResultItem(arg)
      })
    },
    generateResultItem(msg)
    {
      let item={title:msg,key:Math.random()}
      this.resultItems.push(item)
    },
    startSpaking(){
      if(this.url.trim().length<=0)
      {
        this.tipshow=true
        return 
      }
      this.resultItems=[]
      if(ipcRenderer)
      ipcRenderer.send("send-message",this.url)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
