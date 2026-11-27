import React, {useEffect, useState, useRef} from 'react'
import {fetchJson, fetchCsv, fmt} from './helper.js'
import ProtocolFigure from './ProtocolFigure.jsx'
import Conclusion from './Conclusion.jsx'
import RawExplorer,{TaskVisuals} from './RawExplorer.jsx'
import ModelArchitecture from './ModelArchitecture.jsx'
import ModelSection from './ModelSection.jsx'
import FluidLabCase from './FluidLabCase.jsx'
import HeroMechanism from './HeroMechanism.jsx'
import {PaperFigure} from './ContextAtlas.jsx'
import HeroDemoBackground from './HeroVideo.jsx'
import {CurrentResults,CurrentGeneralization,Publications} from './CurrentStudy.jsx'

const base = import.meta.env.BASE_URL
const asset = p => `${base}assets/${p}`
const data = p => `${base}data/${p}`
const name = id => String(id || '').replace(/^pwa?_\d+_/, '').replace(/_/g, ' ')

function useData(path, csv=false) {
  const [value,setValue] = useState(null)
  useEffect(() => { (csv ? fetchCsv(path) : fetchJson(path)).then(setValue).catch(() => setValue(false)) }, [path,csv])
  return value
}

function Icon({type='arrow'}) {
  return <span className="icon" aria-hidden="true">{type === 'download' ? '↓' : type === 'file' ? '▤' : type === 'play' ? '▶' : '↗'}</span>
}


function Nav() {
  const [open,setOpen] = useState(false)
  const links=[['abstract','Abstract'],['method','Framework'],['experimental-design','Design'],['results','Results'],['discussion','Discussion'],['resources','Publications']]
  return <nav className="topbar"><a className="brand" href="#top"><span className="project-mark" aria-hidden="true" title="Visual Physical Systems">ΒΠΣ</span><span className="project-name"><b>V</b>isual <b>P</b>hysical <b>S</b>ystems</span></a><button className="menu" aria-expanded={open} aria-controls="navigation-links" onClick={()=>setOpen(!open)}>{open?'Close':'Menu'} <b>{open?'−':'+'}</b></button><div id="navigation-links" className={`navlinks ${open?'open':''}`}>{links.map(([id,label])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{label}</a>)}</div><span className="progress"/></nav>
}

function History({src,count=12,title}){const [frame,setFrame]=useState(0),[play,setPlay]=useState(false);useEffect(()=>{if(!play)return;const id=setInterval(()=>setFrame(x=>(x+1)%count),250);return()=>clearInterval(id)},[play,count]);return <div className="history"><div className="history-image"><img src={asset(`history/${src}/t${String(frame).padStart(4,'0')}.png`)} alt={`${title}, saved frame ${frame+1} of ${count}`}/><span>{title}</span><b>{frame+1} / {count}</b></div><div className="history-controls"><button onClick={()=>setPlay(!play)}>{play?'Ⅱ':'▶'} {play?'Pause':'Play'}</button><input type="range" min="0" max={count-1} value={frame} onChange={e=>{setPlay(false);setFrame(+e.target.value)}} aria-label={`${title} frame`}/></div></div>}

const aliasSeries=[['branch_a_utility','Reference motion','#147b83'],['branch_b_utility','Altered motion','#cf784a']]
const predSeries=[['truth_utility','Measured','#147b83'],['predicted_utility_mean','RGB prediction','#7f74bf']]
function Plot({rows,series,selected,onSelect}) {
  if (!rows?.length) return null
  const vals=rows.flatMap(r=>series.map(s=>Number(r[s[0]])))
  if (vals.some(v=>!Number.isFinite(v))) return <p role="alert">The response data could not be plotted.</p>
  const lo=Math.min(...vals), hi=Math.max(...vals), pad=Math.max((hi-lo)*.2,.02)
  const min=lo-pad,max=hi+pad,w=620,h=285,L=60,R=30,T=26,B=58
  const x=i=>L+i*(w-L-R)/Math.max(rows.length-1,1)
  const y=v=>T+(max-v)/(max-min)*(h-T-B)
  return <div className="plot">
    <div className="legend">{series.map(s=><span key={s[0]}><i style={{background:s[2]}}/>{s[1]}</span>)}</div>
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Action utility comparison. Higher values are better; exact values are available in the accompanying source table.">
      {[0,1,2,3].map(t=>{const v=min+t*(max-min)/3;return <g key={t}><line x1={L} x2={w-R} y1={y(v)} y2={y(v)} className="grid-line"/><text x={L-12} y={y(v)+4} textAnchor="end" className="axis">{fmt(v,2)}</text></g>})}
      {selected!=null&&<rect x={x(selected)-22} y={T} width="44" height={h-T-B} className="selected"/>}
      {series.map((s,j)=><g key={s[0]}><polyline fill="none" stroke={s[2]} strokeWidth="2.6" strokeDasharray={j?'6 5':undefined} points={rows.map((r,i)=>`${x(i)},${y(Number(r[s[0]]))}`).join(' ')}/>{rows.map((r,i)=><circle key={i} cx={x(i)} cy={y(Number(r[s[0]]))} r="5" fill={s[2]} stroke="white" strokeWidth="2"><title>{name(r.action_id||r.suffix_id)} · {s[1]}: {fmt(r[s[0]],5)}</title></circle>)}</g>)}
      {rows.map((r,i)=><text key={i} x={x(i)} y={h-23} textAnchor="middle" className="axis">{name(r.action_id||r.suffix_id).split(' ').map((z,j)=><tspan key={j} x={x(i)} dy={j?12:0}>{z}</tspan>)}</text>)}
    </svg>
    {onSelect&&<div className="action-buttons" role="group" aria-label="Inspect a candidate action">{rows.map((r,i)=><button key={i} aria-pressed={selected===i} className={selected===i?'selected':''} onClick={()=>onSelect(i)}>{name(r.suffix_id||r.action_id)}</button>)}</div>}
  </div>
}

function CSVTable({rows,series,href}){return <details className="details"><summary>Show exact values and source CSV</summary><div className="scroll-table"><table><thead><tr><th>Candidate action</th>{series.map(s=><th key={s[0]}>{s[1]}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td>{name(r.action_id||r.suffix_id)}</td>{series.map(s=><td key={s[0]}>{fmt(r[s[0]],6)}</td>)}</tr>)}</tbody></table></div>{href&&<a className="source" href={href} download>Download source data <Icon type="download"/></a>}</details>}

function Hero() {
  const [mode,setMode]=useState('title'),[locked,setLocked]=useState(null),timer=useRef(null)
  useEffect(()=>()=>clearTimeout(timer.current),[])
  const preview=next=>{clearTimeout(timer.current);if(!locked)setMode(next)}
  const pin=next=>{clearTimeout(timer.current);setMode(next);setLocked(next)}
  return <div className="hero-wrap" data-info={mode==='title'?'visible':'hidden'} data-view={mode} data-pinned={locked||'none'}><HeroDemoBackground mode={mode} locked={locked} onPreview={preview} onPin={pin}/><header className="hero">
    <div className="hero-copy" id="hero-publication-links">
      <h1>Predicting Physics, Choosing Actions</h1>
      <p className="hero-title">Rethinking Evaluation in Visual Physical Systems</p>
      <div className="authors"><a href="https://styokuok.github.io/main/" target="_blank" rel="noreferrer">Zhenghe Guo</a><span>Zhejiang University</span></div>
      <div className="hero-actions"><a className="button primary" href="https://doi.org/10.5281/zenodo.24585529" target="_blank" rel="noreferrer"><Icon type="file"/>Preprint</a><a className="button outline" href={`${base}report/index.html`}><Icon type="file"/>Project report</a></div>
    </div>
    <a className="scroll-cue" href="#abstract">Read more <b aria-hidden="true">↓</b></a>
  </header></div>
}

function Abstract(){return <section id="abstract" className="section abstract"><div className="section-label"><h2>Abstract</h2></div><div className="prose"><p>Learning physical dynamics from images requires predicting how alternative actions change a system. State-prediction accuracy and successful action selection assess parts of this ability, but their relationship to prediction across alternatives is difficult to establish from either score alone. Selected state targets can leave action-relevant motion unspecified, while actions that succeed across many states can conceal errors in the predicted consequences of alternatives. We introduce a joint evaluation framework for visual physical models that relates selected state targets, outcomes across candidate actions, and the utility of the resulting choice. Restoring the same simulator state before each action provides a common physical reference for the comparison.</p><p>In fluid interactions, hidden motion can change action outcomes while leaving a shared optimal action, and the three assessments can favor different inputs. On identical evaluation cases, a predictor with lower outcome error can also make worse choices. Changing the downstream predictor substantially improves outcome prediction from a fixed representation, while trajectory experiments locate large errors in actions far from those used for fitting. A deformable-object comparison finds lower outcome error from images than from directly supplied state summaries. These findings connect differences in model assessments to the information specified by state targets, shared action preferences, and predictor generalization. Evaluating candidate-action outcomes alongside state prediction and decision quality reveals which consequences a fitted model predicts accurately and where successful choices conceal prediction errors.</p></div></section>}

function Highlights(){return <section id="highlights" className="section highlights"><div className="section-head"><h2>Highlights</h2><p>Saved-state replay measures the alternatives a model predicts. The same physical reference connects prediction of selected state targets, consequences across candidate actions, and the utility of the resulting choice.</p></div><h3>Evaluation object and saved-state replay</h3><p className="highlight-intro">Consider a pouring system choosing whether to continue tilting, brake or pause. Executing only the chosen action leaves the alternatives unmeasured. Restoring the same starting state before every candidate action makes its complete consequences available for comparison.</p><figure className="method-diagram"><div className="diagram-save"><span className="eyebrow">Simulator</span><b>Save state <i>s</i></b><small>positions · velocities · task configuration</small></div><div className="diagram-arrow">→</div><div className="diagram-actions">{['Delayed tip','Two pulse','Lift & tip','Translate & tip'].map((x,i)=><div key={x}><small>restore same state</small><b>{x}</b><em>Y(a<sub>{i+1}</sub>)</em></div>)}</div><div className="diagram-table"><span className="eyebrow">Response table</span><b>Every candidate outcome</b><div>{[1,2,3,4].map(i=><i key={i}/>)}</div></div><div className="diagram-predict"><span>Observation history <b>o<sub>1:t</sub></b></span><strong>+</strong><span>Candidate action <b>a</b></span><strong>→</strong><span>Visual representation & readout <b>Ŷ(a)</b></span></div><figcaption>The simulator constructs evaluation labels. The visual predictor receives rendered history and the queried action. Each study declares its physical-state and action split. PassWater tests held-out actions at fixed configurations; the other main comparisons reserve new states.</figcaption></figure></section>}

function Method(){return <section id="method" className="section method"><div className="section-head"><h2>Evaluation framework</h2><p>The evaluation links simulator replay to learned prediction. Replay measures the consequences of alternative actions from the same starting state. Learned predictors receive only their declared inputs, and their predictions and choices are compared with these measured outcomes.</p></div><div className="method-intro"><h3>Prediction problem and common physical reference</h3><p>The evaluated object is an action-conditioned predictor on a declared bank of alternative controls. Restored-state replay measures every alternative from the same physical starting point. Selected-target prediction, candidate-outcome recovery, and the realized utility of the chosen action can then be evaluated against one common reference.</p></div><ProtocolFigure name="evaluation-overview" title="Evaluation architecture: a prediction path and an independently restored physical reference meet in linked assessment."/><details className="details"><summary>Component interfaces and information flow</summary><div className="framework-contract"><h4>Components and their connections</h4><div className="scroll-table"><table><thead><tr><th>Component</th><th>Receives</th><th>Produces and passes forward</th></tr></thead><tbody><tr><th>Evaluation specification</th><td>Physical cases, declared observations, selected state targets, candidate controls and task utility.</td><td>A shared case/action index used by both replay and prediction. This fixes what each score refers to.</td></tr><tr><th>Restored-state reference</th><td>A saved state and one candidate action at a time.</td><td>The complete measured outcome table and true action utilities. State is restored before each alternative.</td></tr><tr><th>Evaluated predictor</th><td>Its declared observation or input control, plus the queried action.</td><td>Selected-target estimates and predicted candidate outcomes. The visual path receives image features, rather than simulator state.</td></tr><tr><th>Linked assessment and controls</th><td>Predictions and measured truth at identical case/action indices.</td><td>Target scores, outcome errors, and true utility of the predicted-best action. Controlled input, readout and action changes test why these assessments disagree.</td></tr></tbody></table></div><p>The model architecture below instantiates the predictor component. It sits inside the evaluation procedure: the replay reference constructs truth independently, and the assessment joins those two paths.</p></div></details><div className="framework-boundaries"><div><b>Prediction path</b><p>Pre-action images → frozen frame features → learned temporal representation. A target probe examines selected current-state properties. An action-conditioned readout predicts the consequences of each candidate action.</p></div><div><b>Physical reference</b><p>Restore one saved simulator state before executing each alternative. The resulting action–outcome table supplies a common ground truth for prediction error and the realized utility of the selected action.</p></div></div><ModelSection/><h3 className="framework-part">Prediction and decision scores</h3><div className="measure-grid"><article><b>z → target</b><h4>Current-state prediction</h4><p>Fit probes for the selected pre-action velocity summaries and the declared branch target from the frozen representation.</p><small>Accessibility score I ↑</small></article><article><b>z, a → outcome</b><h4>Consequence recovery</h4><p>Predict each declared action’s terminal quantities or utility. SoftGym utility recovery and terminal-vector recovery are reported as separate fitted outputs.</p><small>Utility / outcome RMSE ↓</small></article><article><b>choice → replay</b><h4>Decision quality</h4><p>Select the predicted best action and evaluate its actual utility.</p><small>Normalized utility R ↑</small></article></div><h3 className="framework-part">Information and prediction–decision relationships</h3><details className="details math"><summary>Measurement definitions and mathematical relationships</summary><div className="math-definitions"><p>For a saved state <i>s</i> and declared finite action set <i>A</i>, the complete response table is <i>M(s) = &#123;Y(s,a): a ∈ A&#125;</i>. Its task-utility vector has entries <i>m(a) = u(Y(s,a))</i>. A predictor receives the frozen representation and the queried action.</p><p><b>Selected current-state targets.</b> PourWaterAmount accessibility <i>I</i> averages clipped velocity-target R² and chance-corrected branch balanced accuracy. The historical PassWater branch label is a collection role that can reverse for identical physical states; its composite score is retained only with that interpretation.</p><p><b>Action-consequence error.</b> For <i>K</i> candidate actions, utility RMSE is <i>‖m̂ − m‖₂ / √K</i>. Centered RMSE subtracts each vector’s action mean before computing the same error; this removes a common offset while retaining errors in the relative action profile.</p><p><b>Decision utility.</b> Choose <i>â ∈ argmax m̂(a)</i>. Regret is <i>max m − m(â)</i>. With positive true spread <i>d = max m − min m</i>, normalized utility is <i>R = 1 − regret/d</i>. Accuracy accepts any true maximizing action; <i>R</i> measures the cost of a wrong choice. Flat response vectors have no normalized score.</p><p><b>When prediction controls decisions.</b> If the maximum action-wise error is at most <i>ε</i>, the selected action’s regret is at most <i>2ε</i>. If the true top-two margin exceeds <i>2ε</i>, the selected action is optimal. Lower average RMSE alone does not guarantee a better choice.</p><p><b>When state targets control consequences.</b> If <i>m(a)=gₐ(T)+r(a)</i>, each <i>gₐ</i> is <i>L</i>-Lipschitz, and the largest residual is <i>η</i>, a target-induced decision has regret at most <i>2Lρ(T̂,T)+2η</i>. Accessibility <i>I</i> does not estimate <i>L</i> or <i>η</i>; the bound supplies conditions to check.</p><p>Exact response sufficiency requires one shared action-conditioned rule to recover every declared outcome. It implies decision sufficiency because the outcome table determines the optimal action. Empirical readout error evaluates a fitted system and can reflect representation, predictor specification, estimation, or optimization.</p></div></details><h3 className="framework-part">Controlled comparisons and statistical estimation</h3><p className="framework-explanation">Observation interventions test which consequences can be distinguished from the supplied images. Input and readout comparisons separate changes in available information from changes in the fitted predictor. Action-bank and trajectory comparisons examine shared preferences and extrapolation. Case identities, fitting splits, and statistical units are declared for each study: whole-context resampling for PourWaterAmount and equal exact-configuration weighting for the matched PassWater comparison.</p></section>}

function OriginalComparison({report}) {
  const [task,setTask]=useState('PourWaterAmount')
  if(!report)return null
  const rows=report.benchmark.filter(row=>row.task===task)
  return <section className="original-comparison"><h3>State targets, response recovery, and decisions</h3>
    <p>These original frozen-ridge scores are retained as a historical comparison. PourWaterAmount uses 128 final physical contexts. PassWater uses the original weights of repeated origin records, with nine actual paired configurations.</p>
    <div className="switch light" role="group" aria-label="Task"><button aria-pressed={task==='PassWater'} className={task==='PassWater'?'on':''} onClick={()=>setTask('PassWater')}>PassWater</button><button aria-pressed={task==='PourWaterAmount'} className={task==='PourWaterAmount'?'on':''} onClick={()=>setTask('PourWaterAmount')}>PourWaterAmount</button></div>
    <div className="scroll-table"><table><thead><tr><th>Input</th><th>Target I ↑</th><th>Raw RMSE ↓</th><th>Centered RMSE ↓</th><th>Action accuracy ↑</th><th>Decision utility R ↑</th></tr></thead><tbody>{rows.map(row=><tr key={row.input}><td>{row.input}</td>{['target','rmse','centered','accuracy','utility'].map(k=><td key={k}>{fmt(row[k],3)}</td>)}</tr>)}</tbody></table></div>
    <p className="figure-note">Three-seed means. Raw/centered errors and accuracy include all cases; R uses positive-spread cases. The withdrawn PassWater physical-input row is excluded. Main PassWater comparisons below use exact configuration identities.</p>
    <p>{task==='PassWater'?'RGB has target accessibility I = 0.676, while action-only has I = 0. The original readouts choose equally useful actions despite their different prediction errors.':'Physical summaries have lower raw response error than action-only input, while action-only achieves higher decision utility. The centered errors show that a shared utility offset accounts for part of the raw-error difference.'}</p>
  </section>
}

function Results({report}){return <CurrentResults><Generalization/><details className="details historical-results"><summary>Original frozen-ridge comparison and its sampling identity</summary><OriginalComparison report={report}/></details><details className="details"><summary>Inspect the original particle, control-command and saved-prediction diagnostics</summary><RawExplorer/><Examples report={report}/></details></CurrentResults>}

function Examples({report}) {
  const predictions=useData(data('prediction_examples.csv'),true)
  const aliases=useData(asset('pouring_utility_table.csv'),true)
  const [q,setQ]=useState('0.5')
  const chosen=predictions?.filter(r=>r.quantile===q&&r.condition==='ordered_rgb').map(r=>({...r,truth_utility:r.truth,predicted_utility_mean:r.prediction_mean}))
  const branches=aliases?.slice(4)
  return <section className="evidence-subsection" id="examples">
    <div className="section-head"><h3>Observation ambiguity and action-level predictions</h3><p>Paired PourWaterAmount branches share the same observed history while their hidden velocities differ. Comparing their responses shows which action consequences are ambiguous from the images.</p></div>
    <div className="examples-layout">
      <div><History src="pouring_reference_history" count={21} title="Shared observation history"/><p className="figure-note">Zero pixel difference between the retained branch histories. The exported prefix contains 21 frames; the learner uses 12. These are pre-action observations.</p></div>
      <div className="alias-example"><h4>Shared images, different responses</h4>{branches&&<><Plot rows={branches} series={aliasSeries}/><p>Both branches favor translate and tip among the four held-out actions. Their response profiles differ, while their best action remains the same.</p><CSVTable rows={branches} series={aliasSeries} href={asset('pouring_utility_table.csv')}/></>}</div>
    </div>
    <div className="evidence-pair"><div><h4 id="observation-bound">Observation error lower bound</h4>{report?.alias?.final&&<p>Across 128 final contexts, the pairwise observation MSE lower bound is <b>{fmt(report.alias.final.pooled_mse_floor.estimate,6)}</b>, versus fitted RGB MSE <b>{fmt(report.alias.fitted_mse,6)}</b> under the same squared-error weighting. The paired floor isolates the prediction cost of the shared observation; the fitted error also depends on the learned representation and readout.</p>}</div><div><h4 id="ties">Action accuracy after removing flat cases</h4><p>Excluding flat response vectors reduces PourWaterAmount action-only accuracy from <b>0.875 to 0.676</b>. RGB and physical-summary accuracy are <b>0.422 and 0.474</b> on the remaining population. The action-only advantage persists when action choice matters.</p></div></div>
    <div className="prediction-heading"><h4>Representative predicted response vectors</h4><p>The archived PassWater readout supplies illustrative vectors at fixed error percentiles. They remain distinct from the current matched-RBF comparison above.</p></div>
    <figure className="card prediction-card" id="prediction-examples"><div className="toolbar"><span>Saved original RGB readout · PassWater</span><label>Error percentile <select value={q} onChange={e=>setQ(e.target.value)}><option value="0.25">25th percentile</option><option value="0.5">Median</option><option value="0.75">75th percentile</option></select></label></div>{chosen?.length&&<><Plot rows={chosen} series={predSeries}/><figcaption>Cases are selected by the mean per-seed RMSE rank among 418 nominal positive-spread branch–camera records, repeating the fixed configurations. Predictions average three encoder seeds from the original readout. Each curve contains the four held-out action responses. This PassWater panel uses different physical cases from the PourWaterAmount history example above.</figcaption><CSVTable rows={chosen} series={predSeries} href={data('prediction_examples.csv')}/></>}</figure>
  </section>
}

function Generalization(){return <CurrentGeneralization><FluidLabCase/></CurrentGeneralization>}
function Discussion(){return <section id="discussion" className="section discussion"><div className="section-head"><h2>Discussion</h2></div><p>A shared best action allows useful choices even when the model predicts the alternatives inaccurately. When the best action changes, decision quality depends on which errors reverse the comparison and on the cost of the resulting mistake. The paired records establish the underlying action preferences; the fitted comparisons show how prediction errors interact with them.</p><p>Selected-target accuracy measures access to the declared quantities. The joint measurements test how that information carries over to candidate outcomes and decisions. Readout replacements, outcome-class weights, and action-distance groups then distinguish different reasons for score disagreement. ShapeRope carries the same comparison into a deformable-object setting.</p><p>Model selection and supervision are subsequent uses of these measurements. The trajectory criteria choose different visual candidates with closely matched final performance. Direct outcome supervision has mixed effects across the matched training procedures. Together these studies examine physical prediction, the choices it induces, and the effect of using its scores to select or train a model.</p></section>}

function Resources(){return <Publications/>}

export default function App() {
  const report=useData(data('research.json'))
  useEffect(()=>{
    let pending
    const follow=()=>{
      pending?.disconnect()
      const id=decodeURIComponent(window.location.hash.slice(1))
      if(!id)return
      const jump=()=>{
        const target=document.getElementById(id)
        if(!target)return false
        for(let node=target.parentElement;node;node=node.parentElement){if(node.tagName==='DETAILS')node.open=true}
        requestAnimationFrame(()=>target.scrollIntoView({behavior:'instant',block:'start'}))
        return true
      }
      if(jump())return
      pending=new MutationObserver(()=>{if(jump())pending.disconnect()})
      pending.observe(document.getElementById('root'),{childList:true,subtree:true})
    }
    window.addEventListener('hashchange',follow)
    follow()
    return()=>{window.removeEventListener('hashchange',follow);pending?.disconnect()}
  },[])
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
    }),{threshold:.06})
    document.querySelectorAll('.section-head,.method-diagram,.experiment-setup,.result-split,.examples-layout,.prediction-card,.general-split,.resource-grid').forEach(el=>{
      el.classList.add('reveal');observer.observe(el)
    })
    const update=()=>{
      const extent=document.documentElement.scrollHeight-window.innerHeight
      document.querySelector('.progress')?.style.setProperty('transform',`scaleX(${extent>0?window.scrollY/extent:0})`)
    }
    window.addEventListener('scroll',update,{passive:true});update()
    return()=>{observer.disconnect();window.removeEventListener('scroll',update)}
  },[])
  return <><a className="skip-link" href="#abstract">Skip to content</a><Nav/><main id="top"><Hero/><Abstract/><Highlights/><Method/><Results report={report}/><Discussion/><Conclusion/><Resources/></main><footer><a href="#top">Predicting Physics, Choosing Actions</a><span>Zhenghe Guo · Zhejiang University</span><a href="https://styokuok.github.io/main/" target="_blank" rel="noreferrer">Author website ↗</a></footer></>
}
