import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

/* ── helpers ── */
function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? { r: parseInt(r[1],16), g: parseInt(r[2],16), b: parseInt(r[3],16) } : null;
}
function rgbToHsl(r,g,b) {
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h,s,l=(max+min)/2;
  if(max===min){h=s=0;}
  else{const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;default:h=((r-g)/d+4)/6;}}
  return {h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)};
}
function hexToHsl(hex){const rgb=hexToRgb(hex);return rgb?rgbToHsl(rgb.r,rgb.g,rgb.b):null;}
function rgbToHex(r,g,b){return "#"+[r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("").toUpperCase();}
function getContrastColor(hex){const rgb=hexToRgb(hex);if(!rgb)return"#000";const l=(0.299*rgb.r+0.587*rgb.g+0.114*rgb.b)/255;return l>0.5?"#0b1437":"#ffffff";}

const PRESETS = [
  "#FF6B6B","#FF8E53","#FFC300","#2ECC71","#1ABC9C","#3498DB","#9B59B6","#E91E63",
  "#F39C12","#27AE60","#2980B9","#8E44AD","#E74C3C","#16A085","#0b1437","#1a3a8f",
];

function useCopy(){
  const [copied,setCopied]=useState("");
  const copy=async(text,id)=>{try{await navigator.clipboard.writeText(text);}catch{}setCopied(id);setTimeout(()=>setCopied(""),2000);};
  return{copied,copy};
}

export default function ColorPicker() {
  const [color, setColor] = useState("#1a3a8f");
  const { copied, copy }  = useCopy();

  const rgb  = hexToRgb(color);
  const hsl  = hexToHsl(color);
  const contrast = getContrastColor(color);
  const hex6 = color.toUpperCase().replace(/^#/,"");

  // generate shades
  const shades = hsl ? Array.from({length:9},(_,i)=>{
    const l = 10 + i*10;
    return `hsl(${hsl.h},${hsl.s}%,${l}%)`;
  }) : [];

  return (
    <>
      <Helmet>
        <title>Color Picker — HEX, RGB, HSL Color Values | AIDLA</title>
        <meta name="description" content="Free color picker tool. Pick any color and instantly get HEX, RGB and HSL values. Includes color shades, contrast checker and preset colors. Free, no sign-up." />
        <meta name="keywords" content="color picker, hex color picker, RGB color, HSL color, color code generator, color values, web color picker, AIDLA color tool" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/utility/color-picker" />
        <meta property="og:title" content="Color Picker | AIDLA" />
        <meta property="og:description" content="Pick any color and get HEX, RGB and HSL values instantly." />
        <meta property="og:url" content="https://www.aidla.online/tools/utility/color-picker" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Color Picker by AIDLA","url":"https://www.aidla.online/tools/utility/color-picker",
          "description":"Free color picker — HEX, RGB, HSL values with shades.",
          "applicationCategory":"UtilitiesApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .cp-root*{box-sizing:border-box;margin:0;padding:0}
        .cp-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .cp-wrap{max-width:520px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .cp-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .cp-crumb a{color:#94a3b8;text-decoration:none}.cp-crumb a:hover{color:#1a3a8f}
        .cp-hero{text-align:center;margin-bottom:24px}
        .cp-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#ec4899,#8b5cf6);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(236,72,153,.25)}
        .cp-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .cp-accent{background:linear-gradient(135deg,#ec4899,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .cp-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:400px;margin:0 auto}
        .cp-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .cp-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        /* Color preview */
        .cp-preview{width:100%;height:140px;border-radius:16px;margin-bottom:16px;display:flex;align-items:center;justify-content:center;transition:background .15s;position:relative;overflow:hidden}
        .cp-preview-hex{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;letter-spacing:.08em}
        /* Native color input */
        .cp-picker-wrap{display:flex;align-items:center;gap:12px;margin-bottom:16px}
        .cp-native{width:56px;height:44px;border-radius:10px;border:2px solid #e2e8f0;cursor:pointer;padding:2px;background:none;-webkit-appearance:none;appearance:none;overflow:hidden}
        .cp-native::-webkit-color-swatch-wrapper{padding:0}
        .cp-native::-webkit-color-swatch{border:none;border-radius:7px}
        .cp-hex-input{flex:1;padding:11px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:16px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'Courier New',monospace;transition:border-color .15s;letter-spacing:.06em;-webkit-appearance:none}
        .cp-hex-input:focus{border-color:rgba(236,72,153,.4);box-shadow:0 0 0 3px rgba(236,72,153,.07)}
        /* Value rows */
        .cp-values{display:flex;flex-direction:column;gap:8px}
        .cp-val-row{display:flex;align-items:center;gap:10px;padding:11px 14px;background:#f8faff;border-radius:12px;border:1px solid rgba(59,130,246,.08)}
        .cp-val-label{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;width:36px;flex-shrink:0}
        .cp-val-text{flex:1;font-family:'Courier New',monospace;font-size:14px;font-weight:700;color:#0b1437;word-break:break-all}
        .cp-copy-btn{padding:4px 10px;border-radius:6px;border:1px solid #e2e8f0;background:#fff;font-size:10px;font-weight:700;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;white-space:nowrap;flex-shrink:0}
        .cp-copy-btn:hover{background:#f0f4ff;color:#1a3a8f}
        .cp-copy-btn.copied{background:rgba(5,150,105,.08);border-color:rgba(5,150,105,.2);color:#059669}
        /* Presets */
        .cp-presets{display:grid;grid-template-columns:repeat(8,1fr);gap:7px}
        .cp-preset{aspect-ratio:1;border-radius:8px;cursor:pointer;border:2px solid transparent;transition:all .13s}
        .cp-preset:hover{transform:scale(1.12);border-color:#0b1437}
        .cp-preset.selected{border-color:#0b1437;transform:scale(1.12)}
        /* Shades */
        .cp-shades{display:grid;grid-template-columns:repeat(9,1fr);gap:5px}
        .cp-shade{aspect-ratio:1;border-radius:6px;cursor:pointer;transition:all .13s;border:1.5px solid transparent}
        .cp-shade:hover{transform:scale(1.1)}
        /* Contrast */
        .cp-contrast{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .cp-contrast-box{padding:14px;border-radius:12px;text-align:center}
        .cp-contrast-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
        .cp-contrast-val{font-size:15px;font-weight:900}
        .cp-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .cp-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .cp-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .cp-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.cp-presets{grid-template-columns:repeat(8,1fr)}.cp-cta{flex-direction:column;text-align:center}.cp-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="cp-root">
        <div className="cp-wrap">
          <nav className="cp-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Color Picker</span></nav>

          <motion.div className="cp-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="cp-badge">🎨 Design Tool</div>
            <h1 className="cp-h1"><span className="cp-accent">Color</span> Picker</h1>
            <p className="cp-sub">Pick any color and instantly get HEX, RGB and HSL values with shades.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            {/* Preview */}
            <div className="cp-preview" style={{background:color}}>
              <span className="cp-preview-hex" style={{color:contrast}}>{color.toUpperCase()}</span>
            </div>

            <div className="cp-card">
              <span className="cp-sec">Pick Color</span>
              <div className="cp-picker-wrap">
                <input className="cp-native" type="color" value={color} onChange={e=>setColor(e.target.value)} aria-label="Color picker" />
                <input className="cp-hex-input" type="text" value={color.toUpperCase()}
                  onChange={e=>{const v=e.target.value;if(/^#[0-9a-fA-F]{0,6}$/.test(v)){setColor(v);}}}
                  placeholder="#1A3A8F" maxLength={7} spellCheck="false" aria-label="HEX color value" />
              </div>

              <span className="cp-sec">Color Values</span>
              <div className="cp-values">
                {[
                  {id:"hex",label:"HEX",val:`#${hex6}`},
                  {id:"rgb",label:"RGB",val:rgb?`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`:"—"},
                  {id:"hsl",label:"HSL",val:hsl?`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`:"—"},
                  {id:"css",label:"CSS",val:rgb?`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`:"—"},
                ].map(v=>(
                  <div key={v.id} className="cp-val-row">
                    <span className="cp-val-label">{v.label}</span>
                    <span className="cp-val-text">{v.val}</span>
                    <button className={`cp-copy-btn${copied===v.id?" copied":""}`} onClick={()=>copy(v.val,v.id)}>
                      {copied===v.id?"✅":"📋"} Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Presets */}
            <div className="cp-card">
              <span className="cp-sec">Preset Colors</span>
              <div className="cp-presets">
                {PRESETS.map(p=>(
                  <div key={p} className={`cp-preset${color.toLowerCase()===p.toLowerCase()?" selected":""}`}
                    style={{background:p}} onClick={()=>setColor(p)} title={p} aria-label={p}/>
                ))}
              </div>
            </div>

            {/* Shades */}
            {hsl && (
              <div className="cp-card">
                <span className="cp-sec">Color Shades</span>
                <div className="cp-shades">
                  {shades.map((s,i)=>(
                    <div key={i} className="cp-shade" style={{background:s}} title={s}
                      onClick={()=>{
                        const l=10+i*10;
                        const r2=Math.round(255*(l/100));
                        setColor(rgbToHex(r2,r2,r2));
                      }} />
                  ))}
                </div>
              </div>
            )}

            {/* Contrast */}
            {rgb && (
              <div className="cp-card">
                <span className="cp-sec">Text Contrast on This Color</span>
                <div className="cp-contrast">
                  <div className="cp-contrast-box" style={{background:color}}>
                    <div className="cp-contrast-label" style={{color:contrast}}>Text on Color</div>
                    <div className="cp-contrast-val" style={{color:contrast}}>Sample Text</div>
                  </div>
                  <div className="cp-contrast-box" style={{background:"#fff",border:"1px solid #f1f5f9"}}>
                    <div className="cp-contrast-label" style={{color:color}}>Color on White</div>
                    <div className="cp-contrast-val" style={{color:color}}>Sample Text</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="cp-cta">
              <div><h3>More Utility Tools 🚀</h3><p>Text case converter, Unit converter and more.</p></div>
              <Link to="/tools" className="cp-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}