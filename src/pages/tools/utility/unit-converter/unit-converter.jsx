import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const CATEGORIES = {
  length: {
    icon: "📏", label: "Length",
    units: {
      meter:      { label: "Meter (m)",        to_base: v => v,           from_base: v => v           },
      kilometer:  { label: "Kilometer (km)",   to_base: v => v * 1000,    from_base: v => v / 1000    },
      centimeter: { label: "Centimeter (cm)",  to_base: v => v / 100,     from_base: v => v * 100     },
      millimeter: { label: "Millimeter (mm)",  to_base: v => v / 1000,    from_base: v => v * 1000    },
      mile:       { label: "Mile (mi)",         to_base: v => v * 1609.34, from_base: v => v / 1609.34 },
      yard:       { label: "Yard (yd)",         to_base: v => v * 0.9144,  from_base: v => v / 0.9144  },
      foot:       { label: "Foot (ft)",         to_base: v => v * 0.3048,  from_base: v => v / 0.3048  },
      inch:       { label: "Inch (in)",         to_base: v => v * 0.0254,  from_base: v => v / 0.0254  },
    },
  },
  weight: {
    icon: "⚖️", label: "Weight",
    units: {
      kilogram:  { label: "Kilogram (kg)",   to_base: v => v,           from_base: v => v           },
      gram:      { label: "Gram (g)",         to_base: v => v / 1000,    from_base: v => v * 1000    },
      milligram: { label: "Milligram (mg)",   to_base: v => v / 1e6,     from_base: v => v * 1e6     },
      tonne:     { label: "Metric Ton (t)",   to_base: v => v * 1000,    from_base: v => v / 1000    },
      pound:     { label: "Pound (lb)",       to_base: v => v * 0.453592,from_base: v => v / 0.453592},
      ounce:     { label: "Ounce (oz)",       to_base: v => v * 0.028349,from_base: v => v / 0.028349},
    },
  },
  temperature: {
    icon: "🌡️", label: "Temperature",
    units: {
      celsius:    { label: "Celsius (°C)",    to_base: v => v,                    from_base: v => v                    },
      fahrenheit: { label: "Fahrenheit (°F)", to_base: v => (v - 32) * 5/9,      from_base: v => v * 9/5 + 32        },
      kelvin:     { label: "Kelvin (K)",      to_base: v => v - 273.15,           from_base: v => v + 273.15           },
    },
  },
  speed: {
    icon: "🚀", label: "Speed",
    units: {
      mps:  { label: "m/s",          to_base: v => v,          from_base: v => v          },
      kph:  { label: "km/h",         to_base: v => v / 3.6,    from_base: v => v * 3.6    },
      mph:  { label: "mph",           to_base: v => v * 0.44704,from_base: v => v / 0.44704},
      knot: { label: "Knot",          to_base: v => v * 0.51444,from_base: v => v / 0.51444},
    },
  },
  area: {
    icon: "📐", label: "Area",
    units: {
      sqm:    { label: "m²",           to_base: v => v,           from_base: v => v           },
      sqkm:   { label: "km²",          to_base: v => v * 1e6,     from_base: v => v / 1e6     },
      sqcm:   { label: "cm²",          to_base: v => v / 1e4,     from_base: v => v * 1e4     },
      sqft:   { label: "ft²",          to_base: v => v * 0.0929,  from_base: v => v / 0.0929  },
      sqin:   { label: "in²",          to_base: v => v * 0.000645,from_base: v => v / 0.000645},
      acre:   { label: "Acre",          to_base: v => v * 4046.86, from_base: v => v / 4046.86 },
      hectare:{ label: "Hectare (ha)", to_base: v => v * 10000,   from_base: v => v / 10000   },
    },
  },
  volume: {
    icon: "🧴", label: "Volume",
    units: {
      liter:    { label: "Liter (L)",    to_base: v => v,          from_base: v => v          },
      ml:       { label: "Milliliter",   to_base: v => v / 1000,   from_base: v => v * 1000   },
      gallon:   { label: "Gallon (US)",  to_base: v => v * 3.78541,from_base: v => v / 3.78541},
      floz:     { label: "Fl Oz (US)",   to_base: v => v * 0.02957,from_base: v => v / 0.02957},
      cup:      { label: "Cup (US)",     to_base: v => v * 0.23659,from_base: v => v / 0.23659},
      pint:     { label: "Pint (US)",    to_base: v => v * 0.47318,from_base: v => v / 0.47318},
    },
  },
};

function convert(value, fromUnit, toUnit, category) {
  const cat = CATEGORIES[category];
  if (!cat) return null;
  const from = cat.units[fromUnit];
  const to   = cat.units[toUnit];
  if (!from || !to) return null;
  const base = from.to_base(parseFloat(value));
  const result = to.from_base(base);
  if (isNaN(result) || !isFinite(result)) return null;
  const r = Math.round(result * 1e8) / 1e8;
  return r % 1 === 0 ? r.toLocaleString() : parseFloat(r.toFixed(8)).toLocaleString();
}

export default function UnitConverter() {
  const [category, setCategory] = useState("length");
  const [value,    setValue]    = useState("");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit,   setToUnit]   = useState("kilometer");

  const cat     = CATEGORIES[category];
  const unitKeys = Object.keys(cat.units);
  const result   = value ? convert(value, fromUnit, toUnit, category) : null;

  const handleCategoryChange = (c) => {
    setCategory(c);
    const keys = Object.keys(CATEGORIES[c].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
    setValue("");
  };

  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit); };

  // All conversions from current value
  const allConversions = useMemo(() => {
    if (!value || isNaN(parseFloat(value))) return [];
    return unitKeys
      .filter(u => u !== fromUnit)
      .map(u => ({ unit: cat.units[u].label, value: convert(value, fromUnit, u, category) }))
      .filter(r => r.value !== null);
  }, [value, fromUnit, category]);

  return (
    <>
      <Helmet>
        <title>Unit Converter — Length, Weight, Temperature, Speed & More | AIDLA</title>
        <meta name="description" content="Free unit converter. Convert length, weight, temperature, speed, area and volume instantly. Metric and imperial units. Fast, accurate, mobile-friendly." />
        <meta name="keywords" content="unit converter, length converter, weight converter, temperature converter, km to miles, kg to lbs, Celsius to Fahrenheit, AIDLA unit tool" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/utility/unit-converter" />
        <meta property="og:title" content="Unit Converter | AIDLA" />
        <meta property="og:description" content="Convert length, weight, temperature, speed and more instantly." />
        <meta property="og:url" content="https://www.aidla.online/tools/utility/unit-converter" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Unit Converter by AIDLA","url":"https://www.aidla.online/tools/utility/unit-converter",
          "description":"Free unit converter — length, weight, temperature, speed, area and volume.",
          "applicationCategory":"UtilitiesApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .uc-root*{box-sizing:border-box;margin:0;padding:0}
        .uc-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .uc-wrap{max-width:580px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .uc-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .uc-crumb a{color:#94a3b8;text-decoration:none}.uc-crumb a:hover{color:#1a3a8f}
        .uc-hero{text-align:center;margin-bottom:24px}
        .uc-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#1a3a8f,#3b82f6);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(26,58,143,.25)}
        .uc-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .uc-accent{background:linear-gradient(135deg,#1a3a8f,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .uc-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:420px;margin:0 auto}
        .uc-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .uc-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        /* Category tabs */
        .uc-cats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:4px}
        .uc-cat-btn{padding:9px 6px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;font-size:11px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;text-align:center;display:flex;flex-direction:column;align-items:center;gap:3px}
        .uc-cat-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .uc-cat-icon{font-size:16px}
        /* Converter */
        .uc-converter{display:flex;flex-direction:column;gap:10px}
        .uc-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .uc-input{width:100%;padding:12px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:16px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;-webkit-appearance:none}
        .uc-input:focus{border-color:rgba(26,58,143,.4);box-shadow:0 0 0 3px rgba(26,58,143,.07)}
        .uc-input::placeholder{color:#94a3b8;font-weight:500;font-size:13px}
        .uc-select{width:100%;padding:11px 32px 11px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:14px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;cursor:pointer;-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}
        .uc-select:focus{border-color:rgba(26,58,143,.4)}
        /* Swap btn */
        .uc-swap-row{display:flex;justify-content:center;margin:4px 0}
        .uc-swap-btn{width:36px;height:36px;border-radius:50%;border:1.5px solid #e2e8f0;background:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;box-shadow:0 2px 8px rgba(11,20,55,.06)}
        .uc-swap-btn:hover{background:#f0f4ff;border-color:rgba(26,58,143,.3)}
        /* Result */
        .uc-result{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:16px;padding:20px;text-align:center;margin-top:8px}
        .uc-result-eq{font-size:12px;color:rgba(255,255,255,.55);margin-bottom:6px}
        .uc-result-val{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;color:#fff;line-height:1;word-break:break-all}
        .uc-result-unit{font-size:13px;font-weight:700;color:rgba(255,255,255,.7);margin-top:4px}
        /* All conversions */
        .uc-all-list{display:flex;flex-direction:column;gap:0}
        .uc-all-row{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:13px}
        .uc-all-row:last-child{border-bottom:none}
        .uc-all-unit{color:#64748b;font-weight:600}
        .uc-all-val{font-weight:800;color:#0b1437;text-align:right}
        .uc-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .uc-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .uc-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .uc-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.uc-cats{grid-template-columns:repeat(3,1fr)}.uc-cta{flex-direction:column;text-align:center}.uc-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="uc-root">
        <div className="uc-wrap">
          <nav className="uc-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Unit Converter</span></nav>

          <motion.div className="uc-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="uc-badge">📏 Utility Tool</div>
            <h1 className="uc-h1"><span className="uc-accent">Unit</span> Converter</h1>
            <p className="uc-sub">Convert length, weight, temperature, speed, area and volume — metric & imperial.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            {/* Category */}
            <div className="uc-card">
              <span className="uc-sec">Category</span>
              <div className="uc-cats">
                {Object.entries(CATEGORIES).map(([key,c])=>(
                  <button key={key} className={`uc-cat-btn${category===key?" active":""}`} onClick={()=>handleCategoryChange(key)}>
                    <span className="uc-cat-icon">{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Converter */}
            <AnimatePresence mode="wait">
              <motion.div key={category} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.18}}>
                <div className="uc-card">
                  <span className="uc-sec">Convert</span>
                  <div className="uc-converter">
                    <div>
                      <label className="uc-label">Value</label>
                      <input className="uc-input" type="number" inputMode="decimal" placeholder="Enter value" value={value} onChange={e=>setValue(e.target.value)} />
                    </div>
                    <div>
                      <label className="uc-label">From</label>
                      <select className="uc-select" value={fromUnit} onChange={e=>setFromUnit(e.target.value)}>
                        {unitKeys.map(k=><option key={k} value={k}>{cat.units[k].label}</option>)}
                      </select>
                    </div>
                    <div className="uc-swap-row">
                      <button className="uc-swap-btn" onClick={swap} aria-label="Swap units">⇅</button>
                    </div>
                    <div>
                      <label className="uc-label">To</label>
                      <select className="uc-select" value={toUnit} onChange={e=>setToUnit(e.target.value)}>
                        {unitKeys.map(k=><option key={k} value={k}>{cat.units[k].label}</option>)}
                      </select>
                    </div>
                  </div>

                  {result !== null && (
                    <motion.div className="uc-result" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:.2}}>
                      <div className="uc-result-eq">{value} {cat.units[fromUnit].label} =</div>
                      <div className="uc-result-val">{result}</div>
                      <div className="uc-result-unit">{cat.units[toUnit].label}</div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* All conversions */}
            {allConversions.length > 0 && (
              <div className="uc-card">
                <span className="uc-sec">All {cat.label} Conversions for {value} {cat.units[fromUnit].label}</span>
                <div className="uc-all-list">
                  {allConversions.map(r=>(
                    <div key={r.unit} className="uc-all-row">
                      <span className="uc-all-unit">{r.unit}</span>
                      <span className="uc-all-val">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="uc-cta">
              <div><h3>More Utility Tools 🚀</h3><p>Password generator, Countdown timer and more.</p></div>
              <Link to="/tools" className="uc-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}