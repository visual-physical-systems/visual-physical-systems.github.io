import React,{useState} from 'react'

const branches=[110,150,190,230]
export default function HeroMechanism(){
  const [paused,setPaused]=useState(false)
  return <figure className={`hero-mechanism ${paused?'paused':''}`} aria-label="Animated study architecture: predict action consequences from images, measure alternative actions from a saved state, and compare predictions and decisions.">
    <div className="hero-mechanism-head"><span>One starting point. Alternative actions. Measured consequences.</span><button aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?'Play diagram':'Pause diagram'}</button></div>
    <svg viewBox="0 -50 1100 350" role="img" aria-labelledby="mechanism-title mechanism-desc">
      <title id="mechanism-title">Prediction and simulator replay meet at the same action outcomes</title>
      <desc id="mechanism-desc">The upper path predicts consequences from pre-action images. The lower path restores the same physical state before each of four actions. Compare the complete predictions with measured outcomes, then assess the chosen action’s actual utility.</desc>
      <defs><marker id="hero-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7" fill="#84bcc2"/></marker></defs>
      <g className="mechanism-lines" fill="none" strokeWidth="1.5" markerEnd="url(#hero-arrow)">
        <path className="prediction-line" d="M155 47 H305"/>
        <path className="prediction-line" d="M475 47 H675"/>
        <path className="prediction-line" d="M815 47 H865 Q890 47 890 85 V140 H915"/>
        <path className="target-line" d="M390 22 V-20 H675 M815 -20 H900 Q905 -20 905 5 V130 H915"/>
        {branches.map((y,i)=><g key={y} className={`branch-path branch-${i}`}><path d={`M155 180 H210 Q235 180 235 ${y} H333`}/><path d={`M475 ${y} H675`}/><path d={`M815 ${y} H852 Q872 ${y} 872 170 H915`}/></g>)}
      </g>
      <g className="history-symbol" transform="translate(36 13)"><rect x="0" y="0" width="40" height="30" rx="4"/><rect x="8" y="5" width="40" height="30" rx="4"/><rect x="16" y="10" width="40" height="30" rx="4"/></g>
      <text x="35" y="74" className="mechanism-label">Pre-action images</text>
      <rect x="305" y="22" width="170" height="50" rx="8" className="mechanism-model"/>
      <text x="390" y="52" textAnchor="middle" className="mechanism-label">Learned predictor</text>
      <rect x="675" y="-35" width="140" height="30" rx="6" className="mechanism-model"/><text x="745" y="-16" textAnchor="middle" className="mechanism-small">Current-state targets</text>
      <text x="575" y="31" textAnchor="middle" className="mechanism-small">query each action</text>
      <rect x="675" y="22" width="140" height="50" rx="8" className="mechanism-model"/>
      <text x="745" y="44" textAnchor="middle" className="mechanism-label">Predicted</text><text x="745" y="61" textAnchor="middle" className="mechanism-small">consequences</text>
      <g className="saved-state-symbol" transform="translate(75 180)"><circle r="30"/><circle r="20"/><circle r="3"/></g>
      <text x="75" y="232" textAnchor="middle" className="mechanism-label">Saved physical state</text><text x="75" y="251" textAnchor="middle" className="mechanism-small">same start each time</text>
      {branches.map((y,i)=><g key={y} className={`action-branch branch-${i}`}><rect x="333" y={y-13} width="142" height="26" rx="5"/><text x="404" y={y+4} textAnchor="middle" className="mechanism-label">Action {String.fromCharCode(65+i)}</text><circle cx="685" cy={y} r="4"/><text x="702" y={y+4} className="mechanism-small">measured outcome</text></g>)}
      <text x="570" y="268" textAnchor="middle" className="mechanism-small">restore → execute → measure</text>
      <rect x="915" y="130" width="165" height="80" rx="9" className="mechanism-compare"/>
      <text x="997" y="153" textAnchor="middle" className="mechanism-label">Compare</text><text x="997" y="175" textAnchor="middle" className="mechanism-small">all action predictions</text><text x="997" y="195" textAnchor="middle" className="mechanism-small">chosen action’s utility</text>
      <circle className="prediction-traveler" r="4" fill="#99dedb"><animateMotion dur="8s" repeatCount="indefinite" path="M155 47 H815 H865 Q890 47 890 85 V140 H915"/></circle>
      {branches.map((y,i)=><circle key={y} className="replay-traveler" style={{animationDelay:`${i*2}s`}} r="4" fill="#e7b28b"><animateMotion dur="8s" begin={`${i*2}s`} repeatCount="indefinite" keyTimes="0;0.22;1" keyPoints="0;1;1" calcMode="linear" path={`M155 180 H210 Q235 180 235 ${y} H815 H852 Q872 ${y} 872 170 H915`}/></circle>)}
    </svg>
    <div className="hero-mechanism-mobile"><div><b>Images → representation → predictions</b><span>Predict selected current-state targets and each action’s consequences.</span></div><div><b>Saved state → actions → measured outcomes</b><span>Restore the same starting point for each alternative.</span></div><div><b>Compare predictions and choices</b><span>Measure all action errors and the selected action’s true utility.</span></div></div>
    <figcaption>The animation follows the evaluation’s information flow. The task recordings and measured response data appear in Experiments.</figcaption>
  </figure>
}
