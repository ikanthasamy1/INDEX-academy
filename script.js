const tbody = document.querySelector('#calcTable tbody');
const summary = document.querySelector('#calcSummary');

function addRow(name='', cap='', ff=''){
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input class="name" placeholder="e.g. Company A" value="${name}"></td>
    <td><input class="cap" type="number" min="0" step="any" placeholder="1000" value="${cap}"></td>
    <td><input class="ff" type="number" min="0" max="100" step="any" placeholder="75" value="${ff}"></td>
    <td class="adj">—</td>
    <td class="weight">—</td>
    <td><button class="remove-btn" title="Remove row">×</button></td>`;
  tr.querySelector('.remove-btn').addEventListener('click',()=>tr.remove());
  tbody.appendChild(tr);
}

function calculate(){
  const rows = [...tbody.querySelectorAll('tr')];
  const data = rows.map(row=>{
    const cap = parseFloat(row.querySelector('.cap').value);
    const ff = parseFloat(row.querySelector('.ff').value);
    const adjusted = (isFinite(cap) && isFinite(ff)) ? cap * ff/100 : NaN;
    return {row, cap, ff, adjusted};
  });
  const valid = data.filter(x=>isFinite(x.adjusted) && x.adjusted >= 0);
  const total = valid.reduce((s,x)=>s+x.adjusted,0);

  data.forEach(x=>{
    if(!isFinite(x.adjusted)){
      x.row.querySelector('.adj').textContent='—';
      x.row.querySelector('.weight').textContent='—';
      return;
    }
    x.row.querySelector('.adj').textContent=x.adjusted.toLocaleString(undefined,{maximumFractionDigits:2});
    const w = total > 0 ? x.adjusted/total*100 : 0;
    x.row.querySelector('.weight').textContent=w.toFixed(2)+'%';
  });

  summary.innerHTML = total>0
    ? `<b>Total free-float adjusted market cap:</b> ${total.toLocaleString(undefined,{maximumFractionDigits:2})}<br><span>Weights sum to 100% across valid rows.</span>`
    : 'Enter valid market caps and free-float percentages, then calculate again.';
}

document.querySelector('#addRow').addEventListener('click',()=>addRow());
document.querySelector('#calculate').addEventListener('click',calculate);
document.querySelector('#reset').addEventListener('click',()=>{
  tbody.innerHTML='';
  seed();
  summary.innerHTML='Add companies and press <b>Calculate weights</b>.';
});

function seed(){
  addRow('Company A','1000','80');
  addRow('Company B','750','60');
  addRow('Company C','500','90');
}
seed();
document.querySelector('#year').textContent=new Date().getFullYear();
