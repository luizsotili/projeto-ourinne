const KEY = "ourine_demo_v1";
const STATUSES = ["Na triagem","Na bancada","Em ourives externo","Em acabamento","Em conferência","Pronto para entrega","Entregue"];
let data = loadData();
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
function loadData(){try{return JSON.parse(localStorage.getItem(KEY))||{orders:[],quality:[],outsourcing:[],incidents:[]}}catch{return {orders:[],quality:[],outsourcing:[],incidents:[]}}}
function save(){localStorage.setItem(KEY,JSON.stringify(data));renderAll()}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function dateBR(v){if(!v)return "—";const [y,m,d]=v.split("-");return `${d}/${m}/${y}`}
function todayISO(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function orderById(id){return data.orders.find(o=>o.id===id)}
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600)}
function statusClass(o){return o.dueDate<todayISO()&&!["Entregue","Pronto para entrega"].includes(o.status)?"late":""}
function nav(page){$$(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${page}`));$$(".nav-link[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));$("#pageName").textContent=({dashboard:"Visão geral",orders:"Ordens de serviço",production:"Produção",quality:"Gramagem e qualidade",outsourcing:"Terceirização",incidents:"Ocorrências"})[page];$("#sidebar").classList.remove("open")}
function orderOptions(select){const old=select.value;select.innerHTML='<option value="">Selecione uma OS</option>'+data.orders.map(o=>`<option value="${o.id}">${esc(o.number)} — ${esc(o.piece)}</option>`).join("");if(data.orders.some(o=>o.id===old))select.value=old}
function renderAll(){renderDashboard();renderOrders();renderProduction();renderSelects();renderQuality();renderOutsourcing();renderIncidents()}
function renderDashboard(){
 $("#stat-total").textContent=data.orders.length;
 $("#stat-progress").textContent=data.orders.filter(o=>!["Entregue","Pronto para entrega"].includes(o.status)).length;
 $("#stat-ready").textContent=data.orders.filter(o=>o.status==="Pronto para entrega").length;
 $("#stat-late").textContent=data.orders.filter(o=>statusClass(o)==="late").length;
 const recent=[...data.orders].sort((a,b)=>b.createdAt-a.createdAt).slice(0,6);
 $("#recentOrders").innerHTML=recent.length?recent.map(o=>`<tr><td><b>${esc(o.number)}</b></td><td>${esc(o.piece)}</td><td><span class="pill">${esc(o.status)}</span></td><td>${dateBR(o.dueDate)}</td></tr>`).join(""):'<tr><td colspan="4" class="empty">Nenhuma ordem cadastrada.</td></tr>';
 const attention=data.orders.filter(o=>statusClass(o)==="late"||o.status==="Pronto para entrega").slice(0,5);
 $("#attentionList").innerHTML=attention.length?attention.map(o=>`<div class="attention-item"><b>OS ${esc(o.number)} · ${esc(o.piece)}</b><small>${o.status==="Pronto para entrega"?"Aguardando retirada":`Prazo vencido em ${dateBR(o.dueDate)}`}</small></div>`).join(""):'<div class="empty">Nenhum pedido pendente.</div>';
}
function renderOrders(){
 const q=($("#orderSearch")?.value||"").toLowerCase(), f=$("#statusFilter")?.value||"";
 const arr=data.orders.filter(o=>(`${o.number} ${o.piece} ${o.material}`.toLowerCase().includes(q))&&(!f||o.status===f));
 $("#ordersTable").innerHTML=arr.length?arr.map(o=>`<tr><td><b>${esc(o.number)}</b></td><td>${esc(o.piece)}<br><small>${esc(o.material)}</small></td><td>${dateBR(o.entryDate)}</td><td>${dateBR(o.dueDate)} ${statusClass(o)==="late"?'<span class="pill late">Vencido</span>':""}</td><td><span class="pill">${esc(o.status)}</span></td><td><div class="row-actions"><button class="small-btn" data-edit-status="${o.id}">Status</button><button class="small-btn" data-delete="${o.id}">Excluir</button></div></td></tr>`).join(""):'<tr><td colspan="6" class="empty">Nenhuma ordem encontrada.</td></tr>';
}
function renderProduction(){
 const cols=[["Na triagem"],["Na bancada","Em acabamento"],["Em ourives externo"],["Em conferência","Pronto para entrega","Entregue"]];
 const names=["Entrada","Oficina","Terceirização","Conferência e entrega"];
 $("#productionBoard").innerHTML=cols.map((statuses,i)=>`<div class="kanban-col"><h3>${names[i]} · ${data.orders.filter(o=>statuses.includes(o.status)).length}</h3>${data.orders.filter(o=>statuses.includes(o.status)).map(o=>`<div class="kanban-card"><b>OS ${esc(o.number)} · ${esc(o.piece)}</b><small>Prazo: ${dateBR(o.dueDate)}</small><select data-status="${o.id}">${STATUSES.map(s=>`<option ${s===o.status?"selected":""}>${s}</option>`).join("")}</select></div>`).join("")||'<div class="empty">Sem pedidos nesta etapa.</div>'}</div>`).join("");
}
function renderSelects(){["qualityOrder","outsourcingOrder","incidentOrder"].forEach(id=>orderOptions($("#"+id)))}
function renderQuality(){
 $("#qualityTable").innerHTML=data.quality.length?[...data.quality].reverse().map(q=>{const o=orderById(q.orderId)||{};const diff=q.initialWeight!==""&&q.finalWeight!==""?(Number(q.finalWeight)-Number(q.initialWeight)).toFixed(3)+" g":"—";return `<tr><td>${esc(o.number||"—")}</td><td>${esc(o.piece||"—")}</td><td>${q.initialWeight===""?"—":esc(q.initialWeight)+" g"}</td><td>${q.finalWeight===""?"—":esc(q.finalWeight)+" g"}</td><td>${diff}</td><td>${esc(q.finalMeasure||"—")}</td></tr>`}).join(""):'<tr><td colspan="6" class="empty">Nenhuma pesagem cadastrada.</td></tr>';
}
function renderOutsourcing(){
 $("#outsourcingTable").innerHTML=data.outsourcing.length?[...data.outsourcing].reverse().map(x=>{const o=orderById(x.orderId)||{};return `<tr><td>${esc(o.number||"—")}</td><td>${esc(x.professional)}</td><td>${dateBR(x.sentDate)}</td><td>${dateBR(x.expectedDate)}</td><td>${dateBR(x.returnedDate)}</td><td><span class="pill ${x.returnedDate?"":"warn"}">${x.returnedDate?"Retornado":"Com parceiro"}</span></td></tr>`}).join(""):'<tr><td colspan="6" class="empty">Nenhum envio cadastrado.</td></tr>';
}
function renderIncidents(){
 $("#incidentsTable").innerHTML=data.incidents.length?[...data.incidents].reverse().map(x=>{const o=orderById(x.orderId)||{};return `<tr><td>${esc(o.number||"—")}</td><td><span class="pill ${x.type==="Atraso"?"late":""}">${esc(x.type)}</span></td><td>${dateBR(x.date)}</td><td>${esc(x.description)}</td><td>${esc(x.responsible||"—")}</td></tr>`}).join(""):'<tr><td colspan="5" class="empty">Nenhuma ocorrência cadastrada.</td></tr>';
}
function openOrder(){const d=$("#orderDialog");$("#orderForm").reset();$("#orderForm").elements.entryDate.value=todayISO();const due=new Date();due.setDate(due.getDate()+7);$("#orderForm").elements.dueDate.value=`${due.getFullYear()}-${String(due.getMonth()+1).padStart(2,"0")}-${String(due.getDate()).padStart(2,"0")}`;d.showModal()}
$$("[data-page]").forEach(b=>b.addEventListener("click",()=>nav(b.dataset.page)));
$$("[data-action='new-order']").forEach(b=>b.addEventListener("click",openOrder));
$("#menuBtn").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#closeDialog").addEventListener("click",()=>$("#orderDialog").close());$("#cancelDialog").addEventListener("click",()=>$("#orderDialog").close());
$("#orderForm").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget),number=f.get("number").trim();if(data.orders.some(o=>o.number.toLowerCase()===number.toLowerCase()))return toast("Já existe uma OS com esse número.");data.orders.push({id:crypto.randomUUID(),number,piece:f.get("piece"),material:f.get("material"),weight:f.get("weight"),entryDate:f.get("entryDate"),dueDate:f.get("dueDate"),measure:f.get("measure"),status:f.get("status"),service:f.get("service"),createdAt:Date.now()});save();$("#orderDialog").close();toast("Ordem de serviço cadastrada.")});
$("#orderSearch").addEventListener("input",renderOrders);$("#statusFilter").addEventListener("change",renderOrders);
document.addEventListener("click",e=>{
 const del=e.target.closest("[data-delete]");if(del){if(confirm("Excluir esta OS e seus registros relacionados?")){const id=del.dataset.delete;data.orders=data.orders.filter(o=>o.id!==id);["quality","outsourcing","incidents"].forEach(k=>data[k]=data[k].filter(x=>x.orderId!==id));save();toast("Ordem excluída.");}}
 const edit=e.target.closest("[data-edit-status]");if(edit){const o=orderById(edit.dataset.editStatus);const next=prompt("Novo status:\n"+STATUSES.join("\n"),o.status);if(STATUSES.includes(next)){o.status=next;save();toast("Status atualizado.");}}
});
document.addEventListener("change",e=>{if(e.target.matches("[data-status]")){const o=orderById(e.target.dataset.status);o.status=e.target.value;save();toast("Etapa de produção atualizada.")}});
$("#qualityForm").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget);data.quality.push({orderId:f.get("orderId"),initialWeight:f.get("initialWeight"),finalWeight:f.get("finalWeight"),finalMeasure:f.get("finalMeasure"),qualityNotes:f.get("qualityNotes"),date:todayISO()});save();e.currentTarget.reset();toast("Conferência registrada.")});
$("#outsourcingForm").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget);data.outsourcing.push(Object.fromEntries(f.entries()));const o=orderById(f.get("orderId"));if(o)o.status="Em ourives externo";save();e.currentTarget.reset();toast("Envio registrado.")});
$("#incidentForm").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget);data.incidents.push(Object.fromEntries(f.entries()));save();e.currentTarget.reset();toast("Ocorrência registrada.")});
$("#exportBtn").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="backup-ourine.json";a.click();URL.revokeObjectURL(a.href);toast("Backup exportado.")});
$("#importBtn").addEventListener("click",()=>$("#importFile").click());
$("#importFile").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;try{const parsed=JSON.parse(await file.text());if(!parsed.orders||!parsed.quality||!parsed.outsourcing||!parsed.incidents)throw Error();data=parsed;save();toast("Backup importado.")}catch{toast("Arquivo inválido.")}e.target.value=""});
$("#today").textContent=new Intl.DateTimeFormat("pt-BR",{dateStyle:"medium"}).format(new Date());
renderAll();
