// app/user/wallet/deposit/page.jsx
// Converted from React Router WalletDeposit.jsx
// Changes: "use client" directive only

"use client";

const css = `
  .deposit-wrapper h2{margin-top:0;font-size:1.4rem;color:#1e3a8a;font-weight:800}
  @media(max-width:768px){.deposit-wrapper h2{font-size:1.2rem}}
  @media(max-width:600px){.deposit-wrapper h2{font-size:1rem}}
`;

export default function WalletDeposit() {
  return (
    <div className="deposit-wrapper">
      <style>{css}</style>
      <h2>Deposit</h2>
      <p style={{ color:"#64748b", marginTop:8 }}>Coming soon…</p>
    </div>
  );
}