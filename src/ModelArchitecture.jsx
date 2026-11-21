import React,{useState} from 'react'

function Node({title,detail,className=''}){return <div className={`architecture-node ${className}`}><b>{title}</b><span>{detail}</span></div>}
function Arrow(){return <span className="path-arrow" aria-hidden="true">→</span>}

export default function ModelArchitecture(){
  const [path,setPath]=useState('rgb')
  return <section className="architecture-section" id="architecture">
    <h3>Representation learning and downstream evaluation</h3>
    <p className="architecture-intro">Visual representation learning uses the fitting actions’ measured utilities. We then freeze the representation and evaluate it through two paths: predicting selected current-state targets, and predicting action consequences from which a decision is made.</p>
    <div className="architecture-tabs" role="group" aria-label="Representation input">
      <button aria-pressed={path==='rgb'} onClick={()=>setPath('rgb')}>Ordered RGB history</button>
      <button aria-pressed={path==='frame'} onClick={()=>setPath('frame')}>Final frame / temporal controls</button>
      <button aria-pressed={path==='action'} onClick={()=>setPath('action')}>Action-only control</button>
    </div>
    <figure className="architecture-figure">
      <div className="architecture-stage learning-stage">
        <h4>Learn from fitting-action outcomes</h4>
        {path==='action'?<p className="action-only-explanation">The action-only control removes state-specific observations. Its downstream predictor still receives each candidate action and the same fitting-action labels, allowing us to measure how useful a default action preference is.</p>:<>
          <div className="encoder-path">
            <Node title={path==='frame'?'Altered temporal input':'Pre-action RGB history'} detail={path==='frame'?'Final-frame, mean-feature, and permuted-history conditions vary the available temporal information.':'Frames observed before the candidate continuation starts.'}/><Arrow/>
            <Node title="Frozen frame encoder" detail="DINOv2 or ImageNet ResNet-18 features."/><Arrow/>
            <Node title="Trainable temporal encoder" detail="LayerNorm → projection + GELU → GRU → LayerNorm." className="encoder-node"/><Arrow/>
            <Node title="Representation z" detail="State-specific features passed to the training head and, after freezing, the evaluation readouts." className="representation-node"/>
          </div>
          <div className="training-path">
            <div className="joint-input"><b>z</b><span>+</span><b>Fitting action a</b><small>State and action enter together</small></div><Arrow/>
            <Node title="Predict fitting-action utility" detail="Training head: state term + action term + bilinear interaction."/><Arrow/>
            <Node title="Compare with measured utility" detail="Prediction loss updates the temporal encoder and training head." className="label-node"/>
          </div>
          <div className="training-feedback"><span aria-hidden="true">↖</span> Loss trains the temporal encoder; the visual backbone remains frozen.</div>
        </>}
        <p className="architecture-note">Additional matched training conditions vary velocity supervision and action-ranking loss. Only fitting actions supply these learning labels.</p>
      </div>
      <div className="stage-separator"><span>Freeze z · fit separate readouts on fitting origins</span><span aria-hidden="true">↓</span></div>
      <div className="architecture-stage evaluation-stage">
        <h4>Evaluate new physical origins and held-out actions</h4>
        <div className="evaluation-path target-path"><div className="evaluation-purpose"><b>Current-state targets</b><span>One diagnostic branch</span></div><div className="evaluation-chain"><Node title="Frozen z → target probe" detail="Predict declared velocity summaries and hidden-branch identity."/><Arrow/><Node title="Accessibility I" detail="Score these selected pre-action targets on separate origins."/></div></div>
        <div className="evaluation-path decision-path"><div className="evaluation-purpose"><b>Action consequences → decisions</b><span>Prediction followed by a choice</span></div><div className="evaluation-chain"><Node title="Frozen z + queried action a" detail="Fit an action-conditioned readout; query every held-out action."/><Arrow/><Node title="Complete predicted response" detail="Compare predicted utilities with all measured replay outcomes → RMSE."/><Arrow/><Node title="Choose argmax prediction" detail="Look up the chosen action’s true replay utility → accuracy and R."/></div></div>
      </div>
      <figcaption>Implementation: temporal encoder and training interaction head in <code>fws_boundary_factorial_v1.py</code>. The original downstream ridge uses [z, a, z⊗a] and is fitted separately after representation learning. CPU sensitivity analyses replace this readout with CV bilinear or RBF predictors while keeping the trained encoders frozen.</figcaption>
    </figure>
    <p className="architecture-input-note">The visual inference path receives pre-action images and the queried action. Simulator state and terminal outcomes construct labels and evaluation truth. Supplied physical summaries are a separately identified input control.</p>
  </section>
}
