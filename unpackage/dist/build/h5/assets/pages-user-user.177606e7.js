import{q as s,n as t,g as a,o as e,c as i,w as o,i as r,u as l,d,e as c,f as n,F as p,k as u,h,m,l as f}from"./index-94c27637.js";import{r as g,_}from"./uni-app.es.89cfa6ed.js";import{_ as v}from"./_plugin-vue_export-helper.1b428a4d.js";const x=v({data:()=>({listArr:[]}),onShow(){this.getDate(),s({scrollTop:0,duration:300})},methods:{goDetail(s){t({url:`/pages/detail/detail?cid=${s.classid}&id=${s.id}`})},getDate(){let s=a("historyArr")||[];this.listArr=s}}},[["render",function(s,t,a,v,x,k){const w=m,y=g(f("newsbox"),_),A=r;return e(),i(A,{class:"user"},{default:o((()=>[l("div",{class:"top"},[d(w,{src:"/assets/history-f07d6204.png",mode:""}),l("div",{class:"text"},"浏览历史")]),l("div",{class:"content"},[(e(!0),c(p,null,n(x.listArr,(s=>(e(),c("div",{class:"row",key:s},[d(y,{item:s,onClick:t=>k.goDetail(s)},{default:o((()=>[u(" 这是一条新闻。 ")])),_:2},1032,["item","onClick"])])))),128))]),x.listArr.length?h("",!0):(e(),c("div",{key:0,class:"nohistory"},[d(w,{src:"/assets/nohis-95ec85cd.png",mode:"widthFix"}),d(A,{class:"text"},{default:o((()=>[u("暂无浏览记录")])),_:1})]))])),_:1})}],["__scopeId","data-v-eb38c934"]]);export{x as default};
