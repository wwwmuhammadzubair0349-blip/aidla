export default function WalletDeposit() {
  const css = `
    .deposit-wrapper h3 {
      margin-top: 0;
      font-size: 1.4rem;
      color: #1e3a8a;
    }

    @media (max-width: 768px) {
      .deposit-wrapper h3 {
        font-size: 1.2rem;
      }
    }

    @media (max-width: 600px) {
      .deposit-wrapper h3 {
        font-size: 1rem;
      }
    }
  `;

  return (
    <div className="deposit-wrapper">
      <style>{css}</style>
      <h3>Deposit</h3>
      <p style={{ color: "var(--muted)" }}>Coming soon...</p>
    </div>
  );
}