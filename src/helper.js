export async function fetchJson(path){ const r = await fetch(path); if(!r.ok) throw new Error(path+': '+r.status); return r.json() }
export async function fetchCsv(path){
  const r = await fetch(path); if(!r.ok) throw new Error(path+': '+r.status)
  const text = await r.text()
  const lines = text.trim().split(/\r?\n/)
  const head = lines[0].split(',')
  return lines.slice(1).map(l => { const v = l.split(','); const o={}; head.forEach((h,i)=>o[h]=v[i]); return o })
}
export function fmt(x, d=3){ if(x===undefined||x===''||x===null) return '—'; const n=Number(x); if(Number.isNaN(n)) return x; return n.toFixed(d) }
