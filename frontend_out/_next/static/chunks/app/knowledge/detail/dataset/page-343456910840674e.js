(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[612],{2634:()=>{},3232:(e,t,a)=>{Promise.resolve().then(a.bind(a,5233))},1841:(e,t,a)=>{"use strict";a.d(t,{f:()=>r});var s=a(2120);let r=async function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};try{return(await s.A.post("/knowledgebase/archive_file",e)).data}catch(e){console.error(e)}}},5233:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>X});var s=a(5155),r=a(5007);let l=(0,a(7401).A)("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);var n=a(4081),i=a(8684),o=a(2115),d=a(9602);let c=o.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("div",{className:"relative w-full overflow-auto",children:(0,s.jsx)("table",{ref:t,className:(0,d.cn)("w-full caption-bottom text-sm",a),...r})})});c.displayName="Table";let u=o.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("thead",{ref:t,className:(0,d.cn)("[&_tr]:border-b",a),...r})});u.displayName="TableHeader";let f=o.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("tbody",{ref:t,className:(0,d.cn)("[&_tr:last-child]:border-0",a),...r})});f.displayName="TableBody",o.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("tfoot",{ref:t,className:(0,d.cn)("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",a),...r})}).displayName="TableFooter";let m=o.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("tr",{ref:t,className:(0,d.cn)("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",a),...r})});m.displayName="TableRow";let x=o.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("th",{ref:t,className:(0,d.cn)("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",a),...r})});x.displayName="TableHead";let p=o.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("td",{ref:t,className:(0,d.cn)("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",a),...r})});p.displayName="TableCell",o.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("caption",{ref:t,className:(0,d.cn)("mt-4 text-sm text-muted-foreground",a),...r})}).displayName="TableCaption";let h=(0,a(1027).F)("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",outline:"text-foreground"}},defaultVariants:{variant:"default"}});function g(e){let{className:t,variant:a,...r}=e;return(0,s.jsx)("div",{className:(0,d.cn)(h({variant:a}),t),...r})}var N=a(3392);let v={unprocess:{text:"上传成功",color:"bg-gray-100"},waitinglist:{text:"排队入库",color:"bg-gray-100"},processing:{text:"正在入库",color:"bg-gray-100"},processed:{text:"入库成功",color:"bg-green-100"},failed:{text:"入库失败",color:"bg-red-100"}};function b(e){let{data:t}=e;return(0,s.jsx)("div",{className:"relative",children:(0,s.jsx)(N.F,{className:"h-[calc(100vh-291px)] w-full",children:(0,s.jsxs)(c,{children:[(0,s.jsx)(u,{className:"sticky top-0 bg-background",children:(0,s.jsxs)(m,{children:[(0,s.jsx)(x,{className:"w-[40%]",children:"文件路径"}),(0,s.jsx)(x,{className:"w-[25%]",children:"创建时间"}),(0,s.jsx)(x,{className:"w-[20%]",children:"状态"})]})}),(0,s.jsxs)(f,{children:[0===t.length&&(0,s.jsx)(m,{children:(0,s.jsx)(p,{colSpan:4,className:"text-center text-gray-500",children:"暂无数据"})}),t.map((e,t)=>(0,s.jsxs)(m,{children:[(0,s.jsx)(p,{className:"text-blue-500 w-[40%]",children:e.file_path}),(0,s.jsx)(p,{className:"w-[25%]",children:e.create_time}),(0,s.jsx)(p,{className:"w-[20%]",children:(0,s.jsx)(g,{variant:"outline",className:"text-xs ".concat(v[e.status].color),children:v[e.status].text})})]},t))]})]})})})}var j=a(2120),y=a(1973),w=a.n(y);let k=async e=>{try{return(await j.A.get("/knowledgebase/file_list?".concat(w().stringify(e)))).data}catch(e){throw console.error("Failed to fetch knowledge file list:",e),e}},A=async function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};try{return(await j.A.post("/knowledgebase/archive_text",e)).data}catch(e){console.error(e)}};var S=a(1841),C=a(4085),T=a(853),R=a(2336),_=a(241);let P=async function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};try{return(await j.A.get("/knowledgebase/file_list_count?".concat(w().stringify(e)))).data}catch(e){throw console.error("Failed to fetch knowledge list:",e),e}};var E=a(3518),O=a(6967),F=a(4858);let z=e=>{let{className:t,...a}=e;return(0,s.jsx)("nav",{role:"navigation","aria-label":"pagination",className:(0,d.cn)("mx-auto flex w-full justify-center",t),...a})};z.displayName="Pagination";let M=o.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("ul",{ref:t,className:(0,d.cn)("flex flex-row items-center gap-1",a),...r})});M.displayName="PaginationContent";let I=o.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("li",{ref:t,className:(0,d.cn)("",a),...r})});I.displayName="PaginationItem";let D=e=>{let{className:t,isActive:a,size:r="icon",...l}=e;return(0,s.jsx)("a",{"aria-current":a?"page":void 0,className:(0,d.cn)((0,C.r)({variant:a?"outline":"ghost",size:r}),t),...l})};D.displayName="PaginationLink";let L=e=>{let{className:t,...a}=e;return(0,s.jsxs)(D,{"aria-label":"Go to previous page",size:"default",className:(0,d.cn)("gap-1 pl-2.5",t),...a,children:[(0,s.jsx)(E.A,{className:"h-4 w-4"}),(0,s.jsx)("span",{children:"Previous"})]})};L.displayName="PaginationPrevious";let U=e=>{let{className:t,...a}=e;return(0,s.jsxs)(D,{"aria-label":"Go to next page",size:"default",className:(0,d.cn)("gap-1 pr-2.5",t),...a,children:[(0,s.jsx)("span",{children:"Next"}),(0,s.jsx)(O.A,{className:"h-4 w-4"})]})};U.displayName="PaginationNext";let V=e=>{let{className:t,...a}=e;return(0,s.jsxs)("span",{"aria-hidden":!0,className:(0,d.cn)("flex h-9 w-9 items-center justify-center",t),...a,children:[(0,s.jsx)(F.A,{className:"h-4 w-4"}),(0,s.jsx)("span",{className:"sr-only",children:"More pages"})]})};function J(e){let{currentPage:t,totalPages:a,pageSize:r,totalItems:l,onPageChange:n,onPageSizeChange:i,className:o="",pageSizeOptions:d=[10,20,30,50]}=e;return(0,s.jsxs)("div",{className:"flex items-center justify-between gap-4",children:[(0,s.jsx)("div",{className:"flex items-center gap-2 text-sm text-muted-foreground",children:(0,s.jsxs)("span",{className:"w-12",children:["共 ",l]})}),(0,s.jsx)(z,{className:o,children:(0,s.jsxs)(M,{children:[(0,s.jsx)(I,{children:(0,s.jsx)(L,{onClick:()=>t>1&&n(t-1),className:t<=1?"pointer-events-none opacity-50":"cursor-pointer"})}),(()=>{let e=[];if(a<=7)for(let t=1;t<=a;t++)e.push(t);else{e.push(1),t>3&&e.push("...");for(let s=Math.max(2,t-1);s<=Math.min(t+1,a-1);s++)e.push(s);t<a-2&&e.push("..."),e.push(a)}return e})().map((e,a)=>(0,s.jsx)(I,{children:"..."===e?(0,s.jsx)(V,{}):(0,s.jsx)(D,{href:"#",onClick:t=>{t.preventDefault(),n(Number(e))},isActive:t===e,children:e})},a)),(0,s.jsx)(I,{children:(0,s.jsx)(U,{onClick:()=>t<a&&n(t+1),className:t>=a?"pointer-events-none opacity-50":"cursor-pointer"})})]})})]})}V.displayName="PaginationEllipsis";var $=a(9053),G=a(1124),H=a(7837),Z=a(5785),q=a(371),B=a(4505);function W(e){let{open:t,onOpenChange:a,fileAddType:r,fileName:l,setFileName:n,filePath:i,setFilePath:d,fileText:c,setFileText:u,onSubmit:f,isLoading:m}=e;return(0,o.useRef)(null),(0,s.jsx)(H.lG,{open:t,onOpenChange:a,children:(0,s.jsxs)(H.Cf,{className:"sm:max-w-[425px]",children:[(0,s.jsxs)(H.c7,{children:[(0,s.jsx)(H.L3,{children:"text"===r?"知识入库":"文件入库"}),(0,s.jsx)(H.rr,{children:"添加一段文本到数据库"})]}),(0,s.jsx)("div",{className:"grid gap-4 py-4",children:"text"===r?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("div",{className:"gap-4",children:[(0,s.jsx)(Z.J,{htmlFor:"fileName",className:"text-right",children:"文件名"}),(0,s.jsx)(R.p,{id:"fileName",placeholder:"输入文件名（选填）",className:"col-span-3",value:l,onChange:e=>n(e.target.value)})]}),(0,s.jsxs)("div",{className:"gap-4",children:[(0,s.jsx)(Z.J,{htmlFor:"fileText",className:"text-right",children:"文件内容"}),(0,s.jsx)(q.T,{id:"fileText",placeholder:"输入文件内容（按\\n对文本进行分块）",className:"col-span-3",value:c,onChange:e=>u(e.target.value)})]})]}):(0,s.jsxs)("div",{className:"grid gap-4",children:[(0,s.jsxs)("div",{className:"gap-4",children:[(0,s.jsx)(Z.J,{htmlFor:"filePath",className:"text-right",children:"文件路径"}),(0,s.jsx)("div",{className:"flex gap-2",children:(0,s.jsx)(R.p,{id:"filePath",placeholder:"输入文件路径...",className:"col-span-2 flex-grow",value:i,onChange:e=>d(e.target.value)})})]}),(0,s.jsxs)("div",{className:"gap-4",children:[(0,s.jsx)(Z.J,{htmlFor:"fileName",className:"text-right",children:"文件名"}),(0,s.jsx)(R.p,{id:"fileName",placeholder:"输入文件名（选填）",className:"col-span-3",value:l,onChange:e=>n(e.target.value)})]})]})}),(0,s.jsx)(H.Es,{children:(0,s.jsx)(C.$,{type:"submit",onClick:f,disabled:m,children:m?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(B.A,{className:"mr-2 h-4 w-4 animate-spin"}),"入库中..."]}):"入库"})})]})})}function X(){let[e,t]=(0,o.useState)([]),[a,d]=(0,o.useState)(""),[c,u]=(0,o.useState)(!1),[f,m]=(0,o.useState)(1),[x,p]=(0,o.useState)(1),[h,g]=(0,o.useState)(10),[N,v]=(0,o.useState)(0),[j,y]=(0,o.useState)(!1),[w,E]=(0,o.useState)("text"),[O,F]=(0,o.useState)(""),[z,M]=(0,o.useState)(""),[I,D]=(0,o.useState)(""),[L,U]=(0,o.useState)(!1);(0,o.useEffect)(()=>{V(),H()},[]),(0,o.useEffect)(()=>{H()},[f,h]);let V=()=>{P({name:window.localStorage.getItem("knowledgeName")||""}).then(e=>{v(e.data||0),p(Math.ceil(e.data/h))})},H=e=>{let a={name:window.localStorage.getItem("knowledgeName")||"",page:f,page_size:h,keyword:e||""};console.log(a),k(a).then(e=>{t(e.data||[])})},Z=()=>{F(""),M(""),d(""),u(!0),y(!1)},q=async()=>{U(!0);try{let e={name:window.localStorage.getItem("knowledgeName")||"",file_name:O,text:a};if("text"===w){let t=await A(e);200===t.code?((0,_.oR)({title:"添加文件成功",description:"文件已添加"}),d(""),H(),u(!1)):(0,_.oR)({variant:"destructive",title:"添加文件失败",description:t.msg})}else{let t=await (0,S.f)(e);200===t.code?((0,_.oR)({title:"添加文件成功",description:"文件已添加"}),u(!1)):(0,_.oR)({variant:"destructive",title:"添加文件失败",description:t.msg})}}catch(e){(0,_.oR)({variant:"destructive",title:"添加文件失败",description:"请求出错，请稍后重试"})}finally{U(!1)}},B=(0,o.useCallback)((0,$.A)(e=>{H(e)},500),[]);return(0,s.jsxs)("div",{className:"flex h-full",children:[(0,s.jsx)("div",{className:"flex-1 px-6",children:(0,s.jsxs)(r.Zp,{className:"p-6",children:[(0,s.jsx)("h1",{className:"mb-2 text-xl font-semibold",children:"数据集"}),(0,s.jsxs)("div",{className:"mb-2.5 flex items-center justify-between",children:[(0,s.jsxs)("div",{className:"flex items-center gap-2 rounded-md bg-orange-50 p-3 text-orange-800",children:[(0,s.jsx)(l,{className:"h-4 w-4"}),"问题和答案只有在解析成功后才能回答。"]}),(0,s.jsxs)("div",{className:"flex items-center gap-2",children:[(0,s.jsxs)("div",{className:"relative",children:[(0,s.jsx)(T.A,{className:"absolute left-2 top-2.5 h-4 w-4 text-gray-400"}),(0,s.jsx)(R.p,{placeholder:"搜索文件",className:"pl-8",value:I,onChange:e=>{m(1);let t=e.target.value;D(t),B(t)}})]}),(0,s.jsxs)(G.AM,{open:j,onOpenChange:y,children:[(0,s.jsx)(G.Wv,{asChild:!0,children:(0,s.jsx)(C.$,{children:"添加文件"})}),(0,s.jsx)(G.hl,{className:"w-40 p-2",children:(0,s.jsxs)("div",{className:"flex flex-col gap-1",children:[(0,s.jsxs)(C.$,{variant:"ghost",className:"w-full justify-start gap-2 px-2 py-1.5 text-sm",onClick:()=>{E("text"),Z()},children:[(0,s.jsx)(n.A,{className:"h-4 w-4"}),"知识入库"]}),(0,s.jsxs)(C.$,{variant:"ghost",className:"w-full justify-start gap-2 px-2 py-1.5 text-sm",onClick:()=>{E("file"),Z()},children:[(0,s.jsx)(i.A,{className:"h-4 w-4"}),"文件入库"]})]})})]})]})]}),(0,s.jsx)(b,{data:e}),(0,s.jsx)(J,{currentPage:f,totalPages:x,pageSize:h,totalItems:N,onPageChange:e=>{m(e)},onPageSizeChange:e=>{g(e)},pageSizeOptions:[10,20,30,50]})]})}),(0,s.jsx)(W,{open:c,onOpenChange:u,fileAddType:w,fileName:O,setFileName:F,filePath:z,setFilePath:M,fileText:a,setFileText:d,onSubmit:q,isLoading:L})]})}},4085:(e,t,a)=>{"use strict";a.d(t,{$:()=>d,r:()=>o});var s=a(5155),r=a(2115),l=a(2317),n=a(1027),i=a(9602);let o=(0,n.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),d=r.forwardRef((e,t)=>{let{className:a,variant:r,size:n,asChild:d=!1,...c}=e,u=d?l.DX:"button";return(0,s.jsx)(u,{className:(0,i.cn)(o({variant:r,size:n,className:a})),ref:t,...c})});d.displayName="Button"},5007:(e,t,a)=>{"use strict";a.d(t,{Zp:()=>n});var s=a(5155),r=a(2115),l=a(9602);let n=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("div",{ref:t,className:(0,l.cn)("rounded-xl border bg-card text-card-foreground shadow",a),...r})});n.displayName="Card",r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("div",{ref:t,className:(0,l.cn)("flex flex-col space-y-1.5 p-6",a),...r})}).displayName="CardHeader",r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("div",{ref:t,className:(0,l.cn)("font-semibold leading-none tracking-tight",a),...r})}).displayName="CardTitle",r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("div",{ref:t,className:(0,l.cn)("text-sm text-muted-foreground",a),...r})}).displayName="CardDescription",r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("div",{ref:t,className:(0,l.cn)("p-6 pt-0",a),...r})}).displayName="CardContent",r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("div",{ref:t,className:(0,l.cn)("flex items-center p-6 pt-0",a),...r})}).displayName="CardFooter"},7837:(e,t,a)=>{"use strict";a.d(t,{Cf:()=>f,Es:()=>x,L3:()=>p,c7:()=>m,lG:()=>o,rr:()=>h,zM:()=>d});var s=a(5155),r=a(2115),l=a(7782),n=a(767),i=a(9602);let o=l.bL,d=l.l9,c=l.ZL;l.bm;let u=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)(l.hJ,{ref:t,className:(0,i.cn)("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",a),...r})});u.displayName=l.hJ.displayName;let f=r.forwardRef((e,t)=>{let{className:a,children:r,...o}=e;return(0,s.jsxs)(c,{children:[(0,s.jsx)(u,{}),(0,s.jsxs)(l.UC,{ref:t,className:(0,i.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",a),...o,children:[r,(0,s.jsxs)(l.bm,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",children:[(0,s.jsx)(n.A,{className:"h-4 w-4"}),(0,s.jsx)("span",{className:"sr-only",children:"Close"})]})]})]})});f.displayName=l.UC.displayName;let m=e=>{let{className:t,...a}=e;return(0,s.jsx)("div",{className:(0,i.cn)("flex flex-col space-y-1.5 text-center sm:text-left",t),...a})};m.displayName="DialogHeader";let x=e=>{let{className:t,...a}=e;return(0,s.jsx)("div",{className:(0,i.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",t),...a})};x.displayName="DialogFooter";let p=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)(l.hE,{ref:t,className:(0,i.cn)("text-lg font-semibold leading-none tracking-tight",a),...r})});p.displayName=l.hE.displayName;let h=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)(l.VY,{ref:t,className:(0,i.cn)("text-sm text-muted-foreground",a),...r})});h.displayName=l.VY.displayName},2336:(e,t,a)=>{"use strict";a.d(t,{p:()=>n});var s=a(5155),r=a(2115),l=a(9602);let n=r.forwardRef((e,t)=>{let{className:a,type:r,...n}=e;return(0,s.jsx)("input",{type:r,className:(0,l.cn)("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",a),ref:t,...n})});n.displayName="Input"},5785:(e,t,a)=>{"use strict";a.d(t,{J:()=>d});var s=a(5155),r=a(2115),l=a(6195),n=a(1027),i=a(9602);let o=(0,n.F)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),d=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)(l.b,{ref:t,className:(0,i.cn)(o(),a),...r})});d.displayName=l.b.displayName},1124:(e,t,a)=>{"use strict";a.d(t,{AM:()=>i,Wv:()=>o,hl:()=>d});var s=a(5155),r=a(2115),l=a(1885),n=a(9602);let i=l.bL,o=l.l9;l.Mz;let d=r.forwardRef((e,t)=>{let{className:a,align:r="center",sideOffset:i=4,...o}=e;return(0,s.jsx)(l.ZL,{children:(0,s.jsx)(l.UC,{ref:t,align:r,sideOffset:i,className:(0,n.cn)("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",a),...o})})});d.displayName=l.UC.displayName},3392:(e,t,a)=>{"use strict";a.d(t,{F:()=>i});var s=a(5155),r=a(2115),l=a(1868),n=a(9602);let i=r.forwardRef((e,t)=>{let{className:a,children:r,...i}=e;return(0,s.jsxs)(l.bL,{ref:t,className:(0,n.cn)("relative overflow-hidden",a),...i,children:[(0,s.jsx)(l.LM,{className:"h-full w-full rounded-[inherit]",children:r}),(0,s.jsx)(o,{}),(0,s.jsx)(l.OK,{})]})});i.displayName=l.bL.displayName;let o=r.forwardRef((e,t)=>{let{className:a,orientation:r="vertical",...i}=e;return(0,s.jsx)(l.VM,{ref:t,orientation:r,className:(0,n.cn)("flex touch-none select-none transition-colors","vertical"===r&&"h-full w-2.5 border-l border-l-transparent p-[1px]","horizontal"===r&&"h-2.5 flex-col border-t border-t-transparent p-[1px]",a),...i,children:(0,s.jsx)(l.lr,{className:"relative flex-1 rounded-full bg-border"})})});o.displayName=l.VM.displayName},371:(e,t,a)=>{"use strict";a.d(t,{T:()=>n});var s=a(5155),r=a(2115),l=a(9602);let n=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("textarea",{className:(0,l.cn)("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",a),ref:t,...r})});n.displayName="Textarea"},241:(e,t,a)=>{"use strict";a.d(t,{dj:()=>f,oR:()=>u});var s=a(2115);let r=0,l=new Map,n=e=>{if(l.has(e))return;let t=setTimeout(()=>{l.delete(e),c({type:"REMOVE_TOAST",toastId:e})},1e6);l.set(e,t)},i=(e,t)=>{switch(t.type){case"ADD_TOAST":return{...e,toasts:[t.toast,...e.toasts].slice(0,1)};case"UPDATE_TOAST":return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case"DISMISS_TOAST":{let{toastId:a}=t;return a?n(a):e.toasts.forEach(e=>{n(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,open:!1}:e)}}case"REMOVE_TOAST":if(void 0===t.toastId)return{...e,toasts:[]};return{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)}}},o=[],d={toasts:[]};function c(e){d=i(d,e),o.forEach(e=>{e(d)})}function u(e){let{...t}=e,a=(r=(r+1)%Number.MAX_SAFE_INTEGER).toString(),s=()=>c({type:"DISMISS_TOAST",toastId:a});return c({type:"ADD_TOAST",toast:{...t,id:a,open:!0,onOpenChange:e=>{e||s()}}}),{id:a,dismiss:s,update:e=>c({type:"UPDATE_TOAST",toast:{...e,id:a}})}}function f(){let[e,t]=s.useState(d);return s.useEffect(()=>(o.push(t),()=>{let e=o.indexOf(t);e>-1&&o.splice(e,1)}),[e]),{...e,toast:u,dismiss:e=>c({type:"DISMISS_TOAST",toastId:e})}}},9602:(e,t,a)=>{"use strict";a.d(t,{cn:()=>l});var s=a(3463),r=a(9795);function l(){for(var e=arguments.length,t=Array(e),a=0;a<e;a++)t[a]=arguments[a];return(0,r.QP)((0,s.$)(t))}},3518:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});let s=(0,a(7401).A)("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]])},8684:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});let s=(0,a(7401).A)("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]])},2120:(e,t,a)=>{"use strict";a.d(t,{A:()=>r});let s=a(2651).A.create({baseURL:"/api",timeout:3e4,headers:{"Content-Type":"application/json"}});s.interceptors.request.use(e=>e,e=>Promise.reject(e)),s.interceptors.response.use(e=>e,e=>(console.error("API Error:",e),Promise.reject(e)));let r=s}},e=>{var t=t=>e(e.s=t);e.O(0,[525,771,110,849,851,846,237,441,517,358],()=>t(3232)),_N_E=e.O()}]);