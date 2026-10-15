(()=>{'use strict';
const $=id=>document.getElementById(id), fmt=n=>new Intl.NumberFormat('es-ES').format(n);
const rarityNames={Common:'Común',Uncommon:'Poco común',Rare:'Raro',Epic:'Épico',Legendary:'Legendario'};
const startStars={Common:1,Uncommon:2,Rare:3,Epic:4,Legendary:5};
const xp=[8000,42000,154000,442800,971500,2196000],xpLabels=['1–10','11–20','21–30','31–40','41–50','51–60'];
const skill={
 Common:{gold:33000,rare:64,epic:0,legendary:0,skills:6},
 Uncommon:{gold:99000,rare:80,epic:0,legendary:0,skills:6},
 Rare:{gold:330000,rare:114,epic:44,legendary:0,skills:6},
 Epic:{gold:962500,rare:130,epic:97,legendary:30,skills:7},
 Legendary:{gold:1925000,rare:226,epic:168,legendary:118,skills:7}
};
const ascGold={
 Common:[250,2500,15000,30000,75000],
 Uncommon:[0,5000,25000,50000,100000],
 Rare:[0,0,35000,75000,150000],
 Epic:[0,0,0,125000,250000],
 Legendary:[0,0,0,0,600000]
};
const food={
 Common:{invokers:719,xp:14550000,gold:1095000},
 Uncommon:{invokers:718,xp:14550000,gold:1152250},
 Rare:{invokers:714,xp:14534000,gold:1231750},
 Epic:{invokers:696,xp:14336000,gold:1337000},
 Legendary:{invokers:600,xp:12664000,gold:1450000}
};
const awaken={
 low:{label:'Común / poco común / raro',spark:1250,ancient:110,enchanted:53,divine:53,raw:20,refined:16,pure:15,astralRaw:55,astralRefined:35,astralPure:35,novice:60,expert:100,master:100},
 Epic:{label:'Épico',spark:2170,ancient:155,enchanted:110,divine:90,raw:37,refined:30,pure:31,astralRaw:80,astralRefined:59,astralPure:89,novice:100,expert:140,master:140},
 Legendary:{label:'Legendario',spark:3100,ancient:220,enchanted:155,divine:135,raw:55,refined:50,pure:48,astralRaw:130,astralRefined:88,astralPure:130,novice:160,expert:180,master:180}
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function setup(){
 const rarity=$('calcRarity'),stars=$('calcStars'),faction=$('calcFaction');
 if(!rarity||!stars||!faction)return;
 const roster=window.UNDW_INVOKERS?.champions||[];
 const factions=[...new Set(roster.map(c=>c.faction).filter(Boolean))].sort();
 faction.innerHTML=factions.length?factions.map(f=>'<option>'+esc(f)+'</option>').join():'<option>Seleccionar</option>';
 const makeStars=()=>{let start=startStars[rarity.value]||1;stars.innerHTML=Array.from({length:6-start},(_,i)=>{let n=start+i;return '<option value="'+n+'" '+(n===start?'selected':'')+'>'+n+'★</option>'}).join();};
 rarity.addEventListener('change',()=>{makeStars();render()});
 for(const id of ['calcStars','calcCount','calcFaction','calcElement','calcClass'])$(id).addEventListener('input',render);
 for(const id of ['calcStars','calcCount','calcFaction','calcElement','calcClass'])$(id).addEventListener('change',render);
 makeStars();render();
}
function render(){
 const r=$('calcRarity')?.value||'Rare', start=startStars[r], current=Number($('calcStars')?.value||start);
 const count=Math.max(1,Math.min(99,Number($('calcCount')?.value||1)));
 const label=rarityNames[r], aw=r==='Epic'?'Epic':r==='Legendary'?'Legendary':'low', a=awaken[aw];
 const faction=$('calcFaction')?.value||'facción elegida',element=$('calcElement')?.value||'elemento elegido',klass=$('calcClass')?.value||'clase elegida';
 let echo=0,gold=0,rows='';
 for(let star=current;star<=5;star++){echo+=star;gold+=ascGold[r][star-1]||0;rows+='<tr><td>'+star+'★ → '+(star+1)+'★</td><td>'+star+' Echoes</td><td>'+fmt((ascGold[r][star-1]||0)*count)+'</td></tr>'}
 const xp50=xp.slice(0,5).reduce((a,b)=>a+b,0), xp60=xp.reduce((a,b)=>a+b,0), sk=skill[r],fo=food[r];
 const xpRows=xp.map((v,i)=>'<tr><td>Niveles '+xpLabels[i]+'</td><td>'+fmt(v*count)+'</td></tr>').join('');
 $('calcResults').innerHTML=
 '<article class="calc-card"><span class="tag">Experiencia</span><h3>'+label+' · '+count+(count===1?' campeón':' campeones')+'</h3><p>La XP no cambia por rareza. Sube de nivel según el tope de cada ascensión.</p><div class="calc-total">'+fmt(xp60*count)+' XP hasta nivel 60</div><p>'+fmt(xp50*count)+' XP hasta nivel 50 (requisito para pasar de 5★ a 6★).</p><table><tbody>'+xpRows+'</tbody></table></article>'+
 '<article class="calc-card"><span class="tag">Ascensión a 6★ doradas</span><h3>Desde '+current+'★ · '+label+'</h3><p>Coste restante para los campeones seleccionados. Puedes usar Echoes o campeones de la misma cantidad de estrellas.</p><div class="calc-total">'+fmt(echo*count)+' Echoes · '+fmt(gold*count)+' de oro</div><table><thead><tr><th>Paso</th><th>Echoes</th><th>Oro total</th></tr></thead><tbody>'+rows+'</tbody></table><p style="margin-top:10px">Si empiezas desde la rareza base ('+start+'★), ruta de comida con comunes de 1★: <b>'+fmt(fo.invokers*count)+' comunes</b>, '+fmt(fo.xp*count)+' XP de comida y '+fmt(fo.gold*count)+' de oro en total. La comida no tiene que estar nivelada al consumirla.</p></article>'+
 '<article class="calc-card"><span class="tag">Habilidades al máximo</span><h3>'+label+' · todas las habilidades y tolerancias</h3><p>Estimación para completar el conjunto de '+sk.skills+' habilidades/tolerancias.</p><div class="calc-total">'+fmt(sk.gold*count)+' de oro</div><table><tbody><tr><td>Códices raros</td><td>'+fmt(sk.rare*count)+'</td></tr><tr><td>Códices épicos</td><td>'+fmt(sk.epic*count)+'</td></tr><tr><td>Códices legendarios</td><td>'+fmt(sk.legendary*count)+'</td></tr></tbody></table></article>'+
 '<article class="calc-card"><span class="tag">Despertar nivel 6 · estrellas moradas</span><h3>'+label+' · '+a.label+'</h3><p>Se necesitan materiales de la '+esc(faction)+', elemento '+esc(element)+' y clase '+esc(klass)+'.</p><div class="calc-total">'+fmt(a.spark*count)+' Chispas de Titán</div><table><thead><tr><th>Material</th><th>Total</th></tr></thead><tbody><tr><td>Runas antiguas / encantadas / divinas de '+esc(faction)+'</td><td>'+fmt(a.ancient*count)+' / '+fmt(a.enchanted*count)+' / '+fmt(a.divine*count)+'</td></tr><tr><td>Esencias elementales brutas / refinadas / puras ('+esc(element)+')</td><td>'+fmt(a.raw*count)+' / '+fmt(a.refined*count)+' / '+fmt(a.pure*count)+'</td></tr><tr><td>Esencias astrales brutas / refinadas / puras</td><td>'+fmt(a.astralRaw*count)+' / '+fmt(a.astralRefined*count)+' / '+fmt(a.astralPure*count)+'</td></tr><tr><td>Emblemas de clase novato / experto / maestro ('+esc(klass)+')</td><td>'+fmt(a.novice*count)+' / '+fmt(a.expert*count)+' / '+fmt(a.master*count)+'</td></tr></tbody></table></article>';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();