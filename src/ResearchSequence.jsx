import React,{useEffect,useState} from 'react'
import {fetchJson} from './helper.js'
const base=import.meta.env.BASE_URL
const stages=['Paired observation','Evaluation bank','Action outcomes','Prediction and choice']
const actions=['Delayed tip','Two pulses','Lift and tip','Translate and tip']

export default function ResearchSequence(){
  const [data,setData]=useState(null),[study,setStudy]=useState(null),[stage,setStage]=useState(0)
  const [playing,setPlaying]=useState(()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(()=>{fetchJson(`${base}data/context_atlas.json`).then(setData).catch(()=>{});fetchJson(`${base}data/current_study.json`).then(setStudy).catch(()=>{})},[])
  useEffect(()=>{if(!playing)return;const id=setInterval(()=>setStage(s=>(s+1)%4),6500);return()=>clearInterval(id)},[playing,stage])
  const cases=data?.cases.filter(c=>c.task==='PourWaterAmount')||[]
  const example=cases.find(c=>c.origin==='pourwateramount-sealed_test-0057')
  const motion=c=>`${base}assets/hero-motion/${c.origin}.webp`
  const choose=i=>setStage(i)
  const rows=study?.passwater.results.filter(x=>['frozen_GRU64','action_only'].includes(x.input))||[]
  return <section className={`research-sequence stage-${stage}`} aria-label="Animated overview of the study">
    <div className="sequence-top"><span>Visual physical prediction · study overview</span><button onClick={()=>setPlaying(!playing)} aria-pressed={!playing}>{playing?'Pause sequence':'Play sequence'}</button></div>
    <div className="sequence-stage">
      <div className="sequence-images" aria-hidden={stage>1}>{cases.map((c,i)=>{
        const focus=example&&i<2
        const x=stage===0?(i===0?9:53):(i%8)*12.5
        const y=stage===0?5:Math.floor(i/8)*25
        return <div className={`sequence-tile ${stage===0&&!focus?'sequence-hidden':''}`} key={c.origin} style={{left:`${x}%`,top:`${y}%`,width:stage===0?'38%':'12.5%',height:stage===0?'90%':'25%'}}>
          <img src={playing?motion(stage===0&&focus?example:c):`${base}${(stage===0&&focus?example:c).history_paths.reference}/0/000.webp`} alt={stage===0&&focus?`${example.origin}, ${i===0?'reference':'paired'} shared observation history`:c.origin}/>
          <span>{stage===0?(i===0?'Reference branch':'Hidden-motion branch'):c.origin.replace('pourwateramount-sealed_test-','Context ')}</span>
        </div>
      })}</div>
      {example&&<div className="sequence-outcomes" aria-hidden={stage!==2}><div className="sequence-evidence-head"><img src={`${base}${example.boundary_images.reference[0]}`} alt="Selected pair decision-time RGB"/><div><b>Same observed history. Different consequences.</b><p>Measured held-out utilities from {example.origin.replace('pourwateramount-','pwa-')}. Outlines identify every best action.</p></div></div><div className="sequence-values"><span></span>{actions.map(a=><span key={a}>{a}</span>)}{['reference','paired'].map(arm=><React.Fragment key={arm}><b>{arm==='reference'?'Reference':'Paired'}</b>{example[arm+'_utility'].map((v,i)=><span key={i} className={example[arm+'_maximizers'].includes(i)?'sequence-optimal':''}>{v.toFixed(3)}</span>)}</React.Fragment>)}</div><p className="sequence-result">Translate-and-tip is best in both branches. Outcome differences and the value of identifying a branch measure different properties.</p></div>}
      <div className="sequence-decisions" aria-hidden={stage!==3}><b>Prediction accuracy and decision utility</b><p>Matched PassWater comparison at nine fixed paired configurations and the same held-out actions.</p><table><thead><tr><th>Predictor input</th><th>Outcome RMSE ↓</th><th>Decision utility R ↑</th></tr></thead><tbody>{rows.map(r=><tr key={r.input}><th>{r.input==='frozen_GRU64'?'Frozen GRU history':'Action only'}</th><td>{r.four_action.raw_rmse.toFixed(4)}</td><td>{r.four_action.R.toFixed(4)}</td></tr>)}</tbody></table><p className="sequence-result">The history model predicts absolute outcomes more accurately, while action-only makes more useful choices. The framework measures both against replay truth.</p><a href="#matched-comparison" tabIndex={stage===3?0:-1}>Matched results and action-level explanation →</a></div>
    </div>
    <div className="sequence-explanation" aria-live="polite">{[
      <p key="observation"><b>Observation and physical reference.</b> One paired pouring context has a shared pre-action image history and different hidden velocities. Both branches are replayed under the same candidate actions.</p>,
      <p key="bank"><b>From a paired record to the evaluation bank.</b> The view expands to 32 recorded contexts from the paper’s atlas subset. Population comparisons use the full declared collection and its physical sampling units.</p>,
      <p key="outcome"><b>Complete candidate-action outcomes.</b> Compare every alternative before interpreting the chosen action. This pair changes its outcome values while retaining a shared best action.</p>,
      <p key="decision"><b>Linked prediction and decision measurements.</b> The fitted comparison tests how accurately a model predicts all alternatives and how useful its resulting choice is.</p>
    ][stage]}</div>
    <div className="sequence-controls" role="group" aria-label="Study overview scene">{stages.map((name,i)=><button key={name} className={stage===i?'active':''} aria-pressed={stage===i} onClick={()=>choose(i)}>{name}</button>)}</div>
    <p className="sequence-source">Recorded observations and measured replay outcomes. The example pair is from the S14 atlas; the final scene uses the separately labeled matched PassWater comparison.</p>
  </section>
}
