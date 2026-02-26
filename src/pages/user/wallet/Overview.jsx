import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase.js";

export default function WalletOverview() {
  const [loading, setLoading] = useState(true);
  const [txnLoading, setTxnLoading] = useState(true);
  const [coins, setCoins] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [msg, setMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

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
        .from("users_profiles")
        .select("total_aidla_coins")
        .eq("user_id", userId)
        .single();

      if (error) setMsg(error.message);
      else setCoins(data?.total_aidla_coins ?? 0);

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setTxnLoading(true);

      const { data: u } = await supabase.auth.getUser();
      const userId = u?.user?.id;
      if (!userId) {
        setTxnLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users_transactions")
        .select("txn_no, txn_type, direction, amount, balance_after, note, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) console.error("Transaction error:", error);
      else setTransactions(data || []);

      setTxnLoading(false);
    })();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(t => t.txn_type?.toLowerCase() === filterType.toLowerCase());
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.txn_no?.toLowerCase().includes(query) ||
        t.txn_type?.toLowerCase().includes(query) ||
        t.direction?.toLowerCase().includes(query) ||
        t.note?.toLowerCase().includes(query)
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, filterType]);

  // Get unique transaction types for filter dropdown
  const txnTypes = [...new Set(transactions.map(t => t.txn_type).filter(Boolean))];

  const css = `
    .overview-container {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .balance-card {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: white;
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(30, 58, 138, 0.2);
    }

    .balance-label {
      font-size: 0.9rem;
      font-weight: 700;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .balance-amount {
      font-size: 2.8rem;
      font-weight: 900;
      margin-top: 10px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .transactions-section {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .section-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: #1e3a8a;
      margin: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .see-all-link {
      font-size: 0.9rem;
      color: #3b82f6;
      text-decoration: none;
      font-weight: 700;
      transition: color 0.2s;
    }

    .see-all-link:hover {
      color: #1e3a8a;
      text-decoration: underline;
    }

    .search-filter-container {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 15px;
    }

    .search-input {
      flex: 1;
      min-width: 200px;
      padding: 10px 16px;
      border-radius: 12px;
      border: 2px solid #e2e8f0;
      background: #f8fafc;
      font-size: 0.95rem;
      font-weight: 600;
      transition: all 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      background: #ffffff;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .filter-select {
      padding: 10px 14px;
      border-radius: 12px;
      border: 2px solid #e2e8f0;
      background: #f8fafc;
      font-size: 0.95rem;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-select:focus {
      outline: none;
      border-color: #3b82f6;
      background: #ffffff;
    }

    .transactions-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 15px;
      border-radius: 16px;
    }

    .txn-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .txn-card:hover {
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.1);
      transform: translateY(-2px);
    }

    .txn-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
    }

    .txn-card-title {
      font-size: 0.9rem;
      font-weight: 800;
      color: #1e3a8a;
      word-break: break-all;
    }

    .txn-card-badge {
      flex-shrink: 0;
    }

    .txn-card-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .txn-card-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
    }

    .txn-card-label {
      color: #64748b;
      font-weight: 600;
    }

    .txn-card-value {
      color: #1e3a8a;
      font-weight: 700;
    }

    .txn-card-amount {
      font-size: 1.1rem;
      font-weight: 800;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
    }

    .txn-card-date {
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 600;
      text-align: right;
    }

    .transactions-table {
      width: 100%;
      overflow-x: auto;
      border-radius: 16px;
      background: #f8fafc;
      box-shadow: inset 2px 2px 5px rgba(15, 23, 42, 0.02);
      display: none;
    }

    @media (max-width: 900px) {
      .transactions-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 12px;
      }

      .txn-card {
        padding: 14px;
      }
    }

    @media (max-width: 768px) {
      .transactions-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 10px;
      }

      .txn-card {
        padding: 12px;
        gap: 10px;
      }

      .txn-card-title {
        font-size: 0.85rem;
      }

      .txn-card-row {
        font-size: 0.8rem;
      }

      .txn-card-amount {
        font-size: 1rem;
      }
    }

    @media (max-width: 600px) {
      .transactions-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .txn-card {
        padding: 12px;
      }

      .txn-card-title {
        font-size: 0.8rem;
      }

      .txn-card-row {
        font-size: 0.75rem;
      }

      .txn-card-amount {
        font-size: 0.95rem;
      }
    }

    .txn-type-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      flex-shrink: 0;
    }

    .txn-type-deposit {
      background: #dcfce7;
      color: #15803d;
    }

    .txn-type-withdraw {
      background: #fee2e2;
      color: #b91c1c;
    }

    .txn-type-referral {
      background: #fef3c7;
      color: #92400e;
    }

    .txn-type-mining {
      background: #dbeafe;
      color: #0c4a6e;
    }

    .amount-positive {
      color: #15803d;
      font-weight: 800;
    }

    .amount-negative {
      color: #b91c1c;
      font-weight: 800;
    }

    .empty-state {
      text-align: center;
      padding: 30px;
      color: #64748b;
      font-weight: 600;
    }

    .loading-state {
      text-align: center;
      padding: 30px;
      color: #64748b;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .overview-container {
        gap: 20px;
      }

      .balance-card {
        padding: 20px;
        border-radius: 16px;
      }

      .balance-label {
        font-size: 0.85rem;
      }

      .balance-amount {
        font-size: 2rem;
      }

      .section-title {
        font-size: 1.2rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .see-all-link {
        font-size: 0.85rem;
      }

      .search-filter-container {
        flex-direction: column;
        gap: 10px;
        margin-bottom: 12px;
      }

      .search-input {
        min-width: 100%;
        padding: 9px 14px;
        font-size: 0.9rem;
        border-radius: 10px;
      }

      .filter-select {
        width: 100%;
        padding: 9px 12px;
        font-size: 0.9rem;
        border-radius: 10px;
      }

      .transactions-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 10px;
      }

      .txn-card {
        padding: 12px;
      }

      .empty-state {
        padding: 20px;
      }

      .loading-state {
        padding: 20px;
      }
    }

    @media (max-width: 600px) {
      .overview-container {
        gap: 15px;
      }

      .balance-card {
        padding: 16px;
        border-radius: 14px;
        box-shadow: 0 8px 20px rgba(30, 58, 138, 0.15);
      }

      .balance-label {
        font-size: 0.8rem;
      }

      .balance-amount {
        font-size: 1.8rem;
        margin-top: 8px;
      }

      .transactions-section {
        gap: 10px;
      }

      .section-title {
        font-size: 1rem;
        gap: 6px;
      }

      .see-all-link {
        font-size: 0.8rem;
      }

      .search-filter-container {
        gap: 8px;
        margin-bottom: 10px;
      }

      .search-input {
        padding: 8px 12px;
        font-size: 0.85rem;
        border-radius: 9px;
      }

      .filter-select {
        padding: 8px 12px;
        font-size: 0.85rem;
        border-radius: 9px;
      }

      .transactions-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .txn-card {
        padding: 12px;
      }

      .txn-card-title {
        font-size: 0.8rem;
      }

      .txn-card-row {
        font-size: 0.75rem;
      }

      .txn-card-amount {
        font-size: 0.95rem;
      }

      .amount-positive, .amount-negative {
        font-size: 0.85rem;
      }

      .empty-state {
        padding: 15px;
        font-size: 0.9rem;
      }

      .loading-state {
        padding: 15px;
        font-size: 0.9rem;
      }
    }
  `;

  return (
    <div className="overview-container">
      <style>{css}</style>

      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-label">Your Total Balance</div>
        <div className="balance-amount">
          {loading ? "Loading..." : `${Number(coins || 0).toLocaleString()} AIDLA`}
        </div>
        {msg && <div style={{ color: "#fca5a5", marginTop: 12 }}>{msg}</div>}
      </div>

      {/* Transactions Section */}
      <div className="transactions-section">
        <h3 className="section-title">
          Latest Transactions
          <a href="/user/wallet/transactions" className="see-all-link">See All →</a>
        </h3>

        {/* Search & Filter */}
        <div className="search-filter-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search transaction no, type, note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            {txnTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Transactions Grid */}
        {txnLoading ? (
          <div className="loading-state">Loading transactions...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="empty-state">No transactions found</div>
        ) : (
          <div className="transactions-grid">
            {filteredTransactions.slice(0, 4).map((txn) => (
              <div key={txn.txn_no} className="txn-card">
                <div className="txn-card-header">
                  <div className="txn-card-title">{txn.txn_no}</div>
                  <span className={`txn-type-badge txn-type-${txn.txn_type?.toLowerCase()}`}>
                    {txn.txn_type}
                  </span>
                </div>

                <div className="txn-card-body">
                  <div className="txn-card-row">
                    <span className="txn-card-label">Direction:</span>
                    <span className="txn-card-value">{txn.direction}</span>
                  </div>

                  <div className="txn-card-row">
                    <span className="txn-card-label">Balance After:</span>
                    <span className="txn-card-value">{Number(txn.balance_after).toLocaleString()}</span>
                  </div>

                  <div className={`txn-card-amount ${txn.direction === "receive" ? "amount-positive" : "amount-negative"}`}>
                    {txn.direction === "receive" ? "+" : "-"}{Number(txn.amount).toLocaleString()} AIDLA
                  </div>

                  <div className="txn-card-date">
                    {new Date(txn.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}