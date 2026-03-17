import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "../../components/footer";

function calcAge(dob) {
  const birth = new Date(dob);
  const now   = new Date();
  if (birth > now) return null;

  let years  = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth()    - birth.getMonth();
  let days   = now.getDate()     - birth.getDate();

  if (days < 0) {
    months--;
    const prev = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prev.getDate();
  }
  if (months < 0) { years--; months += 12; }

  const totalDays   = Math.floor((now - birth) / 86400000);
  const totalWeeks  = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours  = totalDays * 24;

  const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday < now) nextBday.setFullYear(now.getFullYear() + 1);
  const daysToNext = Math.ceil((nextBday - now) / 86400000);

  const zodiac = getZodiac(birth.getMonth()+1, birth.getDate());
  const dayName = birth.toLocaleDateString("en-PK",{ weekday:"long" });

  return { years, months, days, totalDays, totalWeeks, totalMonths, totalHours, daysToNext, zodiac, dayName, nextBday };
}

function getZodiac(month, day) {
  if ((month===3&&day>=21)||(month===4&&day<=19)) return { sign:"♈ Aries",      color:"#dc2626" };
  if ((month===4&&day>=20)||(month===5&&day<=20)) return { sign:"♉ Taurus",     color:"#16a34a" };
  if ((month===5&&day>=21)||(month===6&&day<=20)) return { sign:"♊ Gemini",     color:"#d97706" };
  if ((month===6&&day>=21)||(month===7&&day<=22)) return { sign:"♋ Cancer",     color:"#0284c7" };
  if ((month===7&&day>=23)||(month===8&&day<=22)) return { sign:"♌ Leo",        color:"#f59e0b" };
  if ((month===8&&day>=23)||(month===9&&day<=22)) return { sign:"♍ Virgo",      color:"#16a34a" };
  if ((month===9&&day>=23)||(month===10&&day<=22))return { sign:"♎ Libra",      color:"#7c3aed" };
  if ((month===10&&day>=23)||(month===11&&day<=21))return{ sign:"♏ Scorpio",    color:"#dc2626" };
  if ((month===11&&day>=22)||(month===12&&day<=21))return{ sign:"♐ Sagittarius",color:"#0284c7" };
  if ((month===12&&day>=22)||(month===1&&day<=19)) return { sign:"♑ Capricorn",  color:"#334155" };
  if ((month===1&&day>=20)||(month===2&&day<=18))  return { sign:"♒ Aquarius",   color:"#0284c7" };
  return { sign:"♓ Pisces", color:"#7c3aed" };
}

export default function AgeCalculator() {
  const [dob,    setDob]    = useState("");
  const [result, setResult] = useState(null);
  const [error,  setError]  = useState("");

  const calculate = () => {
    setError("");
    if (!dob) { setError("Please select your date of birth."); return; }
    const r = calcAge(dob);
    if (!r) { setError("Date of birth cannot be in the future."); return; }
    setResult(r);
  };

  const S = {
    page:  { minHeight:"100vh", background:"#f8fafc", fontFamily:"'DM Sans',sans-serif", overflowX:"hidden" },
    wrap:  { maxWidth:720, margin:"0 auto", padding:"clamp(16px,4vw,32px) clamp(14px,4vw,24px) 60px", width:"100%" },
    card:  { background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(16px,4vw,22px)", marginBottom:14, boxShadow:"0 1px 4px rgba(0,0,0,.04)" },
    label: { fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:8 },
    input: { width:"100%", padding:"12px 14px", border:"1px solid #e2e8f0", borderRadius:10, fontSize:16, color:"#0f172a", outline:"none", boxSizing:"border-box" },
    btn:   { width:"100%", padding:"13px 0", background:"linear-gradient(135deg,#1a3a8f,#3b82f6)", color:"#fff", border:"none", borderRadius:12, fontWeight:800, fontSize:15, cursor:"pointer" },
    stat:  (color) => ({ background:`${color}08`, border:`1px solid ${color}20`, borderRadius:14, padding:"14px 16px", textAlign:"center" }),
  };

  return (
    <>
      <Helmet>
        <title>Age Calculator — Calculate Exact Age in Years, Months & Days | AIDLA</title>
        <meta name="description" content="Calculate your exact age in years, months, days, weeks and hours. Find days until next birthday, zodiac sign and more. Free online age calculator." />
        <meta name="keywords" content="age calculator, calculate age, exact age calculator, date of birth calculator, how old am I, age in days weeks months" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.aidla.online/tools/utility/age-calculator" />
      </Helmet>
      <style>{`* { box-sizing: border-box; }`}</style>

      <div style={S.page}>
        <div style={{ background:"#fff", borderBottom:"1px solid #f1f5f9", padding:"10px clamp(14px,4vw,24px)" }}>
          <div style={{ maxWidth:720, margin:"0 auto", fontSize:"clamp(10px,2.5vw,12px)", color:"#94a3b8", display:"flex", gap:6, flexWrap:"wrap" }}>
            <Link to="/tools" style={{ color:"#64748b", textDecoration:"none", fontWeight:600 }}>Tools</Link><span>›</span>
            <span style={{ color:"#0f172a", fontWeight:600 }}>Age Calculator</span>
          </div>
        </div>

        <div style={{ background:"linear-gradient(135deg,#0b1437,#1a3a8f)", padding:"clamp(24px,5vw,40px) clamp(14px,4vw,24px)", textAlign:"center" }}>
          <div style={{ fontSize:"clamp(28px,7vw,40px)", marginBottom:10 }}>🎂</div>
          <h1 style={{ margin:"0 0 8px", fontSize:"clamp(1.4rem,5vw,2rem)", fontWeight:900, color:"#fff" }}>Age Calculator</h1>
          <p style={{ margin:0, fontSize:"clamp(12px,3vw,15px)", color:"rgba(255,255,255,0.72)" }}>Calculate your exact age in years, months, days, weeks and more</p>
        </div>

        <div style={S.wrap}>
          {/* Input */}
          <div style={S.card}>
            <span style={S.label}>Date of Birth</span>
            <input type="date" style={S.input} value={dob} onChange={e=>setDob(e.target.value)}
              max={new Date().toISOString().split("T")[0]}/>
            {error && <div style={{ marginTop:10, fontSize:13, color:"#dc2626", background:"rgba(239,68,68,.06)", border:"1px solid rgba(239,68,68,.2)", borderRadius:8, padding:"8px 12px" }}>{error}</div>}
            <button style={{ ...S.btn, marginTop:14 }} onClick={calculate}>🎂 Calculate My Age</button>
          </div>

          {/* Results */}
          {result && (
            <>
              {/* Main age */}
              <div style={{ ...S.card, textAlign:"center", background:"linear-gradient(135deg,#0b1437,#1a3a8f)", border:"none" }}>
                <div style={{ fontSize:"clamp(11px,3vw,13px)", fontWeight:700, color:"rgba(255,255,255,0.6)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>Your Exact Age</div>
                <div style={{ display:"flex", justifyContent:"center", gap:"clamp(16px,5vw,32px)", flexWrap:"wrap" }}>
                  {[
                    { value:result.years,  label:"Years"  },
                    { value:result.months, label:"Months" },
                    { value:result.days,   label:"Days"   },
                  ].map(u => (
                    <div key={u.label}>
                      <div style={{ fontSize:"clamp(2.5rem,12vw,4rem)", fontWeight:900, color:"#fff", lineHeight:1 }}>{u.value}</div>
                      <div style={{ fontSize:"clamp(11px,3vw,14px)", color:"rgba(255,255,255,0.65)", marginTop:4 }}>{u.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:14 }}>
                {[
                  { label:"Total Days",    value:result.totalDays.toLocaleString(),   color:"#1a3a8f" },
                  { label:"Total Weeks",   value:result.totalWeeks.toLocaleString(),  color:"#7c3aed" },
                  { label:"Total Months",  value:result.totalMonths.toLocaleString(), color:"#dc2626" },
                  { label:"Total Hours",   value:result.totalHours.toLocaleString(),  color:"#d97706" },
                ].map(s => (
                  <div key={s.label} style={S.stat(s.color)}>
                    <div style={{ fontSize:"clamp(18px,5vw,24px)", fontWeight:900, color:s.color }}>{s.value}</div>
                    <div style={{ fontSize:"clamp(10px,2.5vw,12px)", color:"#64748b", fontWeight:600, marginTop:2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Birthday + Zodiac */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:10 }}>
                <div style={{ ...S.card, marginBottom:0, textAlign:"center" }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>🎉</div>
                  <div style={{ fontSize:"clamp(11px,2.5vw,12px)", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", marginBottom:4 }}>Next Birthday</div>
                  <div style={{ fontSize:"clamp(14px,3.5vw,16px)", fontWeight:800, color:"#0b1437" }}>
                    {result.nextBday.toLocaleDateString("en-PK",{day:"numeric",month:"long",year:"numeric"})}
                  </div>
                  <div style={{ fontSize:"clamp(12px,3vw,14px)", color:"#1a3a8f", fontWeight:700, marginTop:4 }}>
                    in {result.daysToNext} day{result.daysToNext!==1?"s":""}
                  </div>
                </div>
                <div style={{ ...S.card, marginBottom:0, textAlign:"center" }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>{result.zodiac.sign.split(" ")[0]}</div>
                  <div style={{ fontSize:"clamp(11px,2.5vw,12px)", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", marginBottom:4 }}>Zodiac Sign</div>
                  <div style={{ fontSize:"clamp(14px,3.5vw,16px)", fontWeight:800, color:result.zodiac.color }}>{result.zodiac.sign}</div>
                </div>
                <div style={{ ...S.card, marginBottom:0, textAlign:"center" }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>📅</div>
                  <div style={{ fontSize:"clamp(11px,2.5vw,12px)", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", marginBottom:4 }}>Born On</div>
                  <div style={{ fontSize:"clamp(14px,3.5vw,16px)", fontWeight:800, color:"#0b1437" }}>{result.dayName}</div>
                </div>
              </div>
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}