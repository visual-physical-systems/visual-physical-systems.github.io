import React,{useEffect,useState} from 'react'
import {fetchJson} from './helper.js'
const base=import.meta.env.BASE_URL
const actions=['Early brake','Late brake','Two pulses','Mid coast']
const subtitles=[
  ['The same images can hide different motion.','We hold the complete observed history fixed, change hidden velocity, and test how the alternatives change.'],
  ['Every starting point. Every candidate action.','Saved-state replay measures the alternatives, including those a model would never choose. These recordings supply a common physical reference.'],
  ['Prediction is a profile. A decision selects one entry.','We compare every predicted action outcome with replay truth, then score the true outcome of the action the model selects.'],
  ['Lower prediction error can still mean worse choices.','Our framework measures state targets, all candidate outcomes and the resulting decision together—showing what each score misses.']
]
function OutcomePlot({truth,prediction,chosen,reveal=false}){
  const low=-.44,high=-.16,W=460,H=235,L=48,R=15,T=18,B=56
  const y=v=>T+(high-v)/(high-low)*(H-T-B),bottom=y(low)
  return <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={prediction?'True and predicted utilities for the same four actions; outline marks the selected action.':'Measured replay utilities for the four held-out actions.'}>
    {[-.4,-.3,-.2].map(v=><g key={v}><line x1={L} x2={W-R} y1={y(v)} y2={y(v)} className="film-grid"/><text x={L-9} y={y(v)+4} textAnchor="end" className="film-axis">{v.toFixed(1)}</text></g>)}
    {truth.map((v,i)=>{const x=L+22+i*96;return <g className={reveal?'film-action-reveal':''} style={{animationDelay:`${i*.65}s`}} key={i}>
      {chosen===i&&<rect className="film-chosen" x={x-9} y={T-7} width={prediction?67:45} height={H-T-18} rx="4"/>}
      <rect x={x} y={y(v)} width="25" height={Math.max(bottom-y(v),1)} className="film-truth"/>
      {prediction&&<rect x={x+28} y={y(prediction[i])} width="19" height={Math.max(bottom-y(prediction[i]),1)} className="film-prediction"/>}
      {!prediction&&<text x={x+12} y={y(v)-8} textAnchor="middle" className="film-value">{v.toFixed(3)}</text>}
      <text x={x+20} y={H-31} textAnchor="middle" className="film-action-name">{actions[i].split(' ').map((word,j)=><tspan x={x+20} dy={j?14:0} key={word}>{word}</tspan>)}</text>
      {chosen===i&&<text x={x+20} y={H-2} textAnchor="middle" className="film-picked-label">selected</text>}
    </g>})}
  </svg>
}
export default function HeroResearchFilm(){
  const [cases,setCases]=useState([]),[example,setExample]=useState(null),[study,setStudy]=useState(null),[scene,setScene]=useState(0)
  const [playing,setPlaying]=useState(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(()=>{fetchJson(`${base}data/context_atlas.json`).then(x=>{const rows=x.cases.filter(c=>c.task==='PourWaterAmount');const first=rows.find(c=>c.origin==='pourwateramount-sealed_test-0057');setCases([first,...rows.filter(c=>c!==first)])});fetchJson(`${base}data/hero_prediction_case.json`).then(setExample);fetchJson(`${base}data/current_study.json`).then(setStudy)},[])
  useEffect(()=>{if(!playing)return;const id=setInterval(()=>setScene(s=>(s+1)%4),8000);return()=>clearInterval(id)},[playing,scene])
  const picked=key=>example?.[key].reduce((best,v,i,a)=>v>a[best]?i:best,0)
  return <><div className={`hero-research-film scene-${scene}`}>
    <div className="film-history-bank" aria-hidden={scene>1}>{cases.map((c,i)=>{const focus=scene===0&&i<2,active=scene!==0||i<2,item=focus?cases[0]:c;return <figure key={c.origin} className={active?'':'film-inactive'} style={{left:`${scene===0?(i===0?15:57):(i%8)*12.5}%`,top:`${scene===0?44:Math.floor(i/8)*25}%`,width:scene===0?'28%':'12.5%',height:scene===0?'38%':'25%'}}><img src={playing?`${base}assets/hero-motion/${item.origin}.webp`:`${base}${item.history_paths.reference}/0/000.webp`} alt={focus?`Shared image history, state ${i===0?'A':'B'}`:`Observed history ${c.origin}`}/>{scene===0&&active&&<figcaption><b>State {i===0?'A · saved motion':'B · changed hidden motion'}</b><span>Identical observed history</span></figcaption>}</figure>})}</div>
    {example&&<div className="film-replay" aria-hidden={scene!==2}><div className="film-start"><img src={`${base}${example.image}`} alt="Actual saved observation of the matched PassWater state"/><b>One saved physical state</b><span>Restore before each action</span></div><span className="film-replay-arrow" aria-hidden="true">→</span><div className="film-measured"><div className="film-plot-label">Four candidate actions → measured terminal utility</div><OutcomePlot truth={example.truth} reveal={scene===2&&playing}/></div></div>}
    {study&&<div className="film-model-comparison film-population" aria-hidden={scene!==3}><div className="film-common-case">PassWater · same evaluation cases and actions · matched RBF predictors</div><div className="film-ranking-pair">{[['Outcome prediction','RMSE · lower is better','raw_rmse',.24,'Better prediction'],['Resulting decision','Normalized utility R · higher is better','R',1,'Better choice']].map(([title,axis,metric,max,verdict])=>{const rows=['frozen_GRU64','action_only'].map(input=>study.passwater.results.find(r=>r.input===input));return <article key={metric}><h3>{title}</h3><p>{axis}</p><div className="film-score-bars">{rows.map((row,i)=><div className={`film-score-row ${i===0?'history-score':'action-score'} ${metric==='raw_rmse'?i===0?'score-winner':'':i===1?'score-winner':''}`} key={row.input}><span>{i===0?'RGB history':'Action only'}</span><div><i style={{width:`${row.four_action[metric]/max*100}%`}}/><b>{row.four_action[metric].toFixed(4)}</b></div></div>)}</div><strong className="film-verdict">{verdict}: {metric==='raw_rmse'?'RGB history':'action only'}</strong></article>})}</div><div className="film-rank-conclusion"><span>Predict every alternative</span><b>≠</b><span>Choose the best alternative</span></div><p className="film-example-identity">Equal configuration weight · 9 paired configurations · 2 states × 2 cameras · 4 held-out actions · 3 encoder seeds.<br/>Population comparison; the preceding replay illustrates the measurement procedure.</p><a className="film-results-link" href="#matched-comparison">Inspect the matched comparison →</a></div>}
  </div><div className="film-subtitles" aria-live="polite"><b>{subtitles[scene][0]}</b><span>{subtitles[scene][1]}</span></div><div className="hero-demo-controls"><div role="group" aria-label="Background animation scenes">{['Observation intervention','Many physical contexts','Restored action outcomes','Prediction versus choice'].map((label,i)=><button key={label} title={label} aria-label={`Show ${label.toLowerCase()} background`} aria-pressed={scene===i} onClick={()=>setScene(i)}><i/></button>)}<button className="hero-demo-pause" aria-pressed={!playing} onClick={()=>setPlaying(!playing)}>{playing?'Pause animation':'Play animation'}</button></div></div></>
}
