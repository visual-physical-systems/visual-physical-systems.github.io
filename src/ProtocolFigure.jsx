import React from 'react'
const base=import.meta.env.BASE_URL
export default function ProtocolFigure({name,title}){const prefix=`${base}assets/protocol-diagrams/${name}`;return <figure className="protocol-figure"><div className="protocol-figure-scroll"><img src={`${prefix}.svg`} alt={title}/></div><figcaption>{title} <a href={`${prefix}.png`} target="_blank" rel="noreferrer">Full size ↗</a><a href={`${prefix}.drawio`} download>Editable diagram ↓</a></figcaption></figure>}
