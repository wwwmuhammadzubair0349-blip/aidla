// app/user/wallet/withdraw/page.jsx
// Converted from React Router WalletWithdraw.jsx
// Changes: "use client" directive only — no navigation needed

"use client";

const css = `
  .withdraw-wrapper h2{margin-top:0;font-size:1.4rem;color:#1e3a8a;font-weight:800}
  @media(max-width:768px){.withdraw-wrapper h2{font-size:1.2rem}}
  @media(max-width:600px){.withdraw-wrapper h2{font-size:1rem}}
`;

export default function WalletWithdraw() {
  return (
    <div className="withdraw-wrapper">
      <style>{css}</style>
      <h2>Withdraw</h2>
      <p style={{ color:"#64748b", marginTop:8 }}>Coming soon…</p>
    </div>
  );
}