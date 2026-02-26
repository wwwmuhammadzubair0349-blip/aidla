import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase.js";

export default function WalletTransactions() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      setMsg("");
      setLoading(true);

      const { data: u } = await supabase.auth.getUser();
      const userId = u?.user?.id;
      if (!userId) {
        setMsg("Not logged in.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users_transactions")
        .select("txn_no, txn_type, direction, amount, balance_before, balance_after, note, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) setMsg(error.message);
      else setRows(data || []);

      setLoading(false);
    })();
  }, []);

  const css = `
    .transactions-wrapper h3 {
      margin-top: 0;
      font-size: 1.4rem;
      color: #1e3a8a;
    }

    .txn-msg {
      color: #ffb4b4;
      font-weight: 600;
    }

    .txn-empty {
      color: var(--muted);
      font-weight: 600;
    }

    .txn-loading {
      color: var(--muted);
      font-weight: 600;
    }

    .txn-table-container {
      overflow-x: auto;
      border-radius: 16px;
      background: #f8fafc;
      box-shadow: inset 2px 2px 5px rgba(15, 23, 42, 0.02);
    }

    .txn-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }

    .txn-table th {
      background: #e2e8f0;
      color: #1e3a8a;
      padding: 12px 14px;
      text-align: left;
      font-weight: 800;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #cbd5e1;
    }

    .txn-table td {
      padding: 12px 14px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
      font-weight: 500;
    }

    .txn-table tr:last-child td {
      border-bottom: none;
    }

    .txn-table tr:hover td {
      background: rgba(59, 130, 246, 0.05);
    }

    @media (max-width: 768px) {
      .transactions-wrapper h3 {
        font-size: 1.2rem;
      }

      .txn-table th {
        padding: 10px 11px;
        font-size: 0.8rem;
      }

      .txn-table td {
        padding: 10px 11px;
        font-size: 0.85rem;
      }
    }

    @media (max-width: 600px) {
      .transactions-wrapper h3 {
        font-size: 1rem;
      }

      .txn-table-container {
        border-radius: 12px;
      }

      .txn-table {
        font-size: 0.8rem;
      }

      .txn-table th {
        padding: 8px 9px;
        font-size: 0.7rem;
      }

      .txn-table td {
        padding: 8px 9px;
        font-size: 0.75rem;
      }
    }
  `;

  return (
    <div className="transactions-wrapper">
      <style>{css}</style>
      <h3>Transactions</h3>

      {loading ? <div className="txn-loading">Loading...</div> : null}
      {msg ? <div className="txn-msg">{msg}</div> : null}

      {!loading && !rows.length ? (
        <div className="txn-empty">No transactions yet.</div>
      ) : null}

      {!!rows.length && (
        <div className="txn-table-container">
          <table className="txn-table">
            <thead>
              <tr>
                <th>Txn</th>
                <th>Type</th>
                <th>Dir</th>
                <th>Amount</th>
                <th>After</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.txn_no}>
                  <td style={{ fontFamily: "monospace" }}>{r.txn_no}</td>
                  <td>{r.txn_type}</td>
                  <td>{r.direction}</td>
                  <td>{r.amount}</td>
                  <td>{r.balance_after}</td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}