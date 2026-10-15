(()=>{'use strict';
const root=document, esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])), fmt=n=>new Intl.NumberFormat('es-ES').format(n);
const rarity={Rare:'Raro',Epic:'Épico',Legendary:'Legendario',Mythical:'Mítico'};
const score={Rare:1,Epic:2,Legendary:3,Mythical:4};
const catalog=window.UNDW_TITANS?.titans||[];
const champions=window.UNDW_INVOKERS?.champions||[];
function renderRoster(){
 const faction=root.getElementById('titanFaction'), raritySel=root.getElementById('titanRarity'), q=(root.getElementById('titanSearch').value||'').toLocaleLowerCase('es');
 if(faction.options.length===1)[...new Set(catalog.map(t=>t.faction))].sort().forEach(f=>{const o=root.createElement('option');o.value=f;o.textContent=f;faction.appendChild(o)});
 const rows=catalog.filter(t=>(!faction.value||t.faction===faction.value)&&(!raritySel.value||t.rarity===raritySel.value)&&(!q||t.name.toLocaleLowerCase('es').includes(q)));
 const groups=[...new Set(rows.map(t=>t.faction))];
 root.getElementById('titanRoster').innerHTML=groups.map(f=>'<h3 class="titanHeading">'+esc(f)+' <span class="rarityCount">'+rows.filter(t=>t.faction===f).length+' Titanes</span></h3>'+rows.filter(t=>t.faction===f).map(t=>'<article class="card titanCard"><img class="titanPortrait" src="'+esc(t.image)+'" alt="Imagen oficial de '+esc(t.name)+'" loading="lazy"><span class="tag">'+esc(rarity[t.rarity])+' · '+esc(t.faction)+'</span><h3>'+esc(t.name)+'</h3><p class="titanMeta">Compatible con Invokers '+(t.faction==='Guardians'?'de cualquier facción':'de '+esc(t.faction))+'</p><p style="margin-top:10px"><a href="'+esc(t.profile)+'" target="_blank" rel="noopener">Ver habilidades y ficha oficial ↗</a></p></article>').join('')).join('')||'<article class="card">No hay Titanes con esos filtros.</article>';
}
function updatePairChoices(){
 const champ=root.getElementById('pairChampion'), titanSel=root.getElementById('pairTitan'), c=champions[Number(champ.value)]||champions[0];if(!c)return;
 const options=catalog.filter(t=>t.faction===c.faction||t.name==='Litria').sort((a,b)=>score[b.rarity]-score[a.rarity]||a.name.localeCompare(b.name));
 const previous=titanSel.value;
 titanSel.innerHTML=options.map(t=>'<option value="'+esc(t.name)+'">'+esc(t.name)+' · '+esc(rarity[t.rarity])+(t.name==='Litria'?' · universal':'')+'</option>').join('');
 if(options.some(o=>o.name===previous))titanSel.value=previous;
 renderPair();
}
function renderPair(){
 const c=champions[Number(root.getElementById('pairChampion').value)]||champions[0], t=catalog.find(x=>x.name===root.getElementById('pairTitan').value);
 if(!c||!t)return;
 root.getElementById('titanPair').innerHTML='<article class="pairCard"><img src="'+esc(c.image)+'" alt="Imagen oficial de '+esc(c.name)+'"><span class="tag">Invoker · '+esc(c.faction)+'</span><h3>'+esc(c.name)+'</h3><p>'+esc(c.rarity)+'</p><p><a href="'+esc(c.profile)+'" target="_blank" rel="noopener">Ficha del campeón ↗</a></p></article><div class="pairArrow" aria-hidden="true">⟷</div><article class="pairCard"><img src="'+esc(t.image)+'" alt="Imagen oficial de '+esc(t.name)+'"><span class="tag">Titán '+esc(rarity[t.rarity])+' · '+esc(t.faction)+'</span><h3>'+esc(t.name)+'</h3><p>Compatible por facción'+(t.name==='Litria'?' universal':'')+'. Revisa su efecto vinculado para elegirlo por modo.</p><p><a href="'+esc(t.profile)+'" target="_blank" rel="noopener">Habilidades y efecto vinculado ↗</a></p></article>';
}
function initPair(){
 const champ=root.getElementById('pairChampion');
 champ.innerHTML=champions.map((c,i)=>'<option value="'+i+'">'+esc(c.name)+' · '+esc(c.faction)+'</option>').join('');
 champ.addEventListener('change',updatePairChoices);
 root.getElementById('pairTitan').addEventListener('change',renderPair);
 updatePairChoices();
}
function initCalc(){
 const r=root.getElementById('tcalcRarity'), n=root.getElementById('tcalcName');
 function updateNames(){const prev=n.value;n.innerHTML=catalog.filter(t=>t.rarity===r.value).map(t=>'<option value="'+esc(t.name)+'">'+esc(t.name)+' · '+esc(t.faction)+'</option>').join('');if([...n.options].some(o=>o.value===prev))n.value=prev;renderCalc();}
 r.addEventListener('change',updateNames);n.addEventListener('change',renderCalc);root.getElementById('tcalcCount').addEventListener('input',renderCalc);updateNames();
}
function renderCalc(){
 const k=root.getElementById('tcalcRarity').value,count=Math.max(1,Math.min(99,Number(root.getElementById('tcalcCount').value)||1)), t=catalog.find(x=>x.name===root.getElementById('tcalcName').value);
 const costs={
 Rare:{start:3,gold:260000,skills:{sparks:10200,gold:412500,rare:191,epic:69,legendary:18},heart:'Titanhearts',empower:6},
 Epic:{start:4,gold:375000,skills:{sparks:12240,gold:838750,rare:191,epic:191,legendary:69},heart:'Titanhearts',empower:12},
 Legendary:{start:5,gold:600000,skills:{sparks:14280,gold:1677500,rare:191,epic:191,legendary:191},heart:'Elder Titanhearts',empower:6},
 Mythical:{start:6,gold:0,skills:{sparks:16320,gold:2062500,rare:217,epic:217,legendary:217},heart:'Elder Titanhearts',empower:12}
 }[k];
 let souls=0;for(let s=costs.start;s<6;s++)souls+=s;
 const xp=3814300,levelSparks=12130,skill=costs.skills;
 root.getElementById('titanCalcResults').innerHTML=
 '<article class="calc-card"><span class="tag">Nivel 60</span><h3>'+esc(t?.name||rarity[k])+' · experiencia</h3><p>Todos los Titanes usan pociones de experiencia; el coste total de referencia no cambia por rareza.</p><div class="calc-total">'+fmt(xp*count)+' XP</div><table><tbody><tr><td>Chispas para subir al nivel 60</td><td>'+fmt(levelSparks*count)+'</td></tr><tr><td>Nivel máximo</td><td>60</td></tr></tbody></table></article>'+
 '<article class="calc-card"><span class="tag">Ascensión a 6★</span><h3>Desde '+costs.start+'★ · '+rarity[k]+'</h3><p>Usa Titanes o Almas de Dragón del mismo número de estrellas que el rango actual.</p><div class="calc-total">'+(souls?fmt(souls*count)+' Almas de Dragón/Titanes':'Ya empieza en 6★')+'</div><table><tbody><tr><td>Oro estimado hasta 6★</td><td>'+(costs.gold?fmt(costs.gold*count):'0')+'</td></tr><tr><td>Rangos</td><td>'+costs.start+'★ → 6★</td></tr></tbody></table></article>'+
 '<article class="calc-card"><span class="tag">Habilidades al máximo</span><h3>Coste por rareza</h3><p>Prismas para mejorar habilidades y efectos vinculados.</p><div class="calc-total">'+fmt(skill.sparks*count)+' Chispas · '+fmt(skill.gold*count)+' oro</div><table><tbody><tr><td>Prismas raros</td><td>'+fmt(skill.rare*count)+'</td></tr><tr><td>Prismas épicos</td><td>'+fmt(skill.epic*count)+'</td></tr><tr><td>Prismas legendarios</td><td>'+fmt(skill.legendary*count)+'</td></tr></tbody></table></article>'+
 '<article class="calc-card"><span class="tag">Empoderamiento</span><h3>Máximo de referencia</h3><p>Cada estrella púrpura mejora el efecto vinculado.</p><div class="calc-total">'+fmt(costs.empower*count)+' '+costs.heart+'</div><table><tbody><tr><td>Coste oficial por estrella</td><td>'+(k==='Rare'?'1 Titanheart':k==='Epic'?'2 Titanhearts':k==='Legendary'?'1 Elder Titanheart':'Pendiente de publicación oficial')+'</td></tr><tr><td>Estrellas usadas en este total</td><td>'+costs.empower+'</td></tr></tbody></table></article>'+
 (k==='Mythical'?'<p class="note" style="grid-column:1/-1">Para Titanes míticos, HitZone no publica cuántos Titanhearts se necesitan por estrella. Los 12 Elder Titanhearts y los costes de prismas/oro son referencias comunitarias, no valores oficiales.</p>':'');
}
root.getElementById('titanFaction').addEventListener('change',renderRoster);
root.getElementById('titanRarity').addEventListener('change',renderRoster);
root.getElementById('titanSearch').addEventListener('input',renderRoster);
initPair();initCalc();renderRoster();
})();