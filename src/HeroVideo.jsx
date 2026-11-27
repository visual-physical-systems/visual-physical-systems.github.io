import React,{useEffect,useRef,useState} from 'react'
const base=import.meta.env.BASE_URL

// The narrative and evidence are edited into the MP4. The page only plays it.
export default function HeroVideo({mode,locked,onPreview,onPin}){
  const ref=useRef(null)
  const [mobile,setMobile]=useState(()=>matchMedia('(max-width:600px)').matches)
  const [playing,setPlaying]=useState(false)
  useEffect(()=>{const m=matchMedia('(max-width:600px)');const update=()=>setMobile(m.matches);m.addEventListener('change',update);return()=>m.removeEventListener('change',update)},[])
  useEffect(()=>{const v=ref.current;if(!v)return;if(mode==='demo')v.play().catch(()=>setPlaying(false));else v.pause()},[mode,mobile])
  const name=mobile?'research-demo-mobile':'research-demo'
  const toggle=()=>{const v=ref.current;if(v.paused)v.play().catch(()=>setPlaying(false));else v.pause()}
  return <><div className="native-film"><img className="title-mosaic" src={`${base}assets/demo/title-background${mobile?'-mobile':''}-poster.webp`} alt="" aria-hidden="true"/><video className="demo-film" key={name} ref={ref} src={`${base}assets/demo/${name}.mp4`} poster={`${base}assets/demo/${name}-poster.webp`} muted loop playsInline preload="auto" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} aria-label="Research teaser: real observations, restored alternatives, one evaluation framework and the prediction–decision comparison."/><span className="sr-only">The demo uses archived RGB histories and measured results. Our framework relates state targets, all action outcomes and the resulting choice through restored-state replay. In the matched PassWater comparison, RGB history has lower RMSE, 0.1556 versus 0.2082, while action-only has higher decision utility, 0.7778 versus 0.7130.</span></div><div className="native-film-controls"><div className="hero-view-switch" role="group" aria-label="Title or demo; hover to preview, click to pin">{['title','demo'].map(view=><button key={view} aria-pressed={mode===view} data-pinned={locked===view} onPointerEnter={()=>onPreview(view)} onFocus={()=>onPreview(view)} onClick={()=>onPin(view)} title={`Hover to preview ${view}; click to keep this view`}>{view==='title'?'Title':'Demo'}{locked===view&&<span aria-label="pinned"> ·</span>}</button>)}</div><button className="demo-pause-icon" style={{visibility:mode==='demo'?'visible':'hidden'}} disabled={mode!=='demo'} onClick={toggle} aria-label={playing?'Pause demo':'Resume demo'}>{playing?'Ⅱ':'▶'}</button></div></>
}
