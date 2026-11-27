import React,{useEffect,useState} from 'react'
import {fetchJson} from './helper.js'
const base=import.meta.env.BASE_URL
const captions=[
  'A shared image history, two saved motion states · PourWaterAmount',
  'The paired example expands into the 32-context atlas subset',
  'Replay every candidate action · compare the complete measured utility rows',
  'Matched prediction errors and decision costs · PassWater'
]
export default function HeroDemoBackground(){
  const [cases,setCases]=useState([]),[scene,setScene]=useState(0)
  const [playing,setPlaying]=useState(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(()=>{fetchJson(`${base}data/context_atlas.json`).then(d=>{const rows=d.cases.filter(c=>c.task==='PourWaterAmount');const example=rows.find(c=>c.origin==='pourwateramount-sealed_test-0057');setCases([example,...rows.filter(c=>c!==example)])}).catch(()=>{})},[])
  useEffect(()=>{if(!playing)return;const timer=setInterval(()=>setScene(i=>(i+1)%4),6500);return()=>clearInterval(timer)},[playing,scene])
  return <><div className={`hero-demo-background scene-${scene}`} aria-hidden="true"><div className="hero-demo-clips">{cases.map((c,i)=>{
    const chosen=scene===0&&i<2?cases[0]:c
    return <div key={c.origin} className={`hero-demo-clip ${scene===0&&i>1?'inactive':''}`} style={{left:`${scene===0?i*50:(i%8)*12.5}%`,top:`${scene===0?0:Math.floor(i/8)*25}%`,width:scene===0?'50%':'12.5%',height:scene===0?'100%':'25%'}}><img src={playing?`${base}assets/hero-motion/${chosen.origin}.webp`:`${base}${chosen.history_paths.reference}/0/000.webp`} alt=""/></div>
  })}</div><div className="hero-demo-outcomes"><div className="hero-demo-outcome-header"><span>Paired context / state</span>{['Delayed tip','Two pulses','Lift and tip','Translate and tip'].map(x=><span key={x}>{x}</span>)}</div>{cases.map(c=><div className="hero-demo-outcome-pair" key={c.origin}>{['reference','paired'].map(arm=><div key={arm}><span>{c.origin.split('-').at(-1)} / {arm==='reference'?'A':'B'}</span>{c[arm+'_utility'].map((v,i)=><span key={i} className={c[arm+'_maximizers'].includes(i)?'best':''} style={{background:`rgba(156,180,198,${.12+(v+1)*.45})`}}>{v.toFixed(3)}</span>)}</div>)}</div>)}</div><img className="hero-demo-error-matrix" src={`${base}assets/paper/action_error_matrix.webp`} alt=""/></div><div className="hero-demo-controls"><span>{captions[scene]}</span><div role="group" aria-label="Background animation scenes">{['Paired observation','Evaluation bank','Candidate outcomes','Prediction and decision'].map((label,i)=><button key={label} aria-label={`Show ${label.toLowerCase()} background`} title={label} aria-pressed={scene===i} onClick={()=>setScene(i)}><i/></button>)}<button className="hero-demo-pause" onClick={()=>setPlaying(!playing)} aria-pressed={!playing}>{playing?'Pause animation':'Play animation'}</button></div></div></>
}
