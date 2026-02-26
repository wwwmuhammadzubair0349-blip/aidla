export default function WalletWithdraw() {
  const css = `
    .withdraw-wrapper h3 {
      margin-top: 0;
      font-size: 1.4rem;
      color: #1e3a8a;
    }

    @media (max-width: 768px) {
      .withdraw-wrapper h3 {
        font-size: 1.2rem;
      }
    }

    @media (max-width: 600px) {
      .withdraw-wrapper h3 {
        font-size: 1rem;
      }
    }
  `;

  return (
    <div className="withdraw-wrapper">
      <style>{css}</style>
      <h3>Withdraw</h3>
      <p style={{ color: "var(--muted)" }}>Coming soon...</p>
    </div>
  );
}