import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const SAMPLE_DECK = [
  { id:1, front:"What is Newton's First Law?", back:"An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.", known:false },
  { id:2, front:"What is the chemical formula for water?", back:"H₂O — two hydrogen atoms bonded to one oxygen atom.", known:false },
  { id:3, front:"What year did Pakistan gain independence?", back:"14th August 1947.", known:false },
];

export default function FlashcardMaker() {
  const [decks,     setDecks]     = useState([{ id:1, name:"Physics", cards: SAMPLE_DECK }]);
  const [activeDeck,setActiveDeck]= useState(null); // deck id
  const [mode,      setMode]      = useState("manage"); // manage | study
  const [cardIdx,   setCardIdx]   = useState(0);
  const [flipped,   setFlipped]   = useState(false);
  const [showAdd,   setShowAdd]   = useState(false);
  const [newDeckName,setNewDeckName]=useState("");
  const [newFront,  setNewFront]  = useState("");
  const [newBack,   setNewBack]   = useState("");
  const [editCardId,setEditCardId]=useState(null);

  const deck = decks.find(d=>d.id===activeDeck);
  const cards = deck?.cards || [];
  const card  = cards[cardIdx];
  const known = cards.filter(c=>c.known).length;

  const addDeck = () => {
    if(!newDeckName.trim()) return;
    const id = Date.now();
    setDecks(d=>[...d,{id,name:newDeckName.trim(),cards:[]}]);
    setNewDeckName(""); setShowAdd(false);
  };

  const removeDeck = (id) => { setDecks(d=>d.filter(x=>x.id!==id)); if(activeDeck===id){setActiveDeck(null);setMode("manage");} };

  const addCard = () => {
    if(!newFront.trim()||!newBack.trim()||!activeDeck) return;
    if(editCardId!==null){
      setDecks(d=>d.map(dk=>dk.id===activeDeck?{...dk,cards:dk.cards.map(c=>c.id===editCardId?{...c,front:newFront,back:newBack}:c)}:dk));
      setEditCardId(null);
    } else {
      setDecks(d=>d.map(dk=>dk.id===activeDeck?{...dk,cards:[...dk.cards,{id:Date.now(),front:newFront,back:newBack,known:false}]}:dk));
    }
    setNewFront(""); setNewBack("");
  };

  const removeCard = (cid) => setDecks(d=>d.map(dk=>dk.id===activeDeck?{...dk,cards:dk.cards.filter(c=>c.id!==cid)}:dk));
  const markKnown = (known) => {
    setDecks(d=>d.map(dk=>dk.id===activeDeck?{...dk,cards:dk.cards.map((c,i)=>i===cardIdx?{...c,known}:c)}:dk));
    if(cardIdx < cards.length-1){setCardIdx(i=>i+1);setFlipped(false);}
    else{setMode("done");}
  };
  const startStudy = () => { setCardIdx(0); setFlipped(false); setMode("study"); };
  const resetDeck  = () => { setDecks(d=>d.map(dk=>dk.id===activeDeck?{...dk,cards:dk.cards.map(c=>({...c,known:false}))}:dk)); setMode("manage"); };

  return (
    <>
      <Helmet>
        <title>Flashcard Maker — Create & Study Digital Flashcards | AIDLA</title>
        <meta name="description" content="Free flashcard maker for students. Create digital flashcards to memorize concepts faster. Study mode with flip cards, track known and unknown cards. Works offline." />
        <meta name="keywords" content="flashcard maker, digital flashcards, study flashcards, memorize flashcards, online flashcard creator, student study tool, AIDLA flashcards" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/education/flashcard-maker" />
        <meta property="og:title" content="Flashcard Maker | AIDLA" />
        <meta property="og:description" content="Create digital flashcards and study with flip-card mode." />
        <meta property="og:url" content="https://www.aidla.online/tools/education/flashcard-maker" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Flashcard Maker by AIDLA","url":"https://www.aidla.online/tools/education/flashcard-maker",
          "description":"Free digital flashcard maker and study tool for students.",
          "applicationCategory":"EducationApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .fc-root*{box-sizing:border-box;margin:0;padding:0}
        .fc-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .fc-wrap{max-width:600px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .fc-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .fc-crumb a{color:#94a3b8;text-decoration:none}.fc-crumb a:hover{color:#1a3a8f}
        .fc-hero{text-align:center;margin-bottom:24px}
        .fc-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(124,58,237,.25)}
        .fc-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .fc-accent{background:linear-gradient(135deg,#7c3aed,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .fc-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:400px;margin:0 auto}
        .fc-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(16px,4vw,24px);margin-bottom:12px}
        .fc-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .fc-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px}
        .fc-input{width:100%;padding:10px 12px;border:1.5px solid #e2e8f0;border-radius:11px;font-size:14px;font-weight:600;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;-webkit-appearance:none}
        .fc-input:focus{border-color:rgba(124,58,237,.4);box-shadow:0 0 0 3px rgba(124,58,237,.07)}
        .fc-textarea{width:100%;padding:10px 12px;border:1.5px solid #e2e8f0;border-radius:11px;font-size:14px;font-weight:600;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;resize:vertical;min-height:70px;line-height:1.55}
        .fc-textarea:focus{border-color:rgba(124,58,237,.4);box-shadow:0 0 0 3px rgba(124,58,237,.07)}
        /* Deck list */
        .fc-deck-item{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;margin-bottom:7px;cursor:pointer;transition:all .13s}
        .fc-deck-item:hover{border-color:rgba(124,58,237,.3);background:rgba(124,58,237,.03)}
        .fc-deck-item.active-deck{border-color:rgba(124,58,237,.4);background:rgba(124,58,237,.06)}
        .fc-deck-name{font-size:14px;font-weight:800;color:#0b1437}
        .fc-deck-count{font-size:11px;color:#94a3b8;margin-top:2px}
        .fc-deck-actions{display:flex;gap:6px}
        .fc-deck-btn{padding:6px 12px;border-radius:8px;border:1.5px solid #e2e8f0;background:#fff;font-size:11px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
        .fc-deck-btn:hover{background:#f0f4ff}
        .fc-deck-del{border-color:#fecaca;color:#dc2626}
        .fc-deck-del:hover{background:#fee2e2}
        /* Flip card */
        .fc-flip-scene{perspective:1000px;width:100%;margin-bottom:16px}
        .fc-flip-card{position:relative;width:100%;height:180px;transform-style:preserve-3d;transition:transform .5s cubic-bezier(.22,1,.36,1);cursor:pointer}
        .fc-flip-card.flipped{transform:rotateY(180deg)}
        .fc-flip-front,.fc-flip-back{position:absolute;inset:0;border-radius:18px;display:flex;align-items:center;justify-content:center;padding:20px;backface-visibility:hidden;-webkit-backface-visibility:hidden}
        .fc-flip-front{background:linear-gradient(135deg,#0b1437,#1a3a8f)}
        .fc-flip-back{background:linear-gradient(135deg,#059669,#10b981);transform:rotateY(180deg)}
        .fc-flip-label{position:absolute;top:12px;left:14px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.55)}
        .fc-flip-text{font-size:clamp(14px,3vw,17px);font-weight:700;color:#fff;text-align:center;line-height:1.6}
        .fc-flip-hint{position:absolute;bottom:11px;right:13px;font-size:10px;color:rgba(255,255,255,.45);font-weight:600}
        /* Study controls */
        .fc-study-nav{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:14px}
        .fc-nav-btn{padding:10px 18px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;font-size:13px;font-weight:700;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
        .fc-nav-btn:hover{background:#f0f4ff}
        .fc-nav-btn:disabled{opacity:.4;cursor:not-allowed}
        .fc-prog{font-size:12px;font-weight:700;color:#64748b}
        .fc-know-btns{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .fc-know-btn{padding:12px;border:none;border-radius:14px;font-size:14px;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;color:#fff;transition:all .2s}
        .fc-know-btn:hover{transform:translateY(-2px);filter:brightness(1.07)}
        /* Card list in manage */
        .fc-card-item{display:flex;align-items:flex-start;gap:10px;padding:11px 13px;border-radius:12px;border:1px solid #f1f5f9;background:#fff;margin-bottom:7px}
        .fc-card-front{font-size:13px;font-weight:700;color:#0b1437;margin-bottom:3px}
        .fc-card-back{font-size:12px;color:#64748b;line-height:1.5}
        .fc-card-del{width:26px;height:26px;border:1px solid #fecaca;border-radius:7px;background:#fff;color:#dc2626;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
        .fc-add-btn{width:100%;padding:12px;border:none;border-radius:14px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:14px;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;box-shadow:0 4px 12px rgba(124,58,237,.25);margin-bottom:12px}
        .fc-add-btn:hover{transform:translateY(-2px);filter:brightness(1.07)}
        .fc-back-btn{padding:9px 16px;border:1.5px solid #e2e8f0;border-radius:10px;background:#fff;font-size:12px;font-weight:700;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;margin-bottom:14px;transition:all .13s}
        .fc-back-btn:hover{background:#f8faff}
        .fc-done-wrap{text-align:center;padding:28px 16px}
        .fc-done-icon{font-size:48px;margin-bottom:12px}
        .fc-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .fc-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .fc-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .fc-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.fc-cta{flex-direction:column;text-align:center}.fc-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="fc-root">
        <div className="fc-wrap">
          <nav className="fc-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Flashcard Maker</span></nav>

          <motion.div className="fc-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="fc-badge">🗂️ Study Tool</div>
            <h1 className="fc-h1">Flashcard <span className="fc-accent">Maker</span></h1>
            <p className="fc-sub">Create digital flashcards and study with flip-card mode. Track what you know.</p>
          </motion.div>

          {/* Study mode */}
          {mode === "study" && deck && card && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}}>
              <button className="fc-back-btn" onClick={()=>setMode("manage")}>← Back to Deck</button>

              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:12,fontWeight:700,color:"#64748b"}}>Card {cardIdx+1} of {cards.length}</span>
                <span style={{fontSize:12,fontWeight:700,color:"#059669"}}>✅ Known: {known}/{cards.length}</span>
              </div>

              {/* Flip card */}
              <div className="fc-flip-scene" onClick={()=>setFlipped(f=>!f)} aria-label={flipped?"Card back — click to flip":"Card front — click to flip"}>
                <div className={`fc-flip-card${flipped?" flipped":""}`}>
                  <div className="fc-flip-front">
                    <span className="fc-flip-label">Question</span>
                    <span className="fc-flip-text">{card.front}</span>
                    <span className="fc-flip-hint">Tap to reveal →</span>
                  </div>
                  <div className="fc-flip-back">
                    <span className="fc-flip-label">Answer</span>
                    <span className="fc-flip-text">{card.back}</span>
                    <span className="fc-flip-hint">Tap to flip back</span>
                  </div>
                </div>
              </div>

              {flipped && (
                <motion.div className="fc-know-btns" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
                  <button className="fc-know-btn" style={{background:"#dc2626",boxShadow:"0 4px 12px rgba(220,38,38,.3)"}} onClick={()=>markKnown(false)}>😕 Still Learning</button>
                  <button className="fc-know-btn" style={{background:"#059669",boxShadow:"0 4px 12px rgba(5,150,105,.3)"}} onClick={()=>markKnown(true)}>✅ Got It!</button>
                </motion.div>
              )}

              <div className="fc-study-nav" style={{marginTop:12}}>
                <button className="fc-nav-btn" onClick={()=>{setCardIdx(i=>Math.max(0,i-1));setFlipped(false);}} disabled={cardIdx===0}>← Prev</button>
                <span className="fc-prog">{Math.round((cardIdx/cards.length)*100)}%</span>
                <button className="fc-nav-btn" onClick={()=>{setCardIdx(i=>Math.min(cards.length-1,i+1));setFlipped(false);}} disabled={cardIdx===cards.length-1}>Next →</button>
              </div>
            </motion.div>
          )}

          {/* Done mode */}
          {mode === "done" && deck && (
            <div className="fc-card">
              <div className="fc-done-wrap">
                <div className="fc-done-icon">🎉</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:900,color:"#0b1437",marginBottom:6}}>Session Complete!</div>
                <div style={{fontSize:13,color:"#64748b",marginBottom:18}}>You knew {known} out of {cards.length} cards.</div>
                <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                  <button style={{padding:"10px 20px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#7c3aed,#a855f7)",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={startStudy}>🔄 Study Again</button>
                  <button style={{padding:"10px 20px",borderRadius:12,border:"1.5px solid #e2e8f0",background:"#fff",color:"#64748b",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={()=>{resetDeck();}}>↺ Reset & Retry</button>
                  <button style={{padding:"10px 20px",borderRadius:12,border:"1.5px solid #e2e8f0",background:"#fff",color:"#64748b",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={()=>setMode("manage")}>← Back to Deck</button>
                </div>
              </div>
            </div>
          )}

          {/* Manage mode */}
          {mode === "manage" && (
            <>
              {/* Deck list */}
              <div className="fc-card">
                <span className="fc-sec">Your Decks</span>
                {decks.map(d=>(
                  <div key={d.id} className={`fc-deck-item${activeDeck===d.id?" active-deck":""}`} onClick={()=>setActiveDeck(d.id)}>
                    <div>
                      <div className="fc-deck-name">📚 {d.name}</div>
                      <div className="fc-deck-count">{d.cards.length} card{d.cards.length!==1?"s":""}</div>
                    </div>
                    <div className="fc-deck-actions" onClick={e=>e.stopPropagation()}>
                      {d.cards.length>0&&<button className="fc-deck-btn" style={{color:"#7c3aed",borderColor:"rgba(124,58,237,.2)"}} onClick={()=>{setActiveDeck(d.id);startStudy();}}>▶ Study</button>}
                      <button className={`fc-deck-btn fc-deck-del`} onClick={()=>removeDeck(d.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
                {showAdd?(
                  <div style={{display:"flex",gap:8,marginTop:8}}>
                    <input className="fc-input" style={{flex:1}} placeholder="Deck name e.g. Biology" value={newDeckName} onChange={e=>setNewDeckName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addDeck()} autoFocus />
                    <button style={{padding:"10px 14px",border:"none",borderRadius:10,background:"#0b1437",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={addDeck}>Add</button>
                    <button style={{padding:"10px 14px",border:"1.5px solid #e2e8f0",borderRadius:10,background:"#fff",color:"#64748b",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={()=>setShowAdd(false)}>✕</button>
                  </div>
                ):(
                  <button style={{width:"100%",marginTop:8,padding:"9px",border:"1.5px dashed #e2e8f0",borderRadius:11,background:"transparent",fontSize:13,fontWeight:700,color:"#94a3b8",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .13s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(124,58,237,.3)";e.currentTarget.style.color="#7c3aed";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.color="#94a3b8";}}
                    onClick={()=>setShowAdd(true)}>+ New Deck</button>
                )}
              </div>

              {/* Cards in selected deck */}
              {activeDeck && deck && (
                <div className="fc-card">
                  <span className="fc-sec">Cards in "{deck.name}"</span>

                  <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
                    <div>
                      <label className="fc-label">Front (Question)</label>
                      <textarea className="fc-textarea" placeholder="e.g. What is photosynthesis?" value={newFront} onChange={e=>setNewFront(e.target.value)} />
                    </div>
                    <div>
                      <label className="fc-label">Back (Answer)</label>
                      <textarea className="fc-textarea" placeholder="e.g. The process by which plants make food using sunlight..." value={newBack} onChange={e=>setNewBack(e.target.value)} />
                    </div>
                    <button className="fc-add-btn" onClick={addCard}>{editCardId?"💾 Update Card":"+ Add Card"}</button>
                  </div>

                  {deck.cards.map(c=>(
                    <div key={c.id} className="fc-card-item">
                      <div style={{flex:1,minWidth:0}}>
                        <div className="fc-card-front">Q: {c.front}</div>
                        <div className="fc-card-back">A: {c.back}</div>
                        {c.known&&<span style={{fontSize:9,fontWeight:800,color:"#059669",background:"rgba(5,150,105,.08)",padding:"1px 7px",borderRadius:99,marginTop:4,display:"inline-block"}}>✅ Known</span>}
                      </div>
                      <button className="fc-card-del" onClick={()=>removeCard(c.id)}>🗑️</button>
                    </div>
                  ))}

                  {deck.cards.length === 0 && (
                    <div style={{textAlign:"center",padding:"20px 0",color:"#94a3b8",fontSize:13}}>
                      No cards yet — add your first card above!
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="fc-cta">
              <div><h3>More Study Tools 🚀</h3><p>Pomodoro timer, Assignment tracker and more.</p></div>
              <Link to="/tools" className="fc-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}