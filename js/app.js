const root = document.documentElement;

const moonSVG = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>';
const sunSVG  = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';

function setTheme(t) {
  try {
    root.setAttribute('data-theme', t);
    const ico = document.getElementById('themeIco');
    if (ico) ico.innerHTML = t === 'dark' ? moonSVG : sunSVG;
    const mc = document.getElementById('metaThemeColor');
    if (mc) mc.content = t === 'dark' ? '#080B0F' : '#F7F8FA';
    try { localStorage.setItem('vt', t); } catch(e) {}
  } catch(e) {}
}

function toggleTheme() { setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); }

const themeBtn = document.getElementById('themeBtn');
if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

(function() {
  try {
    const s = localStorage.getItem('vt');
    if (s) { setTheme(s); return; }
    setTheme(window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  } catch(e) { setTheme('dark'); }
})();

function show(id) {
  try {
    document.querySelectorAll('.scr').forEach(s => s.classList.remove('on'));
    const el = document.getElementById(id);
    if (el) { el.classList.add('on'); window.scrollTo(0, 0); }
  } catch(e) {}
}

try {
  document.querySelectorAll('.og, .oi-wrap').forEach(g => {
    g.querySelectorAll('.ob').forEach(b => {
      b.addEventListener('click', function() {
        g.querySelectorAll('.ob').forEach(x => x.classList.remove('sel'));
        this.classList.add('sel');
      });
      b.addEventListener('touchend', function(e) { e.preventDefault(); this.click(); }, { passive: false });
    });
  });
} catch(e) {}

try {
  document.querySelectorAll('.day-btn').forEach(b => {
    b.addEventListener('click', function() { this.classList.toggle('sel'); });
    b.addEventListener('touchend', function(e) { e.preventDefault(); this.click(); }, { passive: false });
  });
} catch(e) {}

function tgl(id) { const el = document.getElementById(id); if (el) el.classList.toggle('on'); }
try {
  document.querySelectorAll('.tgl-row').forEach(r => {
    r.addEventListener('touchend', function(e) { e.preventDefault(); this.click(); }, { passive: false });
  });
} catch(e) {}

function addTag(e, cid) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const inp = e.target;
    const val = inp.value.trim().replace(/,/g, '');
    if (!val) return;
    const box = document.getElementById(cid);
    const t = document.createElement('div');
    t.className = 'tag-item';
    t.innerHTML = `<span>${escHtml(val)}</span><button class="tag-rm" onclick="this.parentElement.remove()" aria-label="Remover">×</button>`;
    box.insertBefore(t, inp);
    inp.value = '';
  }
}

function escHtml(s) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(s));
  return d.innerHTML;
}

try {
  document.querySelectorAll('.tag-box').forEach(b => {
    b.addEventListener('click', function(e) { if (e.target === this) this.querySelector('.tag-in').focus(); });
  });
} catch(e) {}

let step = 1;
const TOTAL = 8;
let fd = {};

function startForm() { step = 1; show('s-form'); updatePrg(); }

function updatePrg() {
  try {
    const pct = Math.round((step / TOTAL) * 100);
    const prgFill = document.getElementById('prgFill');
    if (prgFill) prgFill.style.width = pct + '%';
    const prgLbl = document.getElementById('prgLbl');
    if (prgLbl) prgLbl.textContent = `Etapa ${step} de ${TOTAL}`;
    const prgPct = document.getElementById('prgPct');
    if (prgPct) prgPct.textContent = pct + '%';
    for (let i = 1; i <= TOTAL; i++) {
      const el = document.getElementById(`st${i}`);
      if (el) el.classList.toggle('hide', i !== step);
    }
    const btnVoltar = document.getElementById('btnVoltar');
    if (btnVoltar) btnVoltar.style.display = step === 1 ? 'none' : '';
    const pBtn = document.getElementById('btnProx');
    if (pBtn) {
      if (step === TOTAL) {
        pBtn.innerHTML = 'Processar Avaliação <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>';
      } else {
        pBtn.innerHTML = 'Próximo <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      }
    }
    if (step === TOTAL) buildSummary();
  } catch(e) {}
}

function validate(s) {
  if (s === 1) {
    if (!document.getElementById('f-nome').value.trim()) { toast('Informe seu nome'); return false; }
    const idade = +document.getElementById('f-idade').value;
    if (!idade || idade < 10 || idade > 99) { toast('Informe uma idade válida (10–99)'); return false; }
    const alt = +document.getElementById('f-altura').value;
    if (!alt || alt < 100 || alt > 250) { toast('Informe altura em cm'); return false; }
    const peso = +document.getElementById('f-peso').value;
    if (!peso || peso < 30 || peso > 300) { toast('Informe peso em kg'); return false; }
    if (!document.getElementById('f-genero').value) { toast('Selecione seu gênero'); return false; }
  }
  return true;
}

function nextStp() {
  try {
    if (!validate(step)) return;
    if (step < TOTAL) { step++; updatePrg(); window.scrollTo(0, 0); }
    else { collectData(); process(); }
  } catch(e) {}
}

function prevStp() {
  try {
    if (step > 1) { step--; updatePrg(); window.scrollTo(0, 0); }
    else show('s-hero');
  } catch(e) {}
}

function selVal(gid) { const s = document.querySelector(`#${gid} .ob.sel`); return s ? s.dataset.v : null; }
function selDays() { const ds = []; document.querySelectorAll('.day-btn.sel').forEach(d => ds.push(d.dataset.d)); return ds; }

function getTags(boxId) {
  const items = [];
  document.querySelectorAll(`#${boxId} .tag-item span`).forEach(s => items.push(s.textContent));
  return items;
}

function collectData() {
  try {
    const tPers  = document.getElementById('t-pers');
    const tNutri = document.getElementById('t-nutri');
    fd = {
      nome:     (document.getElementById('f-nome')  || {}).value?.trim() || '',
      idade:    +(document.getElementById('f-idade') || {}).value || 0,
      altura:   +(document.getElementById('f-altura')|| {}).value || 0,
      peso:     +(document.getElementById('f-peso')  || {}).value || 0,
      genero:   (document.getElementById('f-genero') || {}).value || '',
      obj:      selVal('og-obj')  || 'fitness-geral',
      pesoDej:  +(document.getElementById('f-pdej')  || {}).value || 0,
      prazo:    (document.getElementById('f-prazo')  || {}).value || '',
      motiv:    (document.getElementById('f-mot')    || {}).value?.trim() || '',
      nivel:    selVal('og-niv')  || 'intermediario',
      dias:     +(document.getElementById('f-dias')  || {}).value || 3,
      pers:     tPers  ? tPers.classList.contains('on')  : false,
      nutri:    tNutri ? tNutri.classList.contains('on') : false,
      doencas:  getTags('tb-doencas'),
      lesoes:   getTags('tb-lesoes'),
      meds:     getTags('tb-meds'),
      sono:     selVal('ow-sono') || 'boa',
      sonoH:    +(document.getElementById('f-sono')  || {}).value || 7,
      stress:   selVal('ow-str')  || 'moderado',
      agua:     +(document.getElementById('f-agua')  || {}).value || 2,
      frutas:   selVal('ow-frut') || 'diario',
      indust:   selVal('ow-ind')  || 'raramente',
      aler:     getTags('tb-aler'),
      daysSel:  selDays(),
      tempo:    +(selVal('ow-tmp') || 60),
      local:    selVal('og-loc')  || 'academia',
    };
  } catch(e) {}
}

function calcIMC(p, h)      { return p / ((h/100) * (h/100)) }
function calcTMB(p, h, i, g){ return g === 'feminino' ? 447.593+9.247*p+3.098*h-4.330*i : 88.362+13.397*p+4.799*h-5.677*i }

const actFactor = { iniciante:1.2, intermediario:1.55, avancado:1.725 };

function imcStatus(v) {
  if (v < 18.5) return { lbl:'Abaixo do Peso', cls:'w', cat:'< 18.5' };
  if (v < 25)   return { lbl:'Peso Saudável',  cls:'g', cat:'18.5–24.9' };
  if (v < 30)   return { lbl:'Sobrepeso',      cls:'w', cat:'25–29.9' };
  return              { lbl:'Obesidade',        cls:'b', cat:'≥ 30' };
}

const genLabel  = { masculino:'Masculino', feminino:'Feminino', outro:'Outro' };
const objLabel  = { 'perder-peso':'Perder Peso', 'ganhar-massa':'Ganhar Massa', 'resistencia':'Resistência', 'fitness-geral':'Fitness Geral' };
const nivLabel  = { iniciante:'Iniciante', intermediario:'Intermediário', avancado:'Avançado' };
const locLabel  = { casa:'Casa', academia:'Academia', 'ar-livre':'Ar Livre', misto:'Misto' };

function process() {
  show('s-load');
  const steps = ['ls1','ls2','ls3','ls4'];
  let idx = 0;

  function advance() {
    if (idx < steps.length) {
      const prev = steps[idx - 1];
      if (prev) {
        const el = document.getElementById(prev);
        if (el) { el.classList.remove('act'); el.classList.add('done'); }
      }
      const curr = document.getElementById(steps[idx]);
      if (curr) curr.classList.add('act');
      idx++;
      if (idx < steps.length) {
        setTimeout(advance, 600 + Math.random() * 300);
      } else {
        setTimeout(function() {
          const last = document.getElementById(steps[steps.length - 1]);
          if (last) { last.classList.remove('act'); last.classList.add('done'); }
          setTimeout(function() { processResults(); show('s-res'); }, 300);
        }, 600);
      }
    }
  }

  advance();
}

function processResults() {
  const d = fd;
  const imc   = calcIMC(d.peso, d.altura);
  const imcS  = imcStatus(imc);
  const tmb   = calcTMB(d.peso, d.altura, d.idade, d.genero);
  const tdee  = Math.round(tmb * (actFactor[d.nivel] || 1.55));
  const aguaML= Math.round(d.peso * 35);

  document.getElementById('r-nm').textContent    = d.nome || 'Usuário';
  document.getElementById('r-imc').textContent   = imc.toFixed(1);
  document.getElementById('r-imc-cat').textContent = imcS.cat;
  document.getElementById('r-tmb').textContent   = Math.round(tmb).toLocaleString('pt-BR');
  document.getElementById('r-tdee').textContent  = tdee.toLocaleString('pt-BR');
  document.getElementById('r-agua').textContent  = aguaML.toLocaleString('pt-BR');

  const imcBg = document.getElementById('r-imc-bg');
  if (imcBg) {
    imcBg.textContent = imcS.lbl;
    imcBg.className = `met-tag ${imcS.cls}`;
  }

  const badge = document.getElementById('r-badge');
  if (badge) {
    badge.textContent = imcS.lbl;
    badge.className   = `score-pill ${imcS.cls === 'g' ? 'good' : imcS.cls === 'w' ? 'ok' : 'bad'}`;
  }

  const fortes = [];
  const atenc  = [];
  const rec    = [];

  if (d.sonoH >= 7) fortes.push({ ic:'g', sy:'◎', tx:'Sono adequado — ' + d.sonoH + 'h por noite favorece a recuperação muscular.' });
  if (d.agua >= 2)  fortes.push({ ic:'g', sy:'◎', tx:'Hidratação regular — ' + d.agua + 'L/dia suporta desempenho e metabolismo.' });
  if (d.frutas === 'diario') fortes.push({ ic:'g', sy:'◎', tx:'Consumo diário de frutas e verduras é excelente para micronutrientes.' });
  if (d.nivel === 'avancado') fortes.push({ ic:'g', sy:'◎', tx:'Nível avançado de treino indica disciplina e base sólida.' });
  if (d.pers) fortes.push({ ic:'g', sy:'◎', tx:'Acompanhamento profissional maximiza resultados e segurança.' });
  if (fortes.length === 0) fortes.push({ ic:'g', sy:'◎', tx:'Comprometimento com a avaliação é o primeiro passo para resultados.' });

  if (d.sonoH < 6) atenc.push({ ic:'w', sy:'△', tx:'Sono insuficiente (' + d.sonoH + 'h) compromete hormônios anabólicos e recuperação.' });
  if (d.stress === 'alto' || d.stress === 'muito-alto') atenc.push({ ic:'w', sy:'△', tx:'Estresse elevado eleva cortisol — priorize técnicas de recuperação ativa.' });
  if (d.agua < 1.5) atenc.push({ ic:'w', sy:'△', tx:'Hidratação abaixo do ideal. Meta recomendada: ' + aguaML + 'ml/dia.' });
  if (d.indust === 'diario') atenc.push({ ic:'w', sy:'△', tx:'Consumo diário de industrializados dificulta controle calórico e inflamação.' });
  if (d.doencas.length > 0) atenc.push({ ic:'w', sy:'△', tx:'Condições de saúde registradas — consulte seu médico antes de iniciar.' });
  if (d.lesoes.length > 0) atenc.push({ ic:'w', sy:'△', tx:'Lesões registradas (' + d.lesoes.join(', ') + '): adapte os exercícios com um profissional.' });
  if (atenc.length === 0) atenc.push({ ic:'w', sy:'△', tx:'Nenhum ponto crítico identificado. Mantenha consistência.' });

  const cals = d.obj === 'perder-peso' ? Math.round(tdee * 0.85) : d.obj === 'ganhar-massa' ? Math.round(tdee * 1.12) : tdee;
  rec.push({ ic:'i', sy:'→', tx:`Meta calórica: ${cals.toLocaleString('pt-BR')} kcal/dia para ${objLabel[d.obj] || d.obj}.` });
  rec.push({ ic:'i', sy:'→', tx:`Proteína diária: ${Math.round(d.peso * 1.8)}–${Math.round(d.peso * 2.2)}g para suportar ${nivLabel[d.nivel]} de treino.` });
  if (d.daysSel.length > 0) rec.push({ ic:'i', sy:'→', tx:`Plano de ${d.daysSel.length} dias semanais gerado: ${d.daysSel.join(', ')}.` });
  rec.push({ ic:'i', sy:'→', tx:`Reavalie suas métricas em ${d.prazo === '1mes' ? '4' : '8'} semanas para ajustar a progressão.` });

  renderList('r-fortes', fortes);
  renderList('r-atenc',  atenc);
  renderList('r-rec',    rec);
  buildWorkout();
}

function renderList(id, items) {
  document.getElementById(id).innerHTML = items.map(i =>
    `<div class="a-item"><div class="a-ic ${i.ic}">${i.sy}</div><div>${i.tx}</div></div>`
  ).join('');
}

function buildWorkout() {
  const d = fd;
  const dias = d.daysSel.length > 0 ? d.daysSel : ['Seg','Qua','Sex'];
  const plans = {
    'ganhar-massa': [
      { n:'Peito + Tríceps',  ex:[{n:'Supino Reto',s:'4×10-12',t:'PEITO'},{n:'Supino Inclinado',s:'3×10',t:'PEITO'},{n:'Crucifixo',s:'3×12-15',t:'PEITO'},{n:'Tríceps Corda',s:'3×12',t:'TRÍCEPS'},{n:'Tríceps Francês',s:'3×10',t:'TRÍCEPS'}] },
      { n:'Costas + Bíceps',  ex:[{n:'Puxada Aberta',s:'4×10-12',t:'COSTAS'},{n:'Remada Curvada',s:'4×10',t:'COSTAS'},{n:'Remada Unilateral',s:'3×12',t:'COSTAS'},{n:'Rosca Direta',s:'3×12',t:'BÍCEPS'},{n:'Rosca Martelo',s:'3×10',t:'BÍCEPS'}] },
      { n:'Pernas + Glúteos', ex:[{n:'Agachamento Livre',s:'4×10-12',t:'QUAD'},{n:'Leg Press',s:'4×12',t:'QUAD'},{n:'Cadeira Extensora',s:'3×15',t:'QUAD'},{n:'Mesa Flexora',s:'3×12',t:'POSTERIOR'},{n:'Panturrilha Em Pé',s:'4×15',t:'PANTUR'}] },
      { n:'Ombros + Core',    ex:[{n:'Desenvolvimento Livre',s:'4×10',t:'OMBROS'},{n:'Elevação Lateral',s:'3×15',t:'OMBROS'},{n:'Elevação Frontal',s:'3×12',t:'OMBROS'},{n:'Prancha',s:'3×60s',t:'CORE'},{n:'Abdominal Infra',s:'3×15',t:'CORE'}] },
    ],
    'perder-peso': [
      { n:'Full Body A',       ex:[{n:'Agachamento Livre',s:'3×15',t:'LEGS'},{n:'Supino Inclinado',s:'3×12',t:'PEITO'},{n:'Remada Cabos',s:'3×12',t:'COSTAS'},{n:'Stiff',s:'3×15',t:'POSTERIOR'},{n:'Trote 20min',s:'1×20min',t:'CARDIO'}] },
      { n:'Full Body B',       ex:[{n:'Leg Press',s:'3×15',t:'QUAD'},{n:'Puxada Frente',s:'3×12',t:'COSTAS'},{n:'Desenvolvimento',s:'3×12',t:'OMBROS'},{n:'Panturrilha',s:'3×20',t:'PANTUR'},{n:'Bike 20min',s:'1×20min',t:'CARDIO'}] },
      { n:'Full Body C + HIIT',ex:[{n:'Agachamento Sumô',s:'3×15',t:'GLÚTEO'},{n:'Crucifixo',s:'3×15',t:'PEITO'},{n:'Prancha',s:'3×45s',t:'CORE'},{n:'Abdominal Reto',s:'3×20',t:'CORE'},{n:'HIIT 15min',s:'1×15min',t:'CARDIO'}] },
    ],
    'fitness-geral': [
      { n:'Superior A',        ex:[{n:'Supino Reto',s:'3×12',t:'PEITO'},{n:'Puxada Frente',s:'3×12',t:'COSTAS'},{n:'Desenvolvimento',s:'3×12',t:'OMBROS'},{n:'Rosca Direta',s:'3×12',t:'BÍCEPS'},{n:'Tríceps Corda',s:'3×12',t:'TRÍCEPS'}] },
      { n:'Inferior',          ex:[{n:'Agachamento',s:'3×12',t:'QUAD'},{n:'Leg Press',s:'3×15',t:'QUAD'},{n:'Mesa Flexora',s:'3×12',t:'POSTERIOR'},{n:'Abdutor',s:'3×15',t:'GLÚTEO'},{n:'Panturrilha',s:'4×15',t:'PANTUR'}] },
      { n:'Superior B + Core', ex:[{n:'Remada Curvada',s:'3×12',t:'COSTAS'},{n:'Crucifixo',s:'3×12',t:'PEITO'},{n:'Elevação Lateral',s:'3×15',t:'OMBROS'},{n:'Prancha',s:'3×45s',t:'CORE'},{n:'Oblíquo',s:'3×15',t:'CORE'}] },
    ],
    'resistencia': [
      { n:'Resistência A',     ex:[{n:'Corrida Contínua',s:'1×30min',t:'CARDIO'},{n:'Agachamento',s:'4×20',t:'FORÇA'},{n:'Supino Leve',s:'4×20',t:'FORÇA'},{n:'Prancha',s:'3×60s',t:'CORE'}] },
      { n:'HIIT + Força',      ex:[{n:'HIIT Tiro Curto',s:'8×30s',t:'CARDIO'},{n:'Remada Cabos',s:'4×20',t:'COSTAS'},{n:'Desenvolvimento',s:'4×15',t:'OMBROS'},{n:'Abdominal',s:'3×20',t:'CORE'}] },
      { n:'Endurance',         ex:[{n:'Bike ou Elíptico',s:'1×45min',t:'CARDIO'},{n:'Leg Press Leve',s:'4×20',t:'PERNAS'},{n:'Flexão de Braço',s:'3×máx',t:'PEITO'},{n:'Abdominal Reto',s:'4×20',t:'CORE'}] },
    ],
  };

  const plan = plans[d.obj] || plans['fitness-geral'];
  const c = document.getElementById('wk-container');

  c.innerHTML = dias.map((dia, i) => {
    const t = plan[i % plan.length];
    return `<div class="wd" id="wd${i}">
      <div class="wd-hdr" onclick="toggleWD('wd${i}')">
        <div class="wd-left">
          <div class="wd-day">${dia}</div>
          <div class="wd-name">${t.n}</div>
          <div class="wd-meta">${t.ex.length} exercícios · ${d.tempo}min</div>
        </div>
        <div class="wd-chev">
          <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
      <div class="wd-exs">
        ${t.ex.map((ex, j) =>
          `<div class="ex-row">
            <div class="ex-num">${String(j+1).padStart(2,'0')}</div>
            <div class="ex-inf">
              <div class="ex-n">${ex.n}</div>
              <div class="ex-d">${ex.s}</div>
            </div>
            <div class="ex-tg">${ex.t}</div>
          </div>`
        ).join('')}
      </div>
    </div>`;
  }).join('');

  const first = document.getElementById('wd0');
  if (first) first.classList.add('open');
}

function toggleWD(id) {
  try {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('open');
  } catch(e) {}
}

function buildSummary() {
  const nome  = document.getElementById('f-nome').value.trim() || '—';
  const idade = document.getElementById('f-idade').value || '—';
  const alt   = document.getElementById('f-altura').value || '—';
  const peso  = document.getElementById('f-peso').value || '—';
  const gen   = document.getElementById('f-genero').value || '—';
  const obj   = selVal('og-obj') || '—';
  const niv   = selVal('og-niv') || '—';
  const dias  = document.getElementById('f-dias').value;
  const loc   = selVal('og-loc') || '—';

  document.getElementById('st8').innerHTML = `
    <div class="stp-eyebrow">Etapa 8</div>
    <div class="stp-t">Confirmar Dados</div>
    <div class="stp-s">Revise antes de processar sua avaliação.</div>
    <div class="sum-block">
      <div class="sum-head">Dados Pessoais</div>
      <div class="sum-row"><span class="s-lbl">Nome</span><span class="s-val">${escHtml(nome)}</span></div>
      <div class="sum-row"><span class="s-lbl">Idade</span><span class="s-val">${idade} anos</span></div>
      <div class="sum-row"><span class="s-lbl">Altura</span><span class="s-val">${alt} cm</span></div>
      <div class="sum-row"><span class="s-lbl">Peso</span><span class="s-val">${peso} kg</span></div>
      <div class="sum-row"><span class="s-lbl">Gênero</span><span class="s-val">${genLabel[gen]||gen}</span></div>
    </div>
    <div class="sum-block" style="margin-top:8px">
      <div class="sum-head">Treino & Objetivos</div>
      <div class="sum-row"><span class="s-lbl">Objetivo</span><span class="s-val">${objLabel[obj]||obj}</span></div>
      <div class="sum-row"><span class="s-lbl">Nível</span><span class="s-val">${nivLabel[niv]||niv}</span></div>
      <div class="sum-row"><span class="s-lbl">Dias / semana</span><span class="s-val">${dias}</span></div>
      <div class="sum-row"><span class="s-lbl">Local</span><span class="s-val">${locLabel[loc]||loc}</span></div>
    </div>
    <div class="notice-local" style="margin-top:12px">
      <span style="font-size:13px">⚿</span>
      <span>Dados processados <strong>100% localmente</strong>. Nenhuma informação é enviada.</span>
    </div>`;
}

function exportPDF() {
  if (!fd || !fd.nome) { toast('Complete a avaliação primeiro'); return; }
  try {
    const jspdf = window.jspdf;
    const jsPDF = jspdf && jspdf.jsPDF ? jspdf.jsPDF : window.jsPDF || null;
    if (!jsPDF) { toast('Erro: jsPDF não disponível'); return; }

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 40;
    const maxW = pageW - margin * 2;
    let y = 48;

    function nextLine(h) { y += h || 16; if (y > pageH - 60) { doc.addPage(); y = 48; } }

    doc.setFontSize(18);
    doc.text('Vitalis — Avaliação Fitness', margin, y);
    nextLine(22);

    doc.setFontSize(12);
    const name = (document.getElementById('r-nm')?.textContent) || fd.nome || 'Usuário';
    const imc  = document.getElementById('r-imc')?.textContent || '';
    const tmb  = document.getElementById('r-tmb')?.textContent || '';
    const tdee = document.getElementById('r-tdee')?.textContent || '';
    const agua = document.getElementById('r-agua')?.textContent || '';

    doc.text(`Nome: ${name}`, margin, y); nextLine();
    doc.text(`IMC: ${imc}`, margin, y); nextLine();
    doc.text(`TMB: ${tmb} kcal / dia`, margin, y); nextLine();
    doc.text(`TDEE: ${tdee} kcal / dia`, margin, y); nextLine();
    doc.text(`Hidratação: ${agua} ml / dia`, margin, y); nextLine(12);

    function writeSection(title, items) {
      doc.setFontSize(13);
      doc.text(title, margin, y);
      nextLine(16);
      doc.setFontSize(11);
      items.forEach(it => {
        const lines = doc.splitTextToSize('- ' + it, maxW);
        doc.text(lines, margin + 8, y);
        nextLine(14 * lines.length);
      });
      nextLine(6);
    }

    // Collect lists from DOM (they were rendered earlier)
    const fortes = Array.from(document.querySelectorAll('#r-fortes .a-item div:nth-child(2)')).map(n => n.textContent.trim());
    const atenc  = Array.from(document.querySelectorAll('#r-atenc .a-item div:nth-child(2)')).map(n => n.textContent.trim());
    const recs   = Array.from(document.querySelectorAll('#r-rec .a-item div:nth-child(2)')).map(n => n.textContent.trim());

    if (fortes.length > 0) writeSection('Pontos Fortes', fortes);
    if (atenc.length > 0)  writeSection('Pontos de Atenção', atenc);
    if (recs.length > 0)    writeSection('Recomendações', recs);

    // Full workout plan
    doc.setFontSize(13);
    doc.text('Plano de Treino', margin, y); nextLine(18);
    doc.setFontSize(11);

    const weeks = document.querySelectorAll('#wk-container .wd');
    weeks.forEach(wd => {
      const day = (wd.querySelector('.wd-day')?.textContent || '').trim();
      const name = (wd.querySelector('.wd-name')?.textContent || '').trim();
      const meta = (wd.querySelector('.wd-meta')?.textContent || '').trim();
      if (day) {
        const header = `${day} — ${name} (${meta})`;
        const hlines = doc.splitTextToSize(header, maxW);
        doc.text(hlines, margin, y);
        nextLine(14 * hlines.length);
      }
      const exs = wd.querySelectorAll('.ex-row');
      exs.forEach(ex => {
        const exName = (ex.querySelector('.ex-n')?.textContent || '').trim();
        const exSets = (ex.querySelector('.ex-d')?.textContent || '').trim();
        const exTag  = (ex.querySelector('.ex-tg')?.textContent || '').trim();
        const line = `• ${exName} — ${exSets} ${exTag ? '· ' + exTag : ''}`.trim();
        const lns = doc.splitTextToSize(line, maxW - 12);
        doc.text(lns, margin + 8, y);
        nextLine(12 * lns.length);
      });
      nextLine(8);
    });

    // Save file
    const safe = name.replace(/[^a-zA-Z0-9 _-]/g, '') || 'vitalis';
    doc.save(`${safe}_vitalis.pdf`);
    toast('Download iniciado');
  } catch (e) {
    console.error(e);
    toast('Erro ao gerar PDF');
  }
}

function shareWA() {
  if (!fd.nome) { toast('Complete a avaliação primeiro'); return; }
  const iv  = calcIMC(fd.peso, fd.altura).toFixed(1);
  const tb  = Math.round(calcTMB(fd.peso, fd.altura, fd.idade, fd.genero));
  const msg = `*Vitalis — Avaliação Fitness*\n\n👤 ${fd.nome}\nIMC: ${iv} (${imcStatus(+iv).lbl})\nTMB: ${tb} kcal/dia\nObjetivo: ${objLabel[fd.obj]||fd.obj}\nNível: ${nivLabel[fd.nivel]||fd.nivel}\n\n_Gerado pelo Vitalis_`;
  window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
}

function reset() {
  fd = {}; step = 1;
  ['f-nome','f-idade','f-altura','f-peso','f-pdej','f-mot'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['f-genero','f-prazo'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.querySelectorAll('.ob.sel').forEach(b => b.classList.remove('sel'));
  document.querySelectorAll('.day-btn.sel').forEach(b => b.classList.remove('sel'));
  document.querySelectorAll('.tgl.on').forEach(t => t.classList.remove('on'));
  document.querySelectorAll('.tag-item').forEach(t => t.remove());
  ['ow-frut','ow-ind','ow-tmp','og-loc'].forEach(gid => {
    const defaults = { 'ow-frut':'diario','ow-ind':'nunca','ow-tmp':'60','og-loc':'academia' };
    const btn = document.querySelector(`#${gid} [data-v="${defaults[gid]}"]`);
    if (btn) btn.classList.add('sel');
  });
  
  ['ls1','ls2','ls3','ls4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('act','done'); }
  });
  show('s-hero');
}

function toast(msg) {
  try {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(t._tid);
    t._tid = setTimeout(() => t.classList.remove('on'), 2600);
  } catch(e) {}
}

try {
  const btnVoltar = document.getElementById('btnVoltar');
  if (btnVoltar) btnVoltar.style.display = 'none';
} catch(e) {}


let _lt = 0;
document.addEventListener('touchend', function(e) {
  const now = Date.now();
  const tag = e.target.tagName;
  if (now - _lt < 350 && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
    e.preventDefault();
  }
  _lt = now;
}, { passive: false });

window.startForm  = startForm;
window.nextStp    = nextStp;
window.prevStp    = prevStp;
window.show       = show;
window.tgl        = tgl;
window.addTag     = addTag;
window.exportPDF  = exportPDF;
window.shareWA    = shareWA;
window.reset      = reset;
window.toggleTheme = toggleTheme;
window.toggleWD   = toggleWD;
