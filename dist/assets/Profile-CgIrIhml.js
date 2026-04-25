import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{a as t,l as n,o as r}from"./vendor-helmet-D-cMCI9i.js";import{tr as i}from"./vendor-misc-DjQaoctO.js";import{l as a}from"./vendor-router-BeHthcJc.js";import"./vendor-supabase-DTLzbyhy.js";import{t as o}from"./supabase-CXCPPx9q.js";import{r as s}from"./vendor-motion-DyarDpDD.js";var c=e(n(),1),l=s(),u={blue:`#0056D2`,blueDark:`#003A8C`,blueLight:`#EBF2FF`,ink:`#1A1A2E`,slate:`#475569`,muted:`#94A3B8`,border:`#E8EDF5`,bg:`#F7F9FC`,white:`#FFFFFF`,amber:`#F5A623`,success:`#12B76A`,successBg:`#ECFDF3`};function d(){let e=a(),[t,n]=(0,c.useState)([]),[r,s]=(0,c.useState)(!0),[d,f]=(0,c.useState)(null),[p,m]=(0,c.useState)(null),[h,g]=(0,c.useState)(null);(0,c.useEffect)(()=>{o.auth.getUser().then(({data:e})=>{e!=null&&e.user&&(f(e.user.id),_(e.user.id))})},[]);let _=function(){var e=i(function*(e){s(!0);let{data:t}=yield o.from(`course_certificates`).select(`*, course:course_id(title, level, category, thumbnail_url)`).eq(`user_id`,e).order(`issued_at`,{ascending:!1});n(t||[]),s(!1)});return function(t){return e.apply(this,arguments)}}(),v=e=>{let t=`${window.location.origin}/verify/${e}`;navigator.clipboard.writeText(t),m(e),setTimeout(()=>m(null),2500)},y=e=>{var t;let n=encodeURIComponent(`${window.location.origin}/verify/${e.id}`);encodeURIComponent(`I just earned a certificate in "${(t=e.course)==null?void 0:t.title}" on AIDLA! 🎓`),window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${n}`,`_blank`)},b=e=>{var t;let n=encodeURIComponent(`${window.location.origin}/verify/${e.id}`),r=encodeURIComponent(`I just earned a certificate in "${(t=e.course)==null?void 0:t.title}" on AIDLA! 🎓`);window.open(`https://twitter.com/intent/tweet?url=${n}&text=${r}`,`_blank`)},x=function(){var e=i(function*(e){var t,n,r,i,a,s,c;g(e.id);let{data:l}=yield o.from(`users_profiles`).select(`full_name`).eq(`user_id`,e.user_id).single(),u=(l==null?void 0:l.full_name)||`Learner`,d=new Date(e.issued_at).toLocaleDateString(`en-US`,{year:`numeric`,month:`long`,day:`numeric`}),f=`${window.location.origin}/verify/${e.id}`,p=`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(f)}&bgcolor=FFFEF9&color=003A8C&margin=4`,m=window.open(``,`_blank`,`width=1200,height=850`);m.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>AIDLA Certificate — ${u}</title>
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          @page { size: landscape; margin: 0; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { margin: 0; background: white; font-family: 'Plus Jakarta Sans', sans-serif; }
          .cert {
            width: 100vw; height: 100vh; background: #FFFEF9;
            position: relative; overflow: hidden;
          }
          .cert-frame { position: absolute; inset: 0; border: 28px solid #003A8C; pointer-events: none; z-index: 1; }
          .cert-frame-inner { position: absolute; inset: 32px; border: 1.5px solid #F5A623; pointer-events: none; z-index: 1; }
          .corner { position: absolute; width: 52px; height: 52px; z-index: 2; border: 2.5px solid #F5A623; }
          .corner.tl { top:40px;left:40px;border-right:none;border-bottom:none; }
          .corner.tr { top:40px;right:40px;border-left:none;border-bottom:none; }
          .corner.bl { bottom:40px;left:40px;border-right:none;border-top:none; }
          .corner.br { bottom:40px;right:40px;border-left:none;border-top:none; }
          .cert-bg { position: absolute; inset: 0; z-index: 0; opacity: .025; background-image: repeating-linear-gradient(45deg,#003A8C 0,#003A8C 1px,transparent 0,transparent 50%); background-size:24px 24px; }
          .cert-brand { position:absolute;top:44px;left:50%;transform:translateX(-50%);font-weight:900;font-size:20px;letter-spacing:3px;color:#003A8C;z-index:4; }
          .cert-body { position:relative;z-index:3;padding:70px 100px;display:flex;flex-direction:column;align-items:center;text-align:center;height:100%;justify-content:center; }
          .cert-overline { font-size:11px;letter-spacing:4px;text-transform:uppercase;font-weight:700;color:#94A3B8;margin-bottom:8px; }
          .cert-heading { font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;font-size:64px;color:#003A8C;line-height:1;margin-bottom:28px; }
          .rule { display:flex;align-items:center;gap:14px;width:100%;max-width:360px;margin-bottom:22px; }
          .rule-line { flex:1;height:1px;background:linear-gradient(90deg,transparent,#F5A623,transparent); }
          .rule-diamond { width:8px;height:8px;background:#F5A623;transform:rotate(45deg); }
          .cert-presented { font-size:14px;color:#475569;margin-bottom:12px; }
          .cert-name { font-family:'Instrument Serif',serif;font-weight:400;font-size:52px;color:#1A1A2E;line-height:1.1;border-bottom:1.5px solid #E8EDF5;padding-bottom:14px;margin-bottom:16px;min-width:55%; }
          .cert-for { font-size:12px;color:#94A3B8;margin-bottom:8px; }
          .cert-course { font-family:'Instrument Serif',serif;font-size:28px;color:#0056D2;font-weight:400;margin-bottom:20px; }
          .cert-meta { display:flex;align-items:center;gap:10px;font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:36px; }
          .cert-footer { display:flex;align-items:flex-end;justify-content:space-between;width:100%;gap:20px;margin-top:auto; }
          .sig { display:flex;flex-direction:column;align-items:center;flex:1; }
          .sig-script { font-family:'Instrument Serif',serif;font-style:italic;font-size:26px;color:#003A8C;border-bottom:1.5px solid #CBD5E1;padding-bottom:4px;min-width:180px;text-align:center;margin-bottom:6px; }
          .sig-label { font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#94A3B8; }
          .seal-wrap { width:90px;height:90px;flex-shrink:0; }
          .seal-outer { width:100%;height:100%;border-radius:50%;background:conic-gradient(#F5A623 0deg,#F0C040 120deg,#F5A623 240deg,#F0C040 360deg);display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px white,0 0 0 5px #F5A623; }
          .seal-inner { width:80%;height:80%;border-radius:50%;border:1.5px dashed rgba(120,53,15,.35);display:flex;align-items:center;justify-content:center;flex-direction:column; }
          .seal-text { font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:.5px;color:#78350F;line-height:1.4;text-align:center; }
          .cert-qr { position:absolute;bottom:44px;right:72px;z-index:4;display:flex;flex-direction:column;align-items:center;gap:4px; }
          .cert-qr-label { font-size:7px;color:#94A3B8;font-weight:700;text-transform:uppercase;letter-spacing:1px; }
          .cert-id { position:absolute;bottom:44px;left:72px;font-size:9px;color:#94A3B8;font-family:monospace;line-height:1.7;z-index:3; }
        </style>
      </head>
      <body onload="window.print();window.close();">
        <div class="cert">
          <div class="cert-bg"></div>
          <div class="cert-frame"></div>
          <div class="cert-frame-inner"></div>
          <div class="corner tl"></div>
          <div class="corner tr"></div>
          <div class="corner bl"></div>
          <div class="corner br"></div>
          <div class="cert-brand"><img src="/logo.png" alt="AIDLA" style="height:36px;object-fit:contain;"></div>
          <div class="cert-body">
            <div class="cert-overline">Certificate of Completion</div>
            <h1 class="cert-heading">Verified Achievement</h1>
            <div class="rule"><div class="rule-line"></div><div class="rule-diamond"></div><div class="rule-line"></div></div>
            <p class="cert-presented">This is to proudly certify that</p>
            <div class="cert-name">${u}</div>
            <p class="cert-for">has successfully completed all requirements for</p>
            <div class="cert-course">${((t=e.course)==null?void 0:t.title)||`—`}</div>
            ${(n=e.course)!=null&&n.level||(r=e.course)!=null&&r.category?`
            <div class="cert-meta">
              ${(i=e.course)!=null&&i.level?`<span>${e.course.level}</span>`:``}
              ${(a=e.course)!=null&&a.level&&(s=e.course)!=null&&s.category?`<div style="width:3px;height:3px;border-radius:50%;background:#E8EDF5;"></div>`:``}
              ${(c=e.course)!=null&&c.category?`<span>${e.course.category}</span>`:``}
            </div>`:``}
            <div class="cert-footer">
              <div class="sig">
                <div class="sig-script">AIDLA Director</div>
                <div class="sig-label">Program Director</div>
              </div>
              <div class="seal-wrap">
                <div class="seal-outer">
                  <div class="seal-inner">
                    <div class="seal-text">AIDLA<br/>✓<br/>CERT</div>
                  </div>
                </div>
              </div>
              <div class="sig">
                <div class="sig-script">${d}</div>
                <div class="sig-label">Date of Issue</div>
              </div>
            </div>
          </div>
          <div class="cert-qr">
            <img src="${p}" width="80" height="80" alt="QR">
            <div class="cert-qr-label">Scan to verify</div>
          </div>
          <div class="cert-id">
            Certificate No: ${e.certificate_number}<br>
            Verify: ${f}
          </div>
        </div>
      </body>
      </html>
    `),m.document.close(),g(null)});return function(t){return e.apply(this,arguments)}}(),S=`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; }
    .certs-wrapper { font-family: 'Plus Jakarta Sans', sans-serif; color: ${u.ink}; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    .cert-card { animation: fadeUp .4s ease both; }
    .cert-card:hover { transform: translateY(-3px) !important; box-shadow: 0 12px 32px rgba(0,86,210,.12) !important; }
    .action-btn { transition: all .15s; }
    .action-btn:hover { opacity: .85; transform: translateY(-1px); }
  `;return r?(0,l.jsxs)(`div`,{style:{padding:`48px 0`,textAlign:`center`},children:[(0,l.jsx)(`style`,{children:S}),(0,l.jsx)(`div`,{style:{width:36,height:36,border:`3px solid ${u.border}`,borderTopColor:u.blue,borderRadius:`50%`,animation:`spin .8s linear infinite`,margin:`0 auto 12px`}}),(0,l.jsx)(`style`,{children:`@keyframes spin{to{transform:rotate(360deg)}}`}),(0,l.jsx)(`p`,{style:{color:u.muted,fontWeight:600,fontSize:14},children:`Loading your certificates…`})]}):(0,l.jsxs)(`div`,{className:`certs-wrapper`,children:[(0,l.jsx)(`style`,{children:S}),(0,l.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,marginBottom:24},children:[(0,l.jsxs)(`div`,{children:[(0,l.jsx)(`h2`,{style:{fontFamily:`'Instrument Serif', serif`,fontWeight:400,fontSize:22,color:u.ink},children:`My Certificates`}),(0,l.jsxs)(`p`,{style:{fontSize:13,color:u.muted,marginTop:3},children:[t.length,` certificate`,t.length===1?``:`s`,` earned`]})]}),(0,l.jsx)(`button`,{onClick:()=>e(`/user/courses`),style:{background:u.blue,color:u.white,border:`none`,borderRadius:8,padding:`10px 18px`,fontWeight:700,fontSize:13,cursor:`pointer`,fontFamily:`inherit`},children:`+ Earn More`})]}),t.length===0&&(0,l.jsxs)(`div`,{style:{textAlign:`center`,padding:`60px 20px`,background:u.white,borderRadius:16,border:`1px solid ${u.border}`},children:[(0,l.jsx)(`div`,{style:{fontSize:56,marginBottom:16},children:`🎓`}),(0,l.jsx)(`h3`,{style:{fontFamily:`'Instrument Serif', serif`,fontWeight:400,fontSize:20,color:u.ink,marginBottom:8},children:`No certificates yet`}),(0,l.jsx)(`p`,{style:{color:u.muted,fontSize:14,marginBottom:20},children:`Complete a course to earn your first AIDLA certificate`}),(0,l.jsx)(`button`,{onClick:()=>e(`/user/courses`),style:{background:u.blue,color:u.white,border:`none`,borderRadius:8,padding:`11px 24px`,fontWeight:700,fontSize:14,cursor:`pointer`,fontFamily:`inherit`},children:`Browse Courses`})]}),(0,l.jsx)(`div`,{style:{display:`grid`,gap:16,gridTemplateColumns:`repeat(auto-fill, minmax(300px, 1fr))`},children:t.map((t,n)=>{var r,i,a,o,s;let c=new Date(t.issued_at).toLocaleDateString(`en-US`,{year:`numeric`,month:`long`,day:`numeric`});`${window.location.origin}${t.id}`;let d=p===t.id,f=h===t.id;return(0,l.jsxs)(`div`,{className:`cert-card`,style:{animationDelay:`${n*60}ms`,background:u.white,borderRadius:16,border:`1px solid ${u.border}`,boxShadow:`0 2px 12px rgba(0,0,0,.05)`,overflow:`hidden`,transition:`all .2s`},children:[(0,l.jsxs)(`div`,{style:{background:`linear-gradient(135deg, ${u.blueDark} 0%, ${u.blue} 100%)`,padding:`20px 20px 16px`,position:`relative`},children:[(0,l.jsx)(`div`,{style:{position:`absolute`,top:10,right:14,fontWeight:900,fontSize:11,letterSpacing:2,color:`rgba(255,255,255,.3)`,textTransform:`uppercase`},children:`AIDLA`}),(0,l.jsx)(`div`,{style:{fontSize:10,fontWeight:700,color:`rgba(255,255,255,.6)`,textTransform:`uppercase`,letterSpacing:2,marginBottom:6},children:`Certificate of Completion`}),(0,l.jsx)(`div`,{style:{fontFamily:`'Instrument Serif', serif`,fontStyle:`italic`,fontSize:20,color:u.white,lineHeight:1.3,marginBottom:4},children:((r=t.course)==null?void 0:r.title)||`—`}),(((i=t.course)==null?void 0:i.level)||((a=t.course)==null?void 0:a.category))&&(0,l.jsx)(`div`,{style:{fontSize:11,color:`rgba(255,255,255,.6)`,fontWeight:600},children:[(o=t.course)==null?void 0:o.level,(s=t.course)==null?void 0:s.category].filter(Boolean).join(` · `)}),(0,l.jsx)(`div`,{style:{position:`absolute`,bottom:-18,right:20,width:44,height:44,borderRadius:`50%`,background:`conic-gradient(${u.amber} 0deg, #F0C040 120deg, ${u.amber} 240deg, #F0C040 360deg)`,display:`flex`,alignItems:`center`,justifyContent:`center`,boxShadow:`0 0 0 3px ${u.white}, 0 0 0 5px ${u.amber}`,zIndex:2},children:(0,l.jsx)(`span`,{style:{fontSize:16,fontWeight:900,color:`#78350F`},children:`✓`})})]}),(0,l.jsxs)(`div`,{style:{padding:`22px 20px 16px`},children:[(0,l.jsxs)(`div`,{style:{marginBottom:14},children:[(0,l.jsx)(`div`,{style:{fontSize:11,color:u.muted,fontWeight:700,textTransform:`uppercase`,letterSpacing:.6,marginBottom:3},children:`Issued`}),(0,l.jsx)(`div`,{style:{fontSize:13,fontWeight:600,color:u.slate},children:c})]}),(0,l.jsxs)(`div`,{style:{marginBottom:16},children:[(0,l.jsx)(`div`,{style:{fontSize:11,color:u.muted,fontWeight:700,textTransform:`uppercase`,letterSpacing:.6,marginBottom:3},children:`Certificate No`}),(0,l.jsx)(`div`,{style:{fontSize:11,fontFamily:`monospace`,color:u.slate,wordBreak:`break-all`},children:t.certificate_number})]}),(0,l.jsxs)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`},children:[(0,l.jsx)(`button`,{className:`action-btn`,onClick:()=>e(`/user/certificate/${t.id}`),style:{flex:1,padding:`9px 12px`,background:u.blue,color:u.white,border:`none`,borderRadius:8,fontWeight:700,fontSize:12,cursor:`pointer`,fontFamily:`inherit`},children:`👁 View`}),(0,l.jsx)(`button`,{className:`action-btn`,onClick:()=>x(t),disabled:f,style:{flex:1,padding:`9px 12px`,background:u.successBg,color:u.success,border:`1px solid #A7F3D0`,borderRadius:8,fontWeight:700,fontSize:12,cursor:`pointer`,fontFamily:`inherit`},children:f?`⏳`:`⬇ PDF`}),(0,l.jsx)(`button`,{className:`action-btn`,onClick:()=>v(t.id),style:{flex:1,padding:`9px 12px`,background:d?u.successBg:u.bg,color:d?u.success:u.slate,border:`1px solid ${d?`#A7F3D0`:u.border}`,borderRadius:8,fontWeight:700,fontSize:12,cursor:`pointer`,fontFamily:`inherit`},children:d?`✓ Copied`:`🔗 Link`})]}),(0,l.jsxs)(`div`,{style:{display:`flex`,gap:8,marginTop:8},children:[(0,l.jsx)(`button`,{className:`action-btn`,onClick:()=>y(t),style:{flex:1,padding:`8px 10px`,background:`#EFF5FB`,color:`#0077B5`,border:`none`,borderRadius:8,fontWeight:700,fontSize:11,cursor:`pointer`,fontFamily:`inherit`},children:`LinkedIn`}),(0,l.jsx)(`button`,{className:`action-btn`,onClick:()=>b(t),style:{flex:1,padding:`8px 10px`,background:`#EFF8FF`,color:`#1DA1F2`,border:`none`,borderRadius:8,fontWeight:700,fontSize:11,cursor:`pointer`,fontFamily:`inherit`},children:`Twitter / X`})]})]})]},t.id)})})]})}r();function f(){let[e,n]=(0,c.useState)(!0),[r,a]=(0,c.useState)(!1),[s,u]=(0,c.useState)(!1),[f,p]=(0,c.useState)(!1),[m,h]=(0,c.useState)(`profile`),[g,_]=(0,c.useState)(``),[v,y]=(0,c.useState)(null),[b,x]=(0,c.useState)({avatar_url:``,full_name:``,email:``,phone:``,date_of_birth:``,city:``,country:``,educational_level:``,profession:``,institute_company:``,interests:``,bio:``});function S(e,n){x(r=>t(t({},r),{},{[e]:n}))}(0,c.useEffect)(()=>{i(function*(){_(``),n(!0),p(!1);let{data:e,error:t}=yield o.auth.getUser();if(t||!(e!=null&&e.user)){_(`Not logged in.`),n(!1);return}let r=e.user;y(r.id);let{data:i,error:a}=yield o.from(`users_profiles`).select(`*`).eq(`user_id`,r.id).single();if(a&&a.code===`PGRST116`){var s;yield o.from(`users_profiles`).insert([{user_id:r.id,full_name:((s=r.user_metadata)==null?void 0:s.full_name)||``,email:(r.email||``).toLowerCase()}]);let{data:e}=yield o.from(`users_profiles`).select(`*`).eq(`user_id`,r.id).single();e&&C(e,r.email)}else i?C(i,r.email):a&&_(a.message);n(!1)})()},[]);function C(e,t){x({avatar_url:e.avatar_url||``,full_name:e.full_name||``,email:e.email||(t||``).toLowerCase(),phone:e.phone||``,date_of_birth:e.date_of_birth||``,city:e.city||``,country:e.country||``,educational_level:e.educational_level||``,profession:e.profession||``,institute_company:e.institute_company||``,interests:Array.isArray(e.interests)?e.interests.join(`, `):``,bio:e.bio||``})}function w(e){return T.apply(this,arguments)}function T(){return T=i(function*(e){if(!e||!v){_(`No file selected or user not authenticated`);return}_(``),u(!0);try{if(e.size>3*1024*1024)throw Error(`File too large. Maximum size is 3MB`);if(!e.type.startsWith(`image/`))throw Error(`Please select an image file`);let t=`${v}/avatar_${Date.now()}.${e.name.split(`.`).pop()||`jpg`}`,{data:n,error:r}=yield o.storage.from(`avatars`).upload(t,e,{upsert:!1,contentType:e.type});if(r)throw Error(`Upload failed: ${r.message}`);let{data:i}=o.storage.from(`avatars`).getPublicUrl(t),a=i.publicUrl,{error:s}=yield o.from(`users_profiles`).update({avatar_url:a}).eq(`user_id`,v);if(s)throw Error(`Failed to save avatar: ${s.message}`);S(`avatar_url`,a),_(`Avatar uploaded successfully! ✅`)}catch(e){_(e.message||`Failed to upload avatar`)}finally{u(!1)}}),T.apply(this,arguments)}function E(){return D.apply(this,arguments)}function D(){return D=i(function*(){if(!(!v||!b.avatar_url)){_(``),u(!0);try{let e=b.avatar_url.match(/avatars\/([^?]+)/);if(e){let t=e[1],{error:n}=yield o.storage.from(`avatars`).remove([t]);if(n&&n.message!==`The resource was not found`)throw n}let{error:t}=yield o.from(`users_profiles`).update({avatar_url:null}).eq(`user_id`,v);if(t)throw t;S(`avatar_url`,``),_(`Avatar deleted successfully!`)}catch(e){_(e.message||`Avatar deletion failed`)}finally{u(!1)}}}),D.apply(this,arguments)}function O(e){return k.apply(this,arguments)}function k(){return k=i(function*(e){if(e.preventDefault(),v){_(``),a(!0);try{let e=b.interests.split(`,`).map(e=>e.trim()).filter(Boolean),t={full_name:b.full_name.trim(),phone:b.phone.trim()||null,date_of_birth:b.date_of_birth||null,city:b.city.trim()||null,country:b.country.trim()||null,educational_level:b.educational_level.trim()||null,profession:b.profession.trim()||null,institute_company:b.institute_company.trim()||null,interests:e.length?e:null,bio:b.bio.trim()||null},{error:n}=yield o.from(`users_profiles`).update(t).eq(`user_id`,v);if(n)throw n;_(`Profile saved successfully!`),p(!1)}catch(e){_(e.message||`Save failed`)}finally{a(!1)}}}),k.apply(this,arguments)}let A=`
    * { box-sizing: border-box; }

    .profile-wrapper {
      padding: 14px;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      max-width: 700px;
      margin: 0 auto;
      color: #0f172a;
    }

    .page-title {
      font-size: 1.4rem;
      font-weight: 900;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 0 14px 0;
      filter: drop-shadow(1px 1px 2px rgba(30,58,138,0.1));
    }

    .card-2060 {
      background: rgba(255,255,255,0.95);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 14px;
      box-shadow:
        8px 8px 20px rgba(15,23,42,0.06),
        -8px -8px 20px rgba(255,255,255,0.9),
        inset 0 0 0 1px rgba(255,255,255,0.5);
    }

    .section-title {
      font-size: 0.9rem;
      font-weight: 800;
      color: #1e3a8a;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 8px;
      margin-bottom: 14px;
    }

    /* Avatar */
    .avatar-section {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .avatar-3d-frame {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #f8fafc;
      box-shadow:
        inset 4px 4px 8px rgba(15,23,42,0.08),
        inset -4px -4px 8px rgba(255,255,255,1),
        4px 4px 10px rgba(15,23,42,0.05);
      display: grid;
      place-items: center;
      overflow: hidden;
      border: 3px solid #fff;
      flex-shrink: 0;
    }

    .avatar-3d-frame img {
      width: 100%; height: 100%; object-fit: cover;
    }

    .avatar-placeholder {
      color: #94a3b8;
      font-weight: 600;
      font-size: 0.7rem;
      text-align: center;
    }

    .btn-upload-3d {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 14px;
      background: #f1f5f9;
      color: #1e3a8a;
      font-weight: 700;
      font-size: 0.78rem;
      border: none;
      border-radius: 10px;
      box-shadow: 3px 3px 8px rgba(15,23,42,0.05), -3px -3px 8px rgba(255,255,255,1);
      transition: all 0.2s;
      cursor: pointer;
    }
    .btn-upload-3d:hover:not(.disabled) { color: #3b82f6; transform: translateY(-1px); }
    .btn-upload-3d.disabled { opacity: 0.7; cursor: not-allowed; }

    /* Form Grid */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .full-width { grid-column: 1 / -1; }

    .input-group { position: relative; }

    .label-3d {
      display: block;
      margin-bottom: 5px;
      font-weight: 700;
      color: #334155;
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .input-3d {
      width: 100%;
      padding: 10px 12px;
      border-radius: 10px;
      border: 2px solid transparent;
      background: #f8fafc;
      color: #0f172a;
      font-size: 0.85rem;
      font-weight: 600;
      box-shadow: inset 3px 3px 7px rgba(15,23,42,0.06), inset -3px -3px 7px rgba(255,255,255,1);
      transition: all 0.2s;
      font-family: inherit;
    }
    .input-3d:read-only {
      background: #e2e8f0;
      color: #64748b;
      cursor: not-allowed;
      box-shadow: inset 1px 1px 4px rgba(15,23,42,0.03);
    }
    .input-3d::placeholder { color: #cbd5e1; font-weight: 500; font-size: 0.8rem; }
    .input-3d:not(:read-only):focus {
      outline: none;
      background: #fff;
      border-color: rgba(59,130,246,0.4);
      box-shadow: inset 2px 2px 5px rgba(15,23,42,0.03), inset -2px -2px 5px rgba(255,255,255,1), 0 0 0 3px rgba(59,130,246,0.1);
    }

    textarea.input-3d {
      resize: vertical;
      min-height: 80px;
    }

    /* Buttons */
    .btn-2060 {
      padding: 11px 18px;
      border-radius: 11px;
      border: none;
      background: linear-gradient(135deg, #1e3a8a, #3b82f6);
      color: #fff;
      font-size: 0.85rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      cursor: pointer;
      box-shadow: 0 5px 0 #1e3a8a, 0 8px 14px rgba(30,58,138,0.2), inset 0 2px 0 rgba(255,255,255,0.2);
      transition: all 0.12s;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      min-width: 100px;
    }
    .btn-2060:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 7px 0 #1e3a8a, 0 12px 18px rgba(30,58,138,0.25), inset 0 2px 0 rgba(255,255,255,0.2); }
    .btn-2060:active:not(:disabled) { transform: translateY(5px); box-shadow: 0 0 0 #1e3a8a, 0 2px 6px rgba(30,58,138,0.2), inset 0 2px 0 rgba(255,255,255,0.2); }
    .btn-2060:disabled { background: #94a3b8; box-shadow: 0 5px 0 #64748b; cursor: not-allowed; opacity: 0.8; }

    .btn-cancel {
      background: linear-gradient(135deg, #94a3b8, #cbd5e1);
      box-shadow: 0 5px 0 #64748b, 0 8px 14px rgba(15,23,42,0.1), inset 0 2px 0 rgba(255,255,255,0.2);
    }
    .btn-cancel:hover:not(:disabled) { box-shadow: 0 7px 0 #64748b, 0 12px 18px rgba(15,23,42,0.15), inset 0 2px 0 rgba(255,255,255,0.2); }
    .btn-cancel:active:not(:disabled) { box-shadow: 0 0 0 #64748b; }

    .btn-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      gap: 10px;
      flex-wrap: wrap;
    }

    .header-row .section-title { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }

    .msg-box {
      margin-bottom: 14px;
      padding: 11px 14px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.82rem;
      animation: fadeIn 0.3s ease;
      display: block;
      width: 100%;
    }

    .loader-container {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      height: 40vh; color: #1e3a8a; font-weight: 700;
      font-size: 0.9rem; gap: 12px;
    }

    .spinner {
      width: 32px; height: 32px;
      border: 3px solid rgba(59,130,246,0.2);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

    /* Tablet */
    @media (max-width: 768px) {
      .profile-wrapper { padding: 12px; }
      .form-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    }

    /* Mobile */
    @media (max-width: 540px) {
      .profile-wrapper { padding: 10px; }
      .page-title { font-size: 1.2rem; }
      .card-2060 { padding: 13px; border-radius: 14px; }
      .form-grid { grid-template-columns: 1fr; gap: 9px; }
      .avatar-section { flex-direction: row; align-items: center; }
      .avatar-3d-frame { width: 68px; height: 68px; }
      .btn-2060 { width: 100%; font-size: 0.82rem; padding: 10px; }
      .btn-container { flex-direction: column; }
      .header-row { flex-direction: row; }
      .input-3d { padding: 9px 11px; font-size: 0.82rem; }
    }

    /* Very small */
    @media (max-width: 360px) {
      .form-grid { grid-template-columns: 1fr; }
      .avatar-3d-frame { width: 60px; height: 60px; }
      .page-title { font-size: 1.1rem; }
    }
      .avatar-section {
  display: flex;
  align-items: center;
  gap: 14px;
}
  `;return e?(0,l.jsxs)(`div`,{className:`profile-wrapper`,children:[(0,l.jsx)(`style`,{children:A}),(0,l.jsxs)(`div`,{className:`loader-container`,children:[(0,l.jsx)(`div`,{className:`spinner`}),(0,l.jsx)(`div`,{children:`Loading Profile Data...`})]})]}):(0,l.jsxs)(`div`,{className:`profile-wrapper`,children:[(0,l.jsx)(`style`,{children:A}),(0,l.jsx)(`h2`,{className:`page-title`,children:`My Profile`}),(0,l.jsxs)(`div`,{style:{display:`flex`,gap:8,marginBottom:20,background:`#f1f5f9`,padding:5,borderRadius:12,width:`fit-content`},children:[(0,l.jsx)(`button`,{onClick:()=>h(`profile`),style:{padding:`9px 22px`,borderRadius:9,border:`none`,cursor:`pointer`,fontWeight:700,fontSize:13,fontFamily:`inherit`,background:m===`profile`?`#1e3a8a`:`transparent`,color:m===`profile`?`white`:`#64748b`},children:`👤 Profile`}),(0,l.jsx)(`button`,{onClick:()=>h(`certificates`),style:{padding:`9px 22px`,borderRadius:9,border:`none`,cursor:`pointer`,fontWeight:700,fontSize:13,fontFamily:`inherit`,background:m===`certificates`?`#1e3a8a`:`transparent`,color:m===`certificates`?`white`:`#64748b`},children:`🎓 Certificates`})]}),m===`certificates`&&(0,l.jsx)(d,{}),m===`profile`&&(0,l.jsxs)(l.Fragment,{children:[g&&(0,l.jsx)(`div`,{className:`msg-box`,style:{color:g.includes(`success`)||g.includes(`✅`)?`#047857`:`#b91c1c`,background:g.includes(`success`)||g.includes(`✅`)?`#d1fae5`:`#fee2e2`,boxShadow:g.includes(`success`)||g.includes(`✅`)?`inset 0 0 0 2px #34d399`:`inset 0 0 0 2px #f87171`},children:g}),(0,l.jsxs)(`div`,{className:`card-2060`,children:[(0,l.jsx)(`div`,{className:`section-title`,children:`Profile Picture`}),(0,l.jsxs)(`div`,{className:`avatar-section`,children:[(0,l.jsx)(`div`,{className:`avatar-3d-frame`,children:b.avatar_url?(0,l.jsx)(`img`,{src:b.avatar_url,alt:`User Avatar`}):(0,l.jsx)(`span`,{className:`avatar-placeholder`,children:`No Photo`})}),(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`7px`,flex:1},children:[(0,l.jsxs)(`div`,{style:{display:`flex`,gap:`7px`,flexWrap:`wrap`},children:[(0,l.jsxs)(`label`,{className:`btn-upload-3d ${s?`disabled`:``}`,children:[(0,l.jsx)(`input`,{type:`file`,accept:`image/*`,disabled:s,style:{display:`none`},onChange:e=>{e.target.files&&e.target.files.length>0&&(w(e.target.files[0]),e.target.value=``)}}),(0,l.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,l.jsx)(`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`}),(0,l.jsx)(`polyline`,{points:`17 8 12 3 7 8`}),(0,l.jsx)(`line`,{x1:`12`,y1:`3`,x2:`12`,y2:`15`})]}),s?`Uploading...`:`Change Avatar`]}),b.avatar_url&&(0,l.jsxs)(`button`,{type:`button`,disabled:s,onClick:E,style:{display:`inline-flex`,alignItems:`center`,gap:`5px`,padding:`9px 14px`,background:`#fee2e2`,color:`#b91c1c`,fontWeight:`700`,fontSize:`0.78rem`,border:`none`,borderRadius:`10px`,cursor:s?`not-allowed`:`pointer`,opacity:s?.6:1,transition:`all 0.2s`,boxShadow:`3px 3px 8px rgba(15,23,42,0.05), -3px -3px 8px rgba(255,255,255,1)`},children:[(0,l.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,l.jsx)(`polyline`,{points:`3 6 5 6 21 6`}),(0,l.jsx)(`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`})]}),s?`Deleting...`:`Delete`]})]}),(0,l.jsx)(`p`,{style:{color:`#94a3b8`,fontSize:`0.65rem`,margin:0,fontWeight:`500`},children:`Max 3MB · JPG, PNG`})]})]})]}),(0,l.jsxs)(`div`,{className:`card-2060`,children:[(0,l.jsx)(`div`,{className:`header-row`,children:f?(0,l.jsx)(`div`,{style:{fontSize:`0.9rem`,fontWeight:800,color:`#1e3a8a`,borderBottom:`2px solid #f1f5f9`,paddingBottom:`8px`,width:`100%`},children:`Personal Details`}):(0,l.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,width:`100%`,borderBottom:`2px solid #f1f5f9`,paddingBottom:`8px`},children:[(0,l.jsx)(`span`,{style:{fontSize:`0.9rem`,fontWeight:800,color:`#1e3a8a`},children:`Personal Details`}),(0,l.jsxs)(`button`,{type:`button`,onClick:()=>p(!0),style:{display:`inline-flex`,alignItems:`center`,gap:`5px`,padding:`6px 12px`,background:`#f1f5f9`,color:`#1e3a8a`,fontWeight:700,fontSize:`0.72rem`,border:`none`,borderRadius:`8px`,cursor:`pointer`,boxShadow:`3px 3px 8px rgba(15,23,42,0.05), -3px -3px 8px rgba(255,255,255,1)`,transition:`all 0.2s`},children:[(0,l.jsxs)(`svg`,{width:`13`,height:`13`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.5`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,l.jsx)(`path`,{d:`M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7`}),(0,l.jsx)(`path`,{d:`M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z`})]}),`Edit`]})]})}),(0,l.jsxs)(`form`,{onSubmit:O,className:`form-grid`,children:[(0,l.jsxs)(`div`,{className:`input-group`,children:[(0,l.jsx)(`label`,{className:`label-3d`,children:`Full Name`}),(0,l.jsx)(`input`,{className:`input-3d`,value:b.full_name,onChange:e=>S(`full_name`,e.target.value),required:!0,placeholder:`Enter your full name`,readOnly:!f})]}),(0,l.jsxs)(`div`,{className:`input-group`,children:[(0,l.jsx)(`label`,{className:`label-3d`,children:`Email Address`}),(0,l.jsx)(`input`,{className:`input-3d`,value:b.email,readOnly:!0,title:`Email cannot be changed here`})]}),(0,l.jsxs)(`div`,{className:`input-group`,children:[(0,l.jsx)(`label`,{className:`label-3d`,children:`Phone Number`}),(0,l.jsx)(`input`,{className:`input-3d`,value:b.phone,onChange:e=>S(`phone`,e.target.value),placeholder:`+971 50 123 4567`,readOnly:!f})]}),(0,l.jsxs)(`div`,{className:`input-group`,children:[(0,l.jsx)(`label`,{className:`label-3d`,children:`Date of Birth`}),(0,l.jsx)(`input`,{className:`input-3d`,type:`date`,value:b.date_of_birth,onChange:e=>S(`date_of_birth`,e.target.value),readOnly:!f})]}),(0,l.jsxs)(`div`,{className:`input-group`,children:[(0,l.jsx)(`label`,{className:`label-3d`,children:`City`}),(0,l.jsx)(`input`,{className:`input-3d`,value:b.city,onChange:e=>S(`city`,e.target.value),placeholder:`e.g. Dubai`,readOnly:!f})]}),(0,l.jsxs)(`div`,{className:`input-group`,children:[(0,l.jsx)(`label`,{className:`label-3d`,children:`Country`}),(0,l.jsx)(`input`,{className:`input-3d`,value:b.country,onChange:e=>S(`country`,e.target.value),placeholder:`e.g. UAE`,readOnly:!f})]}),(0,l.jsxs)(`div`,{className:`input-group`,children:[(0,l.jsx)(`label`,{className:`label-3d`,children:`Educational Level`}),(0,l.jsx)(`input`,{className:`input-3d`,value:b.educational_level,onChange:e=>S(`educational_level`,e.target.value),placeholder:`e.g. Bachelor's Degree`,readOnly:!f})]}),(0,l.jsxs)(`div`,{className:`input-group`,children:[(0,l.jsx)(`label`,{className:`label-3d`,children:`Profession`}),(0,l.jsx)(`input`,{className:`input-3d`,value:b.profession,onChange:e=>S(`profession`,e.target.value),placeholder:`e.g. Software Engineer`,readOnly:!f})]}),(0,l.jsxs)(`div`,{className:`input-group`,children:[(0,l.jsx)(`label`,{className:`label-3d`,children:`Institute / Company`}),(0,l.jsx)(`input`,{className:`input-3d`,value:b.institute_company,onChange:e=>S(`institute_company`,e.target.value),placeholder:`e.g. Tech Corp LLC`,readOnly:!f})]}),(0,l.jsxs)(`div`,{className:`input-group`,children:[(0,l.jsxs)(`label`,{className:`label-3d`,children:[`Interests `,(0,l.jsx)(`span`,{style:{textTransform:`none`,color:`#94a3b8`},children:`(Comma separated)`})]}),(0,l.jsx)(`input`,{className:`input-3d`,value:b.interests,onChange:e=>S(`interests`,e.target.value),placeholder:`e.g. AI, Web3, Clean Energy`,readOnly:!f})]}),(0,l.jsxs)(`div`,{className:`input-group full-width`,children:[(0,l.jsx)(`label`,{className:`label-3d`,children:`Bio`}),(0,l.jsx)(`textarea`,{className:`input-3d`,value:b.bio,onChange:e=>S(`bio`,e.target.value),placeholder:`Tell us a little bit about yourself...`,rows:4,readOnly:!f})]}),f&&(0,l.jsxs)(`div`,{className:`full-width btn-container`,children:[(0,l.jsx)(`button`,{disabled:r,className:`btn-2060 btn-cancel`,type:`button`,onClick:()=>p(!1),children:`CANCEL`}),(0,l.jsx)(`button`,{disabled:r,className:`btn-2060 btn-edit`,children:r?`SAVING...`:`SAVE CHANGES`})]})]})]})]})]})}export{f as default};