import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{a as t,l as n,o as r}from"./vendor-helmet-D-cMCI9i.js";import{tr as i}from"./vendor-misc-DjQaoctO.js";import{n as a,u as o}from"./vendor-router-BeHthcJc.js";import"./vendor-supabase-DTLzbyhy.js";import{t as s}from"./supabase-CXCPPx9q.js";import{r as c}from"./vendor-motion-DyarDpDD.js";var l=e(n(),1),u=c();r();var d={blue:`#0056D2`,blueDark:`#003A8C`,ink:`#1A1A2E`,slate:`#475569`,muted:`#94A3B8`,border:`#E8EDF5`,bg:`#F7F9FC`,white:`#FFFFFF`,amber:`#F5A623`,success:`#12B76A`},f=`
<svg viewBox="0 0 90 90" width="90" height="90" xmlns="http://www.w3.org/2000/svg" style="display:block;">
  <defs>
    <radialGradient id="sg" cx="38%" cy="36%" r="65%">
      <stop offset="0%"   stop-color="#FFD85C"/>
      <stop offset="55%"  stop-color="#F5A623"/>
      <stop offset="100%" stop-color="#D4860A"/>
    </radialGradient>
  </defs>
  <circle cx="45" cy="46" r="43" fill="rgba(0,0,0,0.08)"/>
  <circle cx="45" cy="45" r="43" fill="url(#sg)"/>
  <circle cx="45" cy="45" r="43" fill="none" stroke="white"   stroke-width="3"   opacity="0.85"/>
  <circle cx="45" cy="45" r="40" fill="none" stroke="#D4860A" stroke-width="1"/>
  <circle cx="45" cy="45" r="33" fill="none" stroke="#78350F" stroke-width="1"   stroke-dasharray="3 2.5" opacity="0.4"/>
  <text x="45" y="37" text-anchor="middle" font-family="Arial,sans-serif" font-size="8"  font-weight="900" fill="#78350F" letter-spacing="1.5">AIDLA</text>
  <text x="45" y="50" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="900" fill="#78350F">&#10003;</text>
  <text x="45" y="61" text-anchor="middle" font-family="Arial,sans-serif" font-size="7"  font-weight="900" fill="#78350F" letter-spacing="2">CERT</text>
  <circle cx="45" cy="4"  r="2.2" fill="#D4860A"/>
  <circle cx="45" cy="86" r="2.2" fill="#D4860A"/>
  <circle cx="4"  cy="45" r="2.2" fill="#D4860A"/>
  <circle cx="86" cy="45" r="2.2" fill="#D4860A"/>
</svg>`;function p({studentName:e,courseTitle:t,courseLevel:n,courseCategory:r,issued:i,certNumber:a,verifyUrl:o}){let s=`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(o)}&bgcolor=FFFEF9&color=003A8C&margin=4`;return`
<div style="width:100%;height:100%;background:#FFFEF9;position:relative;overflow:hidden;font-family:'Plus Jakarta Sans',sans-serif;">
  <div style="position:absolute;inset:0;z-index:0;opacity:0.06;display:flex;flex-wrap:wrap;align-content:flex-start;overflow:hidden;transform:rotate(-30deg) scale(1.6);transform-origin:center center;">
    ${Array(80).fill(`<span style="font-weight:900;font-size:28px;color:#003A8C;letter-spacing:4px;padding:18px 22px;white-space:nowrap;display:inline-block;">AIDLA</span>`).join(``)}
  </div>
  <div style="position:absolute;inset:0;border:28px solid #003A8C;pointer-events:none;z-index:1;"></div>
  <div style="position:absolute;inset:32px;border:1.5px solid #F5A623;pointer-events:none;z-index:1;"></div>
  <div style="position:absolute;top:40px;left:40px;width:56px;height:56px;border-top:2.5px solid #F5A623;border-left:2.5px solid #F5A623;z-index:2;"></div>
  <div style="position:absolute;top:40px;right:40px;width:56px;height:56px;border-top:2.5px solid #F5A623;border-right:2.5px solid #F5A623;z-index:2;"></div>
  <div style="position:absolute;bottom:40px;left:40px;width:56px;height:56px;border-bottom:2.5px solid #F5A623;border-left:2.5px solid #F5A623;z-index:2;"></div>
  <div style="position:absolute;bottom:40px;right:40px;width:56px;height:56px;border-bottom:2.5px solid #F5A623;border-right:2.5px solid #F5A623;z-index:2;"></div>
  <div style="position:absolute;top:52px;left:56px;z-index:4;">
    <div style="width:82px;height:82px;border-radius:50%;background:white;border:2.5px solid #F5A623;box-shadow:0 0 0 4px rgba(245,166,35,0.18),0 4px 14px rgba(0,58,140,0.14);display:flex;align-items:center;justify-content:center;overflow:hidden;">
      <img src="/logo.png" alt="AIDLA" style="width:64px;height:64px;object-fit:contain;display:block;">
    </div>
  </div>
  <div style="position:absolute;top:52px;left:0;right:0;display:flex;flex-direction:column;align-items:center;z-index:4;">
    <div style="font-weight:900;font-size:28px;letter-spacing:6px;color:#003A8C;text-transform:uppercase;line-height:1.1;margin-bottom:4px;">AIDLA</div>
    <div style="font-size:9px;color:#94A3B8;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;text-align:center;">Artificial Intelligence Digital Learning Academy</div>
  </div>
  <div style="position:relative;z-index:3;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:130px 130px 96px;">
    <div style="font-size:10px;letter-spacing:4px;text-transform:uppercase;font-weight:700;color:#94A3B8;margin-bottom:10px;">Certificate of Completion</div>
    <div style="font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:54px;color:#003A8C;line-height:1;margin-bottom:20px;">Verified Achievement</div>
    <div style="display:flex;align-items:center;gap:14px;width:100%;max-width:300px;margin-bottom:18px;">
      <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,#F5A623,transparent);"></div>
      <div style="width:8px;height:8px;background:#F5A623;transform:rotate(45deg);flex-shrink:0;"></div>
      <div style="flex:1;height:1px;background:linear-gradient(90deg,#F5A623,transparent);"></div>
    </div>
    <div style="font-size:13px;color:#475569;margin-bottom:10px;">This is to proudly certify that</div>
    <div style="font-family:'Instrument Serif',Georgia,serif;font-size:44px;color:#1A1A2E;line-height:1.1;border-bottom:1.5px solid #E8EDF5;padding-bottom:12px;margin-bottom:12px;min-width:50%;">${e}</div>
    <div style="font-size:10px;color:#94A3B8;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">has successfully completed all requirements for</div>
    <div style="font-family:'Instrument Serif',Georgia,serif;font-size:24px;color:#0056D2;line-height:1.3;margin-bottom:${n||r?`12px`:`24px`};">${t}</div>
    ${n||r?`
    <div style="display:flex;align-items:center;gap:10px;font-size:9px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:22px;">
      ${n?`<span>${n}</span>`:``}
      ${n&&r?`<div style="width:3px;height:3px;border-radius:50%;background:#E8EDF5;"></div>`:``}
      ${r?`<span>${r}</span>`:``}
    </div>`:``}
    <div style="display:flex;align-items:flex-end;justify-content:space-between;width:100%;gap:20px;margin-top:auto;">
      <div style="display:flex;flex-direction:column;align-items:center;flex:1;">
        <div style="font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:22px;color:#003A8C;border-bottom:1.5px solid #CBD5E1;padding-bottom:4px;min-width:160px;text-align:center;margin-bottom:5px;">AIDLA Director</div>
        <div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#94A3B8;">Program Director</div>
      </div>
      <div style="width:90px;height:90px;flex-shrink:0;">${f}</div>
      <div style="display:flex;flex-direction:column;align-items:center;flex:1;">
        <div style="font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:22px;color:#003A8C;border-bottom:1.5px solid #CBD5E1;padding-bottom:4px;min-width:160px;text-align:center;margin-bottom:5px;">${i}</div>
        <div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#94A3B8;">Date of Issue</div>
      </div>
    </div>
  </div>
  <div style="position:absolute;bottom:52px;right:76px;z-index:4;display:flex;flex-direction:column;align-items:center;gap:5px;">
    <img src="${s}" width="86" height="86" alt="QR" style="border-radius:4px;display:block;">
    <div style="font-size:7px;color:#94A3B8;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Scan to verify</div>
  </div>
  <div style="position:absolute;bottom:52px;left:76px;font-size:8px;color:#94A3B8;font-family:monospace;line-height:1.9;z-index:3;">
    Certificate No: ${a}<br>Verify: ${o}
  </div>
</div>`}function m({studentName:e,courseTitle:t,verifyUrl:n,platform:r}){if(r===`twitter`)return`🎉 Just earned my verified certificate in "${t}" from @AIDLA! 🏆🚀\n\nSo proud of this milestone!\n${n}\n\n#AIDLA #AI #Certificate #Achievement`;if(r===`whatsapp`)return`🎉 I just earned a verified certificate in *"${t}"* from *AIDLA*! 🏆\n\nVerify it here: ${n}`;let i=[`🎉 Thrilled to share that I've officially completed "${t}" at AIDLA — Artificial Intelligence Digital Learning Academy! 🚀\n\nThis has been an incredible learning journey and I'm so proud to earn this verified certificate.\n\n💡 Ready to put this into action!\n\n🔗 Verify: ${n}\n\n#AIDLA #AILearning #CertificateOfCompletion #ArtificialIntelligence #DigitalSkills`,`🏆 Big milestone unlocked! I just completed "${t}" on AIDLA and earned my verified certificate! 🎓✨\n\nIf you want to level up your AI skills, AIDLA is the place to be!\n\n🔗 Verify: ${n}\n\n#AIDLA #AI #Achievement #Certificate #GrowthMindset`,`📜 Excited to announce I've earned my certificate in "${t}" from AIDLA! 🌟\n\nEvery lesson, every challenge — 100% worth it. This is just the beginning! 💪\n\n✅ Verify: ${n}\n\n#AIDLA #AIEducation #CertifiedProfessional #NeverStopLearning`];return i[e.charCodeAt(0)%i.length]}var h=null;function g(){return h||(h=new Promise((e,t)=>{if(window.html2canvas)return e(window.html2canvas);let n=document.createElement(`script`);n.src=`https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js`,n.onload=()=>e(window.html2canvas),n.onerror=t,document.head.appendChild(n)})),h}var _=null;function v(){return _||(_=new Promise((e,t)=>{if(window.jspdf)return e(window.jspdf.jsPDF);let n=document.createElement(`script`);n.src=`https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`,n.onload=()=>e(window.jspdf.jsPDF),n.onerror=t,document.head.appendChild(n)})),_}function y(e){return b.apply(this,arguments)}function b(){return b=i(function*(e){let t=yield g(),n=document.createElement(`div`);n.style.cssText=`position:fixed;left:-9999px;top:-9999px;width:980px;height:693px;overflow:hidden;background:#FFFEF9;`,n.innerHTML=e,document.body.appendChild(n);let r=n.querySelectorAll(`img`);yield Promise.all(Array.from(r).map(e=>e.complete?Promise.resolve():new Promise(t=>{e.onload=t,e.onerror=t}))),yield new Promise(e=>setTimeout(e,350));let i=yield t(n,{width:980,height:693,scale:2,useCORS:!0,allowTaint:!0,backgroundColor:`#FFFEF9`,logging:!1});return document.body.removeChild(n),i}),b.apply(this,arguments)}function x(e,t){return S.apply(this,arguments)}function S(){return S=i(function*(e,t){try{yield s.from(`cert_share_events`).insert({certificate_id:e,platform:t,shared_at:new Date().toISOString()})}catch(e){}}),S.apply(this,arguments)}var C=[{id:`linkedin`,label:`LinkedIn`,bg:`#0077B5`,color:`#fff`,icon:(0,u.jsx)(`svg`,{viewBox:`0 0 24 24`,width:`13`,height:`13`,fill:`currentColor`,children:(0,u.jsx)(`path`,{d:`M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z`})})},{id:`twitter`,label:`Twitter / X`,bg:`#000`,color:`#fff`,icon:(0,u.jsx)(`svg`,{viewBox:`0 0 24 24`,width:`13`,height:`13`,fill:`currentColor`,children:(0,u.jsx)(`path`,{d:`M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z`})})},{id:`whatsapp`,label:`WhatsApp`,bg:`#25D366`,color:`#fff`,icon:(0,u.jsx)(`svg`,{viewBox:`0 0 24 24`,width:`13`,height:`13`,fill:`currentColor`,children:(0,u.jsx)(`path`,{d:`M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z`})})},{id:`facebook`,label:`Facebook`,bg:`#1877F2`,color:`#fff`,icon:(0,u.jsx)(`svg`,{viewBox:`0 0 24 24`,width:`13`,height:`13`,fill:`currentColor`,children:(0,u.jsx)(`path`,{d:`M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z`})})},{id:`instagram`,label:`Instagram`,bg:`linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)`,color:`#fff`,icon:(0,u.jsx)(`svg`,{viewBox:`0 0 24 24`,width:`13`,height:`13`,fill:`currentColor`,children:(0,u.jsx)(`path`,{d:`M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z`})})}];function w({cert:e,verifyUrl:n,certHTML:r,onClose:a}){let[o,s]=(0,l.useState)(``),[c,f]=(0,l.useState)(`linkedin`),[p,h]=(0,l.useState)(null),[g,_]=(0,l.useState)(!1),[v,b]=(0,l.useState)({});(0,l.useEffect)(()=>{s(m({studentName:e.student_name,courseTitle:e.course_title,verifyUrl:n,platform:c}))},[c]),(0,l.useEffect)(()=>{i(function*(){_(!0);try{h((yield y(r)).toDataURL(`image/png`))}catch(e){console.error(e)}_(!1)})()},[]);let S=()=>navigator.clipboard.writeText(o),w=function(){var r=i(function*(r){b(e=>t(t({},e),{},{[r]:`loading`})),yield x(e.id,r);let i=encodeURIComponent(n),a=encodeURIComponent(o),s=()=>{if(p){let t=document.createElement(`a`);t.href=p,t.download=`AIDLA-Certificate-${e.certificate_number}.png`,t.click()}};r===`linkedin`?(s(),yield new Promise(e=>setTimeout(e,700)),S(),window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${i}`,`_blank`)):r===`twitter`?window.open(`https://twitter.com/intent/tweet?text=${a}`,`_blank`):r===`whatsapp`?window.open(`https://wa.me/?text=${a}`,`_blank`):r===`facebook`?window.open(`https://www.facebook.com/sharer/sharer.php?u=${i}&quote=${a}`,`_blank`):r===`instagram`&&(s(),S(),window.open(`https://www.instagram.com/`,`_blank`)),b(e=>t(t({},e),{},{[r]:`done`})),setTimeout(()=>b(e=>t(t({},e),{},{[r]:void 0})),3e3)});return function(e){return r.apply(this,arguments)}}(),T=C.find(e=>e.id===c),E=v[c];return(0,u.jsx)(`div`,{style:{position:`fixed`,inset:0,zIndex:1e3,background:`rgba(26,26,46,0.72)`,backdropFilter:`blur(6px)`,display:`flex`,alignItems:`center`,justifyContent:`center`,padding:16},onClick:e=>e.target===e.currentTarget&&a(),children:(0,u.jsxs)(`div`,{style:{background:d.white,borderRadius:18,width:`100%`,maxWidth:600,boxShadow:`0 28px 72px rgba(0,0,0,0.22)`,overflow:`hidden`,maxHeight:`92vh`,display:`flex`,flexDirection:`column`},children:[(0,u.jsxs)(`div`,{style:{padding:`20px 24px 16px`,borderBottom:`1px solid ${d.border}`,display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`div`,{style:{fontWeight:800,fontSize:17,color:d.ink},children:`🎉 Share Your Achievement`}),(0,u.jsx)(`div`,{style:{fontSize:12,color:d.muted,marginTop:2},children:`Certificate image auto-downloads for image-based platforms`})]}),(0,u.jsx)(`button`,{onClick:a,style:{background:d.bg,border:`none`,borderRadius:8,width:34,height:34,cursor:`pointer`,fontSize:18,color:d.slate,display:`flex`,alignItems:`center`,justifyContent:`center`},children:`×`})]}),(0,u.jsxs)(`div`,{style:{padding:`20px 24px`,overflowY:`auto`,flex:1},children:[(0,u.jsxs)(`div`,{style:{width:`100%`,height:148,borderRadius:10,overflow:`hidden`,marginBottom:18,border:`1px solid ${d.border}`,background:`#FFFEF9`,display:`flex`,alignItems:`center`,justifyContent:`center`,position:`relative`},children:[g?(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:8},children:[(0,u.jsx)(`div`,{style:{width:24,height:24,border:`3px solid ${d.border}`,borderTopColor:d.blue,borderRadius:`50%`,animation:`spin .8s linear infinite`}}),(0,u.jsx)(`div`,{style:{fontSize:11,color:d.muted},children:`Rendering certificate…`})]}):p?(0,u.jsx)(`img`,{src:p,alt:`preview`,style:{width:`100%`,height:`100%`,objectFit:`cover`}}):(0,u.jsx)(`div`,{style:{fontSize:12,color:d.muted},children:`Preview unavailable`}),p&&(0,u.jsx)(`div`,{style:{position:`absolute`,top:6,right:6,background:`rgba(0,0,0,0.5)`,color:`#fff`,fontSize:9,fontWeight:700,borderRadius:4,padding:`2px 7px`,textTransform:`uppercase`,letterSpacing:1},children:`PNG ready`})]}),(0,u.jsxs)(`div`,{style:{marginBottom:14},children:[(0,u.jsx)(`div`,{style:{fontSize:10,fontWeight:700,color:d.muted,textTransform:`uppercase`,letterSpacing:1,marginBottom:8},children:`Select platform`}),(0,u.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`},children:C.map(e=>(0,u.jsxs)(`button`,{onClick:()=>f(e.id),style:{display:`flex`,alignItems:`center`,gap:6,padding:`6px 12px`,borderRadius:7,border:`none`,cursor:`pointer`,fontSize:11.5,fontWeight:700,background:c===e.id?e.bg:d.bg,backgroundImage:c===e.id&&e.bg.includes(`gradient`)?e.bg:void 0,color:c===e.id?e.color:d.slate,outline:c===e.id?`2px solid ${d.blue}`:`none`,outlineOffset:2,transition:`all .12s`},children:[e.icon,` `,e.label]},e.id))})]}),(c===`linkedin`||c===`instagram`)&&(0,u.jsxs)(`div`,{style:{background:c===`linkedin`?`#EFF6FF`:`#FDF4FF`,border:`1px solid ${c===`linkedin`?`#BFDBFE`:`#E9D5FF`}`,borderRadius:8,padding:`9px 13px`,marginBottom:14,fontSize:11.5,color:c===`linkedin`?`#1E40AF`:`#6B21A8`,lineHeight:1.6},children:[(0,u.jsx)(`strong`,{children:`How it works:`}),` `,c===`linkedin`?`PNG downloads + caption copied. LinkedIn will open — paste caption and attach the image. 🎯`:`PNG downloads + caption copied. Instagram will open — create a post and paste. 📸`]}),(0,u.jsxs)(`div`,{style:{marginBottom:18},children:[(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,marginBottom:7},children:[(0,u.jsx)(`div`,{style:{fontSize:10,fontWeight:700,color:d.muted,textTransform:`uppercase`,letterSpacing:1},children:`Caption (editable)`}),(0,u.jsx)(`button`,{onClick:S,style:{background:d.bg,border:`1px solid ${d.border}`,borderRadius:5,padding:`3px 9px`,fontSize:11,fontWeight:700,cursor:`pointer`,color:d.slate},children:`Copy`})]}),(0,u.jsx)(`textarea`,{value:o,onChange:e=>s(e.target.value),rows:6,style:{width:`100%`,border:`1.5px solid ${d.border}`,borderRadius:9,padding:`11px 13px`,fontSize:12.5,lineHeight:1.65,color:d.ink,resize:`vertical`,fontFamily:`inherit`,background:d.bg,outline:`none`},onFocus:e=>e.target.style.borderColor=d.blue,onBlur:e=>e.target.style.borderColor=d.border})]}),(0,u.jsx)(`button`,{onClick:()=>w(c),disabled:g,style:{width:`100%`,padding:`12px 20px`,borderRadius:9,border:`none`,cursor:g?`not-allowed`:`pointer`,fontWeight:800,fontSize:13.5,background:E===`done`?d.success:T.bg,backgroundImage:E!==`done`&&T.bg.includes(`gradient`)?T.bg:void 0,color:`#fff`,boxShadow:`0 4px 14px rgba(0,0,0,0.15)`,display:`flex`,alignItems:`center`,justifyContent:`center`,gap:8,opacity:g?.6:1,transition:`all .2s`},children:E===`loading`?(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`div`,{style:{width:15,height:15,border:`2.5px solid rgba(255,255,255,0.3)`,borderTopColor:`#fff`,borderRadius:`50%`,animation:`spin .8s linear infinite`}}),` Preparing…`]}):E===`done`?(0,u.jsxs)(u.Fragment,{children:[`✓ Shared on `,T.label,`!`]}):(0,u.jsxs)(u.Fragment,{children:[T.icon,` Share on `,T.label]})})]})]})})}function T(){let{certId:e}=o(),[n,r]=(0,l.useState)(null),[c,f]=(0,l.useState)(!0),[m,h]=(0,l.useState)(null),[g,_]=(0,l.useState)(!1),[b,x]=(0,l.useState)(!1),[S,C]=(0,l.useState)(null),T=(0,l.useRef)(null),[E,D]=(0,l.useState)(1);(0,l.useEffect)(()=>{O()},[e]),(0,l.useEffect)(()=>{if(!T.current)return;let e=new ResizeObserver(e=>{for(let t of e)D(t.contentRect.width/980)});return e.observe(T.current),()=>e.disconnect()},[n]);let O=function(){var n=i(function*(){try{let{data:a,error:o}=yield s.from(`course_certificates`).select(`*`).eq(`id`,e).single();if(o||!a)throw Error(`Certificate not found or has been revoked.`);let{data:c}=yield s.from(`course_courses`).select(`title,level,category`).eq(`id`,a.course_id).single(),{data:l}=yield s.from(`users_profiles`).select(`full_name`).eq(`user_id`,a.user_id).single(),u=(l==null?void 0:l.full_name)||``;if(!u){var n,i;let{data:{session:e}}=yield s.auth.getSession();u=(e==null||(n=e.user)==null||(n=n.user_metadata)==null?void 0:n.full_name)||(e==null||(i=e.user)==null||(i=i.email)==null?void 0:i.split(`@`)[0])||`A Dedicated Learner`}r(t(t({},a),{},{course_title:(c==null?void 0:c.title)||`—`,course_level:(c==null?void 0:c.level)||``,course_category:(c==null?void 0:c.category)||``,student_name:u}))}catch(e){h(e.message)}f(!1)});return function(){return n.apply(this,arguments)}}(),k=()=>{navigator.clipboard.writeText(`${window.location.origin}/verify/${e}`),_(!0),setTimeout(()=>_(!1),2500)},A=function(){var e=i(function*(){if(n){C(`png`);try{let e=yield y(F),t=document.createElement(`a`);t.href=e.toDataURL(`image/png`),t.download=`AIDLA-Certificate-${n.certificate_number}.png`,t.click()}catch(e){alert(`PNG export failed.`)}C(null)}});return function(){return e.apply(this,arguments)}}(),j=function(){var e=i(function*(){if(n){C(`pdf`);try{let[e,t]=yield Promise.all([y(F),v()]),r=new t({orientation:`landscape`,unit:`mm`,format:`a4`});r.addImage(e.toDataURL(`image/png`),`PNG`,0,0,297,210),r.save(`AIDLA-Certificate-${n.certificate_number}.pdf`)}catch(e){alert(`PDF export failed.`)}C(null)}});return function(){return e.apply(this,arguments)}}(),M=()=>{if(!n)return;let e=window.open(``,`_blank`);e.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>AIDLA Certificate</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>@page{size:A4 landscape;margin:0}*{box-sizing:border-box;margin:0;padding:0}html,body{width:100vw;height:100vh;background:#FFFEF9;overflow:hidden;display:flex;align-items:center;justify-content:center;-webkit-print-color-adjust:exact;print-color-adjust:exact}#pw{width:980px;height:693px;transform-origin:center;transform:scale(min(calc(100vw/980),calc(100vh/693)))}</style>
</head><body onload="setTimeout(()=>{window.print();window.close()},500)"><div id="pw">${p({studentName:n.student_name,courseTitle:n.course_title,courseLevel:n.course_level,courseCategory:n.course_category,issued:N,certNumber:n.certificate_number,verifyUrl:P})}</div></body></html>`),e.document.close()};if(c)return(0,u.jsxs)(`div`,{style:{display:`flex`,height:`100vh`,alignItems:`center`,justifyContent:`center`,flexDirection:`column`,gap:14,fontFamily:`system-ui`,background:d.bg},children:[(0,u.jsx)(`style`,{children:`@keyframes spin{to{transform:rotate(360deg)}}`}),(0,u.jsx)(`div`,{style:{width:38,height:38,border:`3px solid ${d.border}`,borderTopColor:d.blue,borderRadius:`50%`,animation:`spin .8s linear infinite`}}),(0,u.jsx)(`p`,{style:{color:d.muted,fontWeight:600,fontSize:14},children:`Verifying certificate…`})]});if(m)return(0,u.jsxs)(`div`,{style:{display:`flex`,height:`100vh`,alignItems:`center`,justifyContent:`center`,flexDirection:`column`,gap:12,fontFamily:`system-ui`,background:d.bg},children:[(0,u.jsx)(`div`,{style:{fontSize:48},children:`❌`}),(0,u.jsx)(`h2`,{style:{color:`#B91C1C`},children:`Invalid Certificate`}),(0,u.jsx)(`p`,{style:{color:d.muted},children:m}),(0,u.jsx)(a,{to:`/user/courses`,style:{background:d.blue,color:d.white,padding:`10px 22px`,borderRadius:8,textDecoration:`none`,fontWeight:700},children:`← Back to Courses`})]});let N=new Date(n.issued_at).toLocaleDateString(`en-US`,{year:`numeric`,month:`long`,day:`numeric`}),P=`${window.location.origin}/verify/${n.id}`,F=p({studentName:n.student_name,courseTitle:n.course_title,courseLevel:n.course_level,courseCategory:n.course_category,issued:N,certNumber:n.certificate_number,verifyUrl:P}),I=()=>(0,u.jsx)(`div`,{style:{width:10,height:10,border:`2px solid ${d.border}`,borderTopColor:d.blue,borderRadius:`50%`,animation:`spin .7s linear infinite`,flexShrink:0}});return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`style`,{children:`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Plus Jakarta Sans',sans-serif;background:${d.bg};}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}

        .cert-page{
          min-height:100vh;display:flex;flex-direction:column;
          align-items:center;justify-content:flex-start;
          padding:20px 16px 40px;animation:fadeIn .5s ease;
        }

        /* ═══════════════════════════════════════════════════
           TOOLBAR
           Desktop  → single flex row
           ≤ 560px  → 2-column CSS grid (guaranteed no overflow)
        ═══════════════════════════════════════════════════ */
        .toolbar{
          width:100%;max-width:980px;
          background:${d.white};border:1px solid ${d.border};
          border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,.05);
          padding:10px 14px;margin-bottom:14px;
          display:flex;align-items:center;gap:8px;overflow:hidden;
        }

        /* All toolbar interactive elements share this base */
        .tb-el{
          display:inline-flex;align-items:center;justify-content:center;gap:5px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;
          cursor:pointer;transition:all .13s;border:none;
          white-space:nowrap;text-decoration:none;
        }

        .tb-back{
          padding:7px 13px;border-radius:7px;font-size:11.5px;
          border:1.5px solid ${d.blue}!important;
          background:${d.white};color:${d.blue};flex-shrink:0;
        }
        .tb-back:hover{background:#EFF6FF;}

        .tb-div{width:1px;height:20px;background:${d.border};flex-shrink:0;}

        .btn-group{
          display:flex;gap:2px;align-items:center;
          background:${d.bg};border:1px solid ${d.border};
          border-radius:7px;padding:3px;flex-shrink:0;
        }
        .tb-exp{
          padding:5px 9px;border-radius:5px;font-size:11px;font-weight:700;
          background:transparent;color:${d.slate};
          font-family:'Plus Jakarta Sans',sans-serif;
          display:inline-flex;align-items:center;justify-content:center;gap:4px;
          cursor:pointer;border:none;white-space:nowrap;transition:background .12s;
        }
        .tb-exp:hover{background:${d.white};}
        .tb-exp:disabled{opacity:.45;cursor:not-allowed;}

        .tb-copy{
          padding:7px 13px;border-radius:7px;font-size:11.5px;
          border:1.5px solid ${d.border}!important;
          background:${d.white};color:${d.slate};flex-shrink:0;
        }
        .tb-copy:hover{border-color:${d.blue}!important;color:${d.blue};}
        .tb-copy-done{background:${d.success}!important;color:#fff!important;border-color:${d.success}!important;}

        .tb-share{
          margin-left:auto;flex-shrink:0;
          padding:7px 16px;border-radius:8px;font-size:11.5px;
          background:${d.blue};color:#fff;
          box-shadow:0 3px 10px rgba(0,86,210,.22);
        }
        .tb-share:hover{background:${d.blueDark};}

        /* ── MOBILE: 2-column grid, both rows fill naturally ── */
        @media(max-width:560px){
          .cert-page{padding:12px 10px 28px;}
          .toolbar{
            /* switch to grid */
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:7px;
            padding:10px 10px;
          }
          /* Row 1 */
          .tb-back  {grid-column:1;grid-row:1;width:100%;font-size:10.5px;padding:8px 4px;}
          .btn-group{grid-column:2;grid-row:1;width:100%;justify-content:space-evenly;}
          .tb-exp   {flex:1;font-size:9.5px;padding:5px 2px;}
          /* Row 2 */
          .tb-copy  {grid-column:1;grid-row:2;width:100%;font-size:10.5px;padding:8px 4px;}
          .tb-share {grid-column:2;grid-row:2;width:100%;margin-left:0;font-size:10.5px;padding:8px 4px;}
          /* hide separator */
          .tb-div{display:none;}
        }

        /* ── Certificate ── */
        .cert-wrap{
          width:100%;max-width:980px;aspect-ratio:980/693;
          border-radius:3px;
          box-shadow:0 18px 52px rgba(26,26,46,.12),0 0 0 1px rgba(0,0,0,.04);
          overflow:hidden;background:#FFFEF9;position:relative;
        }
        .cert-scaler{
          width:980px;height:693px;position:absolute;top:0;left:0;
          transform-origin:top left;
        }

        /* ── Info strip ── */
        .info-strip{
          background:${d.white};border-radius:10px;margin-top:12px;
          padding:12px 18px;display:flex;align-items:center;gap:12px;
          box-shadow:0 2px 8px rgba(0,0,0,.04);border:1px solid ${d.border};
          max-width:980px;width:100%;
        }
        @media(max-width:440px){
          .info-strip{flex-direction:column;align-items:flex-start;gap:4px;}
          .info-right{margin-left:0!important;text-align:left!important;}
        }
      `}),(0,u.jsxs)(`div`,{className:`cert-page`,children:[(0,u.jsxs)(`div`,{className:`toolbar`,children:[(0,u.jsx)(a,{to:`/user/courses`,className:`tb-el tb-back`,children:`← Dashboard`}),(0,u.jsx)(`div`,{className:`tb-div`}),(0,u.jsxs)(`div`,{className:`btn-group`,children:[(0,u.jsx)(`button`,{className:`tb-exp`,onClick:A,disabled:!!S,children:S===`png`?(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(I,{}),` PNG…`]}):`⬇ PNG`}),(0,u.jsx)(`button`,{className:`tb-exp`,onClick:j,disabled:!!S,children:S===`pdf`?(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(I,{}),` PDF…`]}):`⬇ PDF`}),(0,u.jsx)(`button`,{className:`tb-exp`,onClick:M,children:`🖨 Print`})]}),(0,u.jsx)(`button`,{className:`tb-el tb-copy${g?` tb-copy-done`:``}`,onClick:k,children:g?`✓ Copied!`:`🔗 Copy Link`}),(0,u.jsx)(`button`,{className:`tb-el tb-share`,onClick:()=>x(!0),children:`🚀 Share Certificate`})]}),(0,u.jsx)(`div`,{className:`cert-wrap`,ref:T,children:(0,u.jsx)(`div`,{className:`cert-scaler`,style:{transform:`scale(${E})`},dangerouslySetInnerHTML:{__html:F}})}),(0,u.jsxs)(`div`,{className:`info-strip`,children:[(0,u.jsxs)(`div`,{children:[(0,u.jsxs)(`div`,{style:{fontWeight:700,fontSize:13,color:d.ink},children:[`🏆 `,n.student_name]}),(0,u.jsx)(`div`,{style:{fontSize:12,color:d.muted,marginTop:2},children:n.course_title})]}),(0,u.jsxs)(`div`,{className:`info-right`,style:{fontSize:11,color:d.muted,marginLeft:`auto`,textAlign:`right`},children:[`Issued `,N,(0,u.jsx)(`br`,{}),(0,u.jsxs)(`span`,{style:{fontFamily:`monospace`,fontSize:10},children:[`№ `,n.certificate_number]})]})]})]}),b&&(0,u.jsx)(w,{cert:n,verifyUrl:P,certHTML:F,onClose:()=>x(!1)})]})}export{T as default};