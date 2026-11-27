import React,{useEffect,useRef,useState} from 'react'
import {fetchJson} from './helper.js'
const base=import.meta.env.BASE_URL

export default function ResearchBackdrop(){
  const [cases,setCases]=useState([]),[task,setTask]=useState('PourWaterAmount'),[tick,setTick]=useState(0)
  const [playing,setPlaying]=useState(()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches),[visible,setVisible]=useState(true)
  const wall=useRef(null)
  useEffect(()=>{fetchJson(`${base}data/context_atlas.json`).then(x=>setCases(x.cases)).catch(()=>{})},[])
  useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting));if(wall.current)observer.observe(wall.current);return()=>observer.disconnect()},[])
  useEffect(()=>{if(!playing||!visible)return;const id=setInterval(()=>setTick(t=>t+1),650);return()=>clearInterval(id)},[playing,visible])
  const shown=cases.filter(c=>c.task===task).slice(0,24)
  return <><div className="research-backdrop" ref={wall} aria-hidden="true">{shown.map((c,i)=><img key={c.origin} src={`${base}${c.history_paths.reference}/0/${String((tick+i)%c.frames).padStart(3,'0')}.webp`} alt="" width="224" height="224"/>)}</div><div className="backdrop-controls"><span>Background: original pre-action observation histories</span><label>Task <select aria-label="Background experiment" value={task} onChange={e=>setTask(e.target.value)}><option>PourWaterAmount</option><option>PassWater</option></select></label><button onClick={()=>setPlaying(!playing)} aria-pressed={!playing}>{playing?'Pause background':'Play background'}</button></div></>
}
