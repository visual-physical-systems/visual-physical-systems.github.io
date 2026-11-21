import React from 'react'

export default function Conclusion() {
  return <section id="conclusion" className="section conclusion">
    <div className="section-head"><h2>Conclusion</h2></div>
    <div className="conclusion-copy">
      <p className="conclusion-lead">Current-state prediction, action-consequence prediction, and decision quality support different judgments about a visual physical model.</p>
      <p>Predicting selected properties of the present leaves open how accurately a model predicts the effects of alternative actions. A useful choice can come from an action that performs well across many states, even when the other action outcomes are poorly predicted. Conversely, lower average prediction error can still produce worse choices. The matched comparisons demonstrate these disagreements on the same physical cases and candidate actions.</p>
      <p>The contribution is an evaluation methodology that makes those alternatives measurable: restore the same physical state before each action, construct its complete action–outcome table, and compare current-state targets, predicted consequences, and realized decision utility together. This gives a concrete way to test whether an apparent gain in state prediction or action selection also improves the model’s account of what each action will cause.</p>
      <p>The additional readout analyses also change the interpretation of prediction failures. Substantial error reductions with frozen encoders show that the measured errors depend on the downstream predictor and fitting data. The supported conclusions concern the evaluated representation–predictor systems and declared action sets. Observation ambiguity, encoder information, estimation, and action extrapolation require separate controls; full three-way replication beyond fluids remains open.</p>
    </div>
    <div className="conclusion-implication"><h3>Implication for evaluating physical world models</h3><p>Report current-state target performance, recovery of the full candidate-action response vector, and the measured utility of the chosen action on matched cases. Include action-only comparisons, tie-aware decision analysis, and readout sensitivity so that a strong default choice or a weak predictor can be recognized in the evaluation.</p></div>
  </section>
}
