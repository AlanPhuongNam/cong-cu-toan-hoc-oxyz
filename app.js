const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
const EPS=1e-9;
const V=(x,y,z)=>[+x,+y,+z], add=(a,b)=>a.map((x,i)=>x+b[i]), sub=(a,b)=>a.map((x,i)=>x-b[i]), mul=(a,k)=>a.map(x=>x*k);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0), cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]], norm=a=>Math.sqrt(dot(a,a));
const fmt=n=>Number.isFinite(n)?(Math.abs(n)<1e-10?0:+n.toFixed(6)).toString():'Không xác định';
const vec=a=>`(${a.map(fmt).join('; ')})`, esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function fields(group,items){return `<div class="object-title">${group}</div><div class="field-grid">${items.map((x,i)=>`<div class="coord-field"><label>${x}</label><input type="number" step="any" value="0" data-key="${group}-${i}"></div>`).join('')}</div>`}
function obj(title,prefix){return `<div class="object-title">${title}</div>${fields(prefix+' point',['x','y','z'])}${fields(prefix+' vector',['x','y','z'])}`}
function plane(title,prefix){return `<div class="object-title">${title}</div>${fields(prefix+' coefficients',['A','B','C'])}<div class="field-grid"><div class="coord-field"><label>D</label><input type="number" step="any" value="0" data-key="${prefix}D"></div></div>`}
function read(prefix){return [0,1,2].map(i=>+($(`[data-key="${prefix}-${i}"]`)?.value||0))}
function readD(prefix){return +($(`[data-key="${prefix}D"]`)?.value||0)}
function resultHTML(title,value,unit,formula,steps){return `<div class="result-content"><div class="eyebrow">COMPUTATION RESULT</div><div>${title}</div><div class="result-number">${value} <span class="result-unit">${unit||''}</span></div><div class="formula-box">${formula}</div>${steps.map((s,i)=>`<div class="solution-step"><b>Bước ${i+1}.</b> ${s}</div>`).join('')}</div>`}
function showResult(id,html){$(id).innerHTML=html;if(window.MathJax?.typesetPromise)MathJax.typesetPromise([$(id)]);}
function makeFieldSet(id,html){$(id).innerHTML=html}
function setupDistance(){
 const type=$('#distance-type');
 function render(){let t=type.value,h='';
 if(t==='skew')h=obj('Đường thẳng d₁','A')+obj('Đường thẳng d₂','B');
 if(t==='pointPlane')h=fields('Điểm M',['x','y','z'])+plane('Mặt phẳng (P)','P');
 if(t==='pointLine')h=fields('Điểm M',['x','y','z'])+obj('Đường thẳng d','A');
 if(t==='planePlane')h=plane('Mặt phẳng (P)','P')+plane('Mặt phẳng (Q)','Q');
 if(t==='pointPoint')h=fields('Điểm A',['x','y','z'])+fields('Điểm B',['x','y','z']);
 makeFieldSet('#distance-fields',h);
 }
 type.addEventListener('change',render);render();
 $('#distance-calc').onclick=()=>{
 let t=type.value,html='',d=0,steps=[],formula='';
 if(t==='skew'){let A=read('A point'),u=read('A vector'),B=read('B point'),v=read('B vector'),c=cross(u,v),cn=norm(c);if(cn<EPS){showResult('#distance-result','<div class="feedback">Hai vectơ chỉ phương cùng phương. Hai đường thẳng song song hoặc trùng nhau; hãy chọn phép tính phù hợp.</div>');return;}d=Math.abs(dot(sub(B,A),c))/cn;formula='d = |AB · (u × v)| / |u × v|';steps=[`A ${vec(A)}, B ${vec(B)}.`,`u × v = ${vec(c)}; |u × v| = ${fmt(cn)}.`,`AB = ${vec(sub(B,A))}; |AB · (u × v)| = ${fmt(Math.abs(dot(sub(B,A),c)))}.`];}
 if(t==='pointPlane'){let M=read('Điểm M'),n=read('P coefficients'),D=readD('P');if(norm(n)<EPS){showResult('#distance-result','<div class="feedback">Vectơ pháp tuyến không được bằng vectơ không.</div>');return;}d=Math.abs(dot(n,M)+D)/norm(n);formula='d(M,(P)) = |Axₘ + Byₘ + Czₘ + D| / √(A²+B²+C²)';steps=[`Thay M ${vec(M)} và (A,B,C) = ${vec(n)}, D = ${fmt(D)}.`,`Tử số = ${fmt(Math.abs(dot(n,M)+D))}; mẫu số = ${fmt(norm(n))}.`];}
 if(t==='pointLine'){let M=read('Điểm M'),A=read('A point'),u=read('A vector');if(norm(u)<EPS){showResult('#distance-result','<div class="feedback">Vectơ chỉ phương không được bằng vectơ không.</div>');return;}d=norm(cross(sub(M,A),u))/norm(u);formula='d(M,d) = |AM × u| / |u|';steps=[`AM = ${vec(sub(M,A))}; u = ${vec(u)}.`,`AM × u = ${vec(cross(sub(M,A),u))}.`];}
 if(t==='planePlane'){let n=read('P coefficients'),D=readD('P'),m=read('Q coefficients'),E=readD('Q');if(norm(n)<EPS||norm(m)<EPS||norm(cross(n,m))>1e-7){showResult('#distance-result','<div class="feedback">Hai mặt phẳng phải có vectơ pháp tuyến cùng phương và khác vectơ không.</div>');return;}let k=Math.abs(n[0])>EPS?m[0]/n[0]:Math.abs(n[1])>EPS?m[1]/n[1]:m[2]/n[2];d=Math.abs(E-k*D)/norm(m);formula='d((P),(Q)) = |D₂ − kD₁| / √(A₂²+B₂²+C₂²)';steps=[`Hai pháp tuyến tỉ lệ với hệ số k = ${fmt(k)}.`,`Khoảng cách = ${fmt(d)}.`];}
 if(t==='pointPoint'){let A=read('Điểm A'),B=read('Điểm B');d=norm(sub(A,B));formula='AB = √[(xB−xA)² + (yB−yA)² + (zB−zA)²]';steps=[`A ${vec(A)}, B ${vec(B)}.`,`AB = |B − A| = ${fmt(d)}.`];}
 html=resultHTML('Khoảng cách / Distance',fmt(d),'đơn vị (units)',formula,steps);showResult('#distance-result',html);
 };
 $('#distance-reset').onclick=()=>{render();$('#distance-result').innerHTML='<div class="empty-result"><div class="empty-symbol">∑</div><b>Chưa có kết quả</b><small>Nhập dữ kiện và nhấn tính toán.</small></div>';};
}
function setupAngles(){
 const type=$('#angle-type');
 function render(){let t=type.value;makeFieldSet('#angle-fields',t==='lineLine'?fields('Vectơ chỉ phương u',['x','y','z'])+fields('Vectơ chỉ phương v',['x','y','z']):t==='linePlane'?fields('Vectơ chỉ phương u',['x','y','z'])+fields('Pháp tuyến n',['x','y','z']):fields('Pháp tuyến n₁',['x','y','z'])+fields('Pháp tuyến n₂',['x','y','z']));}
 type.onchange=render;render();
 $('#angle-calc').onclick=()=>{let t=type.value,a=read(t==='planePlane'?'Pháp tuyến n₁':'Vectơ chỉ phương u'),b=read(t==='lineLine'?'Vectơ chỉ phương v':t==='linePlane'?'Pháp tuyến n':'Pháp tuyến n₂');if(norm(a)<EPS||norm(b)<EPS){showResult('#angle-result','<div class="feedback">Các vectơ phải khác vectơ không.</div>');return;}let ratio=Math.min(1,Math.abs(dot(a,b))/(norm(a)*norm(b))),rad=t==='linePlane'?Math.asin(ratio):Math.acos(ratio),deg=rad*180/Math.PI;let formula=t==='linePlane'?'sin α = |u · n| / (|u||n|)':'cos φ = |a · b| / (|a||b|)';showResult('#angle-result',resultHTML('Góc / Angle',fmt(deg),'độ (degrees)',formula,[`a = ${vec(a)}, b = ${vec(b)}.`,`Giá trị lượng giác = ${fmt(ratio)}.`,`Góc cần tìm = ${fmt(deg)}°.`]));};
}
function setupEquations(){
 const type=$('#equation-type');
 function render(){let t=type.value;makeFieldSet('#equation-fields',t==='plane'?fields('Điểm M₀',['x','y','z'])+fields('Vectơ pháp tuyến n',['x','y','z']):t==='line'?fields('Điểm A',['x','y','z'])+fields('Vectơ chỉ phương u',['x','y','z']):fields('Điểm A trên đường thẳng',['x','y','z'])+fields('Vectơ chỉ phương u',['x','y','z'])+fields('Pháp tuyến mặt phẳng n',['x','y','z'])+'<div class="object-title">Hệ số D của mặt phẳng</div><div class="field-grid"><div class="coord-field"><label>D</label><input data-key="planeD" type="number" value="0"></div></div>');}
 type.onchange=render;render();
 $('#equation-calc').onclick=()=>{let t=type.value,html='';if(t==='plane'){let p=read('Điểm M₀'),n=read('Vectơ pháp tuyến n');if(norm(n)<EPS){showResult('#equation-result','<div class="feedback">Pháp tuyến phải khác vectơ không.</div>');return;}let D=-dot(n,p);html=resultHTML('Phương trình mặt phẳng / Plane equation',`${fmt(n[0])}(x − ${fmt(p[0])}) + ${fmt(n[1])}(y − ${fmt(p[1])}) + ${fmt(n[2])}(z − ${fmt(p[2])}) = 0`,'',`A(x−x₀)+B(y−y₀)+C(z−z₀)=0`,[`M₀ = ${vec(p)}, n = ${vec(n)}.`,`D = −n · M₀ = ${fmt(D)}.`,`Dạng tổng quát: ${fmt(n[0])}x + ${fmt(n[1])}y + ${fmt(n[2])}z + (${fmt(D)}) = 0.`]);}
 if(t==='line'){let p=read('Điểm A'),u=read('Vectơ chỉ phương u');if(norm(u)<EPS){showResult('#equation-result','<div class="feedback">Vectơ chỉ phương phải khác vectơ không.</div>');return;}html=resultHTML('Phương trình đường thẳng / Line equation',`(x − ${fmt(p[0])})/${fmt(u[0])} = (y − ${fmt(p[1])})/${fmt(u[1])} = (z − ${fmt(p[2])})/${fmt(u[2])}`,'',`(x−x₀)/a = (y−y₀)/b = (z−z₀)/c`,[`A = ${vec(p)}, u = ${vec(u)}.`,`Thay tọa độ điểm và vectơ chỉ phương vào dạng chính tắc.`,`Nếu một thành phần của u bằng 0, tọa độ tương ứng được hiểu là hằng số.`]);}
 if(t==='intersection'){let A=read('Điểm A trên đường thẳng'),u=read('Vectơ chỉ phương u'),n=read('Pháp tuyến mặt phẳng n'),D=+($('[data-key="planeD"]')?.value||0);let den=dot(n,u),num=-(dot(n,A)+D);if(Math.abs(den)<EPS){let msg=Math.abs(num)<EPS?'Đường thẳng nằm trong mặt phẳng.':'Đường thẳng song song với mặt phẳng, không có giao điểm.';showResult('#equation-result',resultHTML('Kết luận',msg,'','n · (A + tu) + D = 0',[`n · u = ${fmt(den)}.`,`Kiểm tra n · A + D = ${fmt(dot(n,A)+D)}.`]));return;}let k=num/den,P=add(A,mul(u,k));html=resultHTML('Giao điểm / Intersection',`I = ${vec(P)}`,'',`X = A + tu; n · X + D = 0`,[`Tham số t = −(n · A + D)/(n · u) = ${fmt(k)}.`,`I = A + ${fmt(k)}u = ${vec(P)}.`]);}
 showResult('#equation-result',html);};
}
function setupRelations(){
 makeFieldSet('#relation-fields',obj('Đường thẳng d₁','A')+obj('Đường thẳng d₂','B'));
 $('#relation-calc').onclick=()=>{let A=read('A point'),u=read('A vector'),B=read('B point'),v=read('B vector');if(norm(u)<EPS||norm(v)<EPS){showResult('#relation-result','<div class="feedback">Hai vectơ chỉ phương phải khác vectơ không.</div>');return;}let c=cross(u,v),cp=norm(c),ab=sub(B,A),col=norm(cross(ab,u))<1e-8;
 let title,details=[];if(cp<EPS){if(col){title='Hai đường thẳng trùng nhau / Coincident';details=['Hai vectơ chỉ phương cùng phương.','Vectơ AB cũng cùng phương với u, nên hai đường thẳng trùng nhau.'];}else{title='Hai đường thẳng song song / Parallel';details=['Hai vectơ chỉ phương cùng phương.','AB không cùng phương với u, nên hai đường thẳng song song phân biệt.'];}}
 else if(Math.abs(dot(ab,c))<1e-8){title='Hai đường thẳng cắt nhau / Intersecting';let t=dot(cross(ab,v),c)/dot(c,c);let P=add(A,mul(u,t));details=[`Tích hỗn tạp AB · (u × v) = 0.`,`Giao điểm I = ${vec(P)}.`];}
 else{title='Hai đường thẳng chéo nhau / Skew';let dist=Math.abs(dot(ab,c))/cp;details=[`Tích hỗn tạp AB · (u × v) = ${fmt(dot(ab,c))} ≠ 0.`,`Khoảng cách giữa hai đường thẳng = ${fmt(dist)}.`];}
 showResult('#relation-result',resultHTML('Vị trí tương đối',title,'','Xét u × v và AB · (u × v)',details));};
}
const questions=[
 {q:'Trong Oxyz, khoảng cách từ M(1; 2; 2) đến mặt phẳng x + 2y + 2z − 9 = 0 bằng bao nhiêu?',a:['1','2','3','4'],correct:0,why:'d = |1 + 4 + 4 − 9| / √(1²+2²+2²) = 0. Chú ý: đáp án đúng là 0; hãy kiểm tra các lựa chọn?'},
 {q:'Hai đường thẳng có vectơ chỉ phương u = (1; 0; 0), v = (0; 1; 0). Góc giữa chúng là:',a:['0°','30°','90°','180°'],correct:2,why:'u · v = 0 nên hai vectơ vuông góc, góc giữa hai đường thẳng là 90°.'},
 {q:'Mặt phẳng 2x − y + 3z + 4 = 0 có một vectơ pháp tuyến là:',a:['(2; −1; 3)','(2; 1; 3)','(−2; 1; 4)','(1; 2; 3)'],correct:0,why:'Các hệ số của x, y, z chính là tọa độ một vectơ pháp tuyến.'}
];
questions[0]={q:'Trong Oxyz, khoảng cách từ M(1; 2; 2) đến mặt phẳng x + 2y + 2z − 9 = 0 bằng bao nhiêu?',a:['0','1','2','3'],correct:0,why:'d = |1 + 2·2 + 2·2 − 9| / √(1²+2²+2²) = 0.'};
let qIndex=0,answered=new Set();
function renderPractice(){let q=questions[qIndex];$('#practice-progress').textContent=`${answered.size}/3 completed`;$('[class="step-tag"]', $('.practice-panel')).textContent=`QUESTION 0${qIndex+1} / 03`;$('#practice-content').innerHTML=`<div class="practice-question">${q.q}</div><div class="answers">${q.a.map((a,i)=>`<button class="answer-option" data-answer="${i}">${String.fromCharCode(65+i)}. ${a}</button>`).join('')}</div><div id="practice-feedback"></div>`;$$('[data-answer]').forEach(b=>b.onclick=()=>{if(answered.has(qIndex))return;let n=+b.dataset.answer;answered.add(qIndex);b.classList.add(n===q.correct?'correct':'wrong');$$('[data-answer]').forEach(x=>x.disabled=true);$('#practice-feedback').innerHTML=`<div class="feedback">${n===q.correct?'Chính xác!':'Chưa chính xác.'} ${q.why}</div>`;$('#practice-progress').textContent=`${answered.size}/3 completed`;});}
function initNavigation(){$$('.nav-item').forEach(b=>b.onclick=()=>go(b.dataset.view));$$('[data-goto]').forEach(b=>b.onclick=()=>go(b.dataset.goto));}
function go(name){$$('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${name}`));$$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===name));$('#crumb-current').textContent=name.toUpperCase();window.scrollTo({top:0,behavior:'smooth'});}
function init3D(){if(!window.THREE)return;const targets=['scene-distance','scene-angle'];targets.forEach((id,idx)=>{let el=$('#'+id);if(!el)return;el.innerHTML='';let scene=new THREE.Scene();scene.background=new THREE.Color(0xf5f8fc);let camera=new THREE.PerspectiveCamera(42,el.clientWidth/220,.1,100);camera.position.set(5,4,6);let renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(el.clientWidth,220);el.appendChild(renderer.domElement);scene.add(new THREE.AmbientLight(0xffffff,.8));let light=new THREE.DirectionalLight(0xffffff,1.2);light.position.set(4,6,5);scene.add(light);let axes=new THREE.AxesHelper(3.2);scene.add(axes);let grid=new THREE.GridHelper(6,12,0xc1cfdf,0xe0e7ef);grid.rotation.x=Math.PI/2;grid.position.z=-.01;scene.add(grid);let mat=new THREE.MeshStandardMaterial({color:idx?0x398f89:0x3d70a8,roughness:.55,side:THREE.DoubleSide,transparent:true,opacity:.65});let plane=new THREE.Mesh(new THREE.PlaneGeometry(3.5,2.6),mat);plane.position.set(.5,.6,.8);plane.rotation.set(.55,.25,-.35);scene.add(plane);let lineMat=new THREE.LineBasicMaterial({color:0x254e7d});let pts=[new THREE.Vector3(-2,-1,-.5),new THREE.Vector3(2,1,1.5)];scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),lineMat));let sphere=new THREE.Mesh(new THREE.SphereGeometry(.09,16,12),new THREE.MeshStandardMaterial({color:0xd18b42}));sphere.position.set(1,1,1.2);scene.add(sphere);camera.lookAt(0,0,0);let dragging=false,lastX=0,lastY=0;renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});renderer.domElement.addEventListener('pointerup',()=>dragging=false);renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;let dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;scene.rotation.z+=dx*.008;scene.rotation.x+=dy*.008;renderer.render(scene,camera)});renderer.domElement.addEventListener('wheel',e=>{camera.position.multiplyScalar(e.deltaY>0?1.08:.92);renderer.render(scene,camera)},{passive:true});renderer.render(scene,camera);});}

function initAppearance(){
 const body=document.body,themeButton=$('#theme-toggle'),themeIcon=$('.theme-icon'),themeLabel=$('.theme-label');
 let fontLevel=Number(localStorage.getItem('oxyz-font-level')||1);
 const levels=[1,1.1,1.2];
 function applyFont(){body.style.zoom=String(levels[fontLevel]);localStorage.setItem('oxyz-font-level',String(fontLevel));}
 function applyTheme(dark){body.classList.toggle('dark-theme',dark);themeButton.setAttribute('aria-pressed',String(dark));themeIcon.textContent=dark?'☀':'☾';themeLabel.textContent=dark?'Giao diện sáng':'Giao diện tối';localStorage.setItem('oxyz-theme',dark?'dark':'light');}
 $('#font-decrease').addEventListener('click',()=>{fontLevel=Math.max(0,fontLevel-1);applyFont();});
 $('#font-increase').addEventListener('click',()=>{fontLevel=Math.min(levels.length-1,fontLevel+1);applyFont();});
 themeButton.addEventListener('click',()=>applyTheme(!body.classList.contains('dark-theme')));
 applyFont();applyTheme(localStorage.getItem('oxyz-theme')==='dark');
}

window.addEventListener('load',()=>{initAppearance();initNavigation();setupDistance();setupAngles();setupEquations();setupRelations();renderPractice();$('#practice-next').onclick=()=>{qIndex=(qIndex+1)%questions.length;renderPractice()};$('#practice-prev').onclick=()=>{qIndex=(qIndex+questions.length-1)%questions.length;renderPractice()};init3D();});
