import React from 'react'
import {fmt} from './helper.js'
export default function PreactionControl({report}){
  if(!report?.preaction?.response_rmse)return null
  return <div className="preaction-control" id="preaction-control"><h4>Pre-action physical summaries</h4><p>A separate ten-coordinate centroid/velocity control uses only pre-action quantities. With 64 fitting origins, its RBF readout has utility-vector RMSE <b>{fmt(report.preaction.response_rmse,4)}</b> and decision utility <b>R = {fmt(report.preaction.normalized_decision_utility_R,3)}</b>. This partial physical summary does not reproduce the withdrawn near-perfect PassWater result. A full-state recoverability control remains open.</p><a className="source" href={`${import.meta.env.BASE_URL}data/preaction_control.csv`} download>Pre-action control results ↓</a></div>
}
