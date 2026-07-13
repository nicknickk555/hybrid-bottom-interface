"use client";

import { useEffect, useMemo, useState } from "react";

const zones = [
  { n: "01", title: "Geometry", text: "Shapes the airflow path and places every root–membrane contact point." },
  { n: "02", title: "Typar interface", text: "Turns open-air shock into a measured, moisture-buffered transition." },
  { n: "03", title: "Controlled drying", text: "Sets the delay before turgor loss triggers lateral branching." },
];

export default function Home() {
  const [portalOpen, setPortalOpen] = useState(true);
  const [climate, setClimate] = useState("kyiv");
  const [material, setMaterial] = useState("sf20");
  const [airflow, setAirflow] = useState(0.7);
  const [humidity, setHumidity] = useState(62);
  const [mode, setMode] = useState("natural");

  useEffect(() => {
    document.documentElement.classList.add("portalLocked");
    return () => document.documentElement.classList.remove("portalLocked");
  }, []);

  const dismissPortal = () => {
    document.documentElement.classList.remove("portalLocked");
    setPortalOpen(false);
  };

  const result = useMemo(() => {
    const climateBase = climate === "kyiv" ? 1 : climate === "london" ? 0.77 : 0.92;
    const fabric = material === "sf20" ? 1 : material === "sf32" ? 1.18 : 0.86;
    const forced = mode === "forced" ? 1.24 : 1;
    const drying = Math.max(.35, (1.35 - humidity / 100) * (0.7 + airflow) * forced / fabric);
    const delay = Math.max(18, Math.round(118 / drying));
    const center = 1.51 * climateBase * drying;
    const ring = 6.56 * climateBase * (.82 + airflow * .24);
    return { delay, center, ring, total: center + ring, drying };
  }, [climate, material, airflow, humidity, mode]);

  return (
    <main>
      <section className={`portal ${portalOpen ? "isOpen" : "isClosed"}`} id="portal" aria-labelledby="portal-title" aria-hidden={!portalOpen}>
        <img className="portalImage" src="/og.png" alt="" aria-hidden="true" />
        <div className="portalSemantics">
          <h1 id="portal-title">Hybrid Bottom</h1>
          <p>Design the pause before the branch.</p>
        </div>
        <div className="portalControls">
          <a className="portalEnter" href="#concept" onClick={dismissPortal}>Enter the system <span aria-hidden="true">↓</span></a>
          <nav className="portalNav" aria-label="Explore the three sections">
            <a href="#concept" onClick={dismissPortal}><span>01</span> Concept</a>
            <a href="#architecture" onClick={dismissPortal}><span>02</span> Architecture</a>
            <a href="#model" onClick={dismissPortal}><span>03</span> Model</a>
          </nav>
        </div>
      </section>

      <header className={`topbar ${portalOpen ? "" : "isVisible"}`}>
        <a className="brand" href="#concept"><span className="brandMark">HB</span><span>Hybrid Bottom<br/><small>Root interface system</small></span></a>
        <nav aria-label="Primary navigation"><a href="#concept">01 Concept</a><a href="#architecture">02 Architecture</a><a href="#model">03 Model</a></nav>
        <a className="topCta" href="#model">Explore model <span>↘</span></a>
      </header>

      <section className="screen hero" id="concept">
        <div className="eyebrow"><span/> Controlled root pruning interface</div>
        <div className="heroGrid">
          <div>
            <h1>Design the pause<br/>before the <em>branch.</em></h1>
            <p className="lead">Hybrid Bottom controls how roots meet air. Geometry directs the flow, Typar moderates moisture, and micro-drying turns a passive container base into a tunable biological interface.</p>
            <div className="actions"><a className="button primary" href="#architecture">See how it works <span>↓</span></a><a className="button ghost" href="#model">Open calculation</a></div>
          </div>
          <div className="systemGraphic" aria-label="Hybrid Bottom layered architecture">
            <div className="airLabel">ROOT ZONE <b>moisture</b></div>
            <div className="root rootA"/><div className="root rootB"/><div className="root rootC"/>
            <div className="soil"><i/><i/><i/><i/><i/></div>
            <div className="membrane"><span>TYPAR INTERFACE</span></div>
            <div className="diffuserArray">{Array.from({length: 9}).map((_,i)=><i key={i}/>)}</div>
            <div className="flowLines">↑　↑　↑　↑　↑</div>
            <div className="airBag">AIR-BAG <b>controlled airflow</b></div>
            <div className="graphicNote"><strong>One system.<br/>Three regulators.</strong><span>Geometry · Material · Climate</span></div>
          </div>
        </div>
        <div className="principles">{zones.map(z=><article key={z.n}><span>{z.n}</span><div><h3>{z.title}</h3><p>{z.text}</p></div></article>)}</div>
      </section>

      <section className="screen architecture" id="architecture">
        <div className="sectionHead"><div><div className="eyebrow light"><span/> Micro-drying diffuser</div><h2>The bevel is a<br/><em>drying actuator.</em></h2></div><p>Each cell accelerates air beneath the membrane, creating a repeatable local drying spot exactly where a root reaches the interface.</p></div>
        <div className="architectureGrid">
          <div className="cellDiagram">
            <div className="dimension topDim">10 × 10 mm</div><div className="dimension sideDim">8 mm</div><div className="dimension bottomDim">20 × 20 mm</div>
            <div className="cellTop"/><div className="cellBody"><span>32°</span></div><div className="cellBase"/>
            <div className="airArrows">↑　 ↑　 ↑</div><div className="spot">LOCAL DRYING<br/><b>SPOT</b></div>
          </div>
          <div className="mechanism">
            <div className="metricHero"><small>FLOW ACCELERATION</small><strong>+18<sup>%</sup></strong><p>at the calculated 32° bevel</p></div>
            <ol><li><b>Air enters</b><span>from the ventilated cavity below</span></li><li><b>Flow accelerates</b><span>through the narrowing cell</span></li><li><b>Typar dries locally</b><span>at the root contact point</span></li><li><b>Root branches</b><span>after controlled turgor loss</span></li></ol>
          </div>
          <div className="modeCard"><span className="cardLabel">OPERATING MODES</span><div className="modeVisual"><i/><i/><i/><i/><i/></div><h3>Same bottom.<br/>Two intensities.</h3><div className="modeRow"><b>Natural draft</b><span>Slow, climate-led drying</span></div><div className="modeRow active"><b>Forced airflow</b><span>Fast, uniform response</span></div></div>
        </div>
        <div className="formulaStrip"><span>BEVEL ANGLE</span><b>θ = arctan ((20 − 10) / (2 × 8)) ≈ 32°</b><span>EFFECTIVE FLOW</span><b>u<sub>eff</sub> ≈ u₀ / cos(θ) ≈ 1.18 · u₀</b></div>
      </section>

      <section className="screen model" id="model">
        <div className="sectionHead dark"><div><div className="eyebrow"><span/> Live tuning model</div><h2>From climate inputs<br/>to <em>root response.</em></h2></div><p>Test how membrane, humidity and airflow change the delay before pruning and the expected lateral root density.</p></div>
        <div className="modelGrid">
          <aside className="controls">
            <label>Climate<select value={climate} onChange={e=>setClimate(e.target.value)}><option value="kyiv">Kyiv · continental</option><option value="london">London · humid</option><option value="optimized">Optimized greenhouse</option></select></label>
            <label>Membrane<select value={material} onChange={e=>setMaterial(e.target.value)}><option value="sf20">Typar SF20</option><option value="sf32">Typar SF32</option><option value="sf16">Typar SF16</option></select></label>
            <div className="segmented"><button className={mode==="natural"?"on":""} onClick={()=>setMode("natural")}>Natural</button><button className={mode==="forced"?"on":""} onClick={()=>setMode("forced")}>Forced</button></div>
            <label>Relative humidity <output>{humidity}%</output><input type="range" min="40" max="90" value={humidity} onChange={e=>setHumidity(+e.target.value)}/></label>
            <label>Airflow <output>{airflow.toFixed(1)} m/s</output><input type="range" min="0.1" max="1.5" step="0.1" value={airflow} onChange={e=>setAirflow(+e.target.value)}/></label>
            <p className="controlNote">Model is comparative. Physical validation is required before production specification.</p>
          </aside>
          <div className="results">
            <div className="resultTop"><div><small>CONTROLLED DELAY</small><strong>{result.delay}<sup>min</sup></strong><span className={result.delay<80?"status fast":"status"}>{result.delay<80?"decisive response":"soft adaptation"}</span></div><div className="dial" style={{"--value": `${Math.min(100,result.drying*52)}%`} as React.CSSProperties}><b>{Math.round(result.drying*100)}</b><small>drying<br/>index</small></div></div>
            <div className="bars"><div className="barHead"><b>Expected lateral roots / day</b><span>Relative scale · total = 100%</span></div><div className="barPlot"><div className="barItem"><i style={{height:`${Math.round(result.center/result.total*145)}px`}}/><b>{result.center.toFixed(2)}</b><span>Membrane center<br/>{Math.round(result.center/result.total*100)}%</span></div><div className="barItem ring"><i style={{height:`${Math.round(result.ring/result.total*145)}px`}}/><b>{result.ring.toFixed(2)}</b><span>Open ring<br/>{Math.round(result.ring/result.total*100)}%</span></div><div className="barItem total"><i style={{height:"145px"}}/><b>{result.total.toFixed(2)}</b><span>Total response<br/>100%</span></div></div></div>
            <div className="modelReadout"><span>WHY THIS RESULT</span><p>{humidity}% RH and {airflow.toFixed(1)} m/s airflow produce a <b>{result.delay < 80 ? "short, decisive" : "longer, adaptive"}</b> drying window with {material.toUpperCase()}.</p></div>
            <div className="conclusion"><span>WORKING HYPOTHESIS</span><p>Architecture creates the breakthrough.<br/><b>Material and airflow tune it.</b></p></div>
          </div>
        </div>
        <footer><span>HYBRID BOTTOM · CONCEPT MODEL</span><span>VENTURI CARPET TECHNOLOGY · 2026</span></footer>
      </section>
    </main>
  );
}
