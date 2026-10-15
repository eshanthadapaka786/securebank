import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_TRANSACTIONS, CATEGORY_OPTIONS, formatINR } from '../data/mockData';

export default function Transactions({ initialCategoryFilter = 'all' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);
  const [prevInitialCategory, setPrevInitialCategory] = useState(initialCategoryFilter);
  const [dateFilter, setDateFilter] = useState('all');
  const [amountSort, setAmountSort] = useState('default');
  const [selectedTx, setSelectedTx] = useState(null);

  // Sync state if initialCategoryFilter changes
  if (initialCategoryFilter !== prevInitialCategory) {
    setPrevInitialCategory(initialCategoryFilter);
    if (initialCategoryFilter && initialCategoryFilter !== 'all') {
      setCategoryFilter(initialCategoryFilter);
    }
  }

  // Compute filtered & sorted list
  const filteredTransactions = useMemo(() => {
    let list = [...INITIAL_TRANSACTIONS];

    // 1. Merchant & ID search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((tx) =>
        tx.merchant.toLowerCase().includes(q) ||
        tx.id.toLowerCase().includes(q) ||
        tx.description.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q)
      );
    }

    // 2. Category filtering
    if (categoryFilter && categoryFilter !== 'all' && categoryFilter !== 'All Categories') {
      list = list.filter((tx) => tx.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // 3. Date filtering
    if (dateFilter !== 'all') {
      if (dateFilter === 'last-7-days') {
        list = list.filter((tx) => tx.date >= '2026-10-09');
      } else if (dateFilter === 'last-14-days') {
        list = list.filter((tx) => tx.date >= '2026-10-02');
      } else if (dateFilter === 'oct-2026') {
        list = list.filter((tx) => tx.date.startsWith('2026-10'));
      } else if (dateFilter === 'sep-2026') {
        list = list.filter((tx) => tx.date.startsWith('2026-09'));
      }
    }

    // 4. Amount Sorting
    if (amountSort === 'asc') {
      list.sort((a, b) => a.amount - b.amount);
    } else if (amountSort === 'desc') {
      list.sort((a, b) => b.amount - a.amount);
    } else {
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return list;
  }, [searchQuery, categoryFilter, dateFilter, amountSort]);

  // Notify window event for AITHOS agent hooks
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('aithos:transaction-filter-changed', {
          detail: {
            currency: 'INR',
            search: searchQuery,
            category: categoryFilter,
            dateFilter,
            amountSort,
            resultCount: filteredTransactions.length
          }
        })
      );
    }
  }, [searchQuery, categoryFilter, dateFilter, amountSort, filteredTransactions.length]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setDateFilter('all');
    setAmountSort('default');
  };

  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    (categoryFilter !== 'all' && categoryFilter !== 'All Categories') || 
    dateFilter !== 'all' || 
    amountSort !== 'default';

  // Compute aggregate statistics for the filtered subset in INR
  const totalDebits = filteredTransactions
    .filter((tx) => tx.type === 'debit')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalCredits = filteredTransactions
    .filter((tx) => tx.type === 'credit')
    .reduce((acc, tx) => acc + tx.amount, 0);

  return (
    <div className="content-body animate-fade-in">
      {/* Search & Filter Claymorphic Control Bar */}
      <div className="clay-card filters-clay-card">
        <div className="filters-row">
          {/* #search-transactions */}
          <div className="filter-input-wrap">
            <span className="filter-input-icon" aria-hidden="true">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              id="search-transactions"
              type="text"
              className="clay-input"
              placeholder="Search merchant, ID, or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search transactions"
            />
          </div>

          {/* #category-filter */}
          <div>
            <select
              id="category-filter"
              className="clay-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {CATEGORY_OPTIONS.filter((c) => c !== 'All Categories').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* #date-filter */}
          <div>
            <select
              id="date-filter"
              className="clay-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              aria-label="Filter by date"
            >
              <option value="all">All Dates (20 records)</option>
              <option value="last-7-days">Last 7 Days (Oct 9 - 15)</option>
              <option value="last-14-days">Last 14 Days (Oct 2 - 15)</option>
              <option value="oct-2026">October 2026</option>
              <option value="sep-2026">September 2026</option>
            </select>
          </div>

          {/* #sort-by-amount */}
          <div>
            <select
              id="sort-by-amount"
              className="clay-select"
              value={amountSort}
              onChange={(e) => setAmountSort(e.target.value)}
              aria-label="Sort by amount"
            >
              <option value="default">Sort: Default (Date)</option>
              <option value="desc">Amount: High to Low (₹₹₹ → ₹)</option>
              <option value="asc">Amount: Low to High (₹ → ₹₹₹)</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          <div>
            <button
              type="button"
              className="clay-btn-secondary"
              onClick={handleResetFilters}
              disabled={!hasActiveFilters}
              style={{
                opacity: hasActiveFilters ? 1 : 0.6,
                cursor: hasActiveFilters ? 'pointer' : 'default',
                whiteSpace: 'nowrap'
              }}
              title="Reset all search and filter fields"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Filter Summary Metrics Strip */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: '16px', 
            paddingTop: '14px', 
            borderTop: '1px solid rgba(215, 228, 245, 0.7)',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Showing <strong>{filteredTransactions.length}</strong> of <strong>{INITIAL_TRANSACTIONS.length}</strong> records
            </span>
            {hasActiveFilters && (
              <span className="badge-pill badge-blue" style={{ fontSize: '0.72rem' }}>
                Filtered View
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.84rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Inflow: <strong style={{ color: 'var(--status-credit)' }}>+{formatINR(totalCredits)}</strong>
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              Outflow: <strong style={{ color: 'var(--blue-dark)' }}>-{formatINR(totalDebits)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Transactions Table Card */}
      <div className="clay-card table-card">
        <div className="table-header-bar">
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>INR Ledger Records</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Semantic table with stable selectors and <code>data-transaction-id</code> hooks
            </p>
          </div>

          <button
            type="button"
            className="clay-btn-secondary"
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
            onClick={() => {
              if (window.AITHOS_BANK_API) {
                const data = window.AITHOS_BANK_API.getTransactions({
                  category: categoryFilter,
                  search: searchQuery,
                  sort: amountSort
                });
                navigator.clipboard?.writeText(JSON.stringify(data, null, 2));
                alert(`Copied ${data.length} sanitized transaction records in INR to clipboard.`);
              }
            }}
            title="Copies sanitized read-only JSON for agent validation"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            <span>Copy JSON for Agent</span>
          </button>
        </div>

        <div className="table-responsive">
          {/* #transactions-table */}
          <table id="transactions-table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Date</th>
                <th scope="col">Merchant & Details</th>
                <th scope="col">Category</th>
                <th scope="col">Vehicle / Mandate</th>
                <th scope="col">Type</th>
                <th scope="col" style={{ textAlign: 'right' }}>Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr 
                    key={tx.id} 
                    data-transaction-id={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    style={{ cursor: 'pointer' }}
                    title={`Click to inspect details for ${tx.id}`}
                  >
                    <td>
                      <span className="tx-id-badge">{tx.id}</span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {tx.date}
                    </td>
                    <td>
                      <div className="merchant-cell">
                        <span className="merchant-name">{tx.merchant}</span>
                        <span className="merchant-desc">{tx.description}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge-pill badge-blue" style={{ fontSize: '0.74rem' }}>
                        {tx.category}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {tx.paymentMethod}
                    </td>
                    <td>
                      <span className={`badge-pill ${tx.type === 'credit' ? 'badge-credit' : 'badge-debit'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="amount-cell">
                      <span className={tx.type === 'credit' ? 'amount-credit' : 'amount-debit'}>
                        {tx.type === 'credit' ? '+' : '-'}{formatINR(tx.amount)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <div style={{ color: 'var(--text-muted)' }}>
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.3-4.3" />
                        </svg>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--blue-dark)' }}>
                        No transactions match your current filters
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '400px' }}>
                        Try clearing or adjusting the search query, category dropdown, or date filter.
                      </p>
                      <button
                        type="button"
                        className="clay-btn-primary"
                        style={{ marginTop: '8px' }}
                        onClick={handleResetFilters}
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Inspector Modal */}
      {selectedTx && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(9, 30, 66, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}
          onClick={() => setSelectedTx(null)}
        >
          <div 
            className="clay-card animate-fade-in"
            style={{ maxWidth: '480px', width: '100%', padding: '32px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span className="tx-id-badge" style={{ fontSize: '0.85rem' }}>{selectedTx.id}</span>
                <h3 style={{ fontSize: '1.25rem', marginTop: '6px', color: 'var(--blue-dark)' }}>{selectedTx.merchant}</h3>
              </div>
              <button
                type="button"
                className="clay-btn-secondary"
                style={{ padding: '6px 12px' }}
                onClick={() => setSelectedTx(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="clay-inset" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Amount (INR) & Settlement</div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: selectedTx.type === 'credit' ? 'var(--status-credit)' : 'var(--blue-dark)' }}>
                  {selectedTx.type === 'credit' ? '+' : '-'}{formatINR(selectedTx.amount)}
                </div>
                <div style={{ marginTop: '6px', display: 'flex', gap: '8px' }}>
                  <span className={`badge-pill ${selectedTx.type === 'credit' ? 'badge-credit' : 'badge-debit'}`}>
                    {selectedTx.type.toUpperCase()}
                  </span>
                  <span className="badge-pill badge-blue">
                    {selectedTx.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-label">Value Date</span>
                <span className="detail-value">{selectedTx.date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Spending Category</span>
                <span className="detail-value">{selectedTx.category}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Channel / Mandate</span>
                <span className="detail-value">{selectedTx.paymentMethod}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Ledger Memo</span>
                <span className="detail-value">{selectedTx.description}</span>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <button
                type="button"
                className="clay-btn-primary"
                style={{ width: '100%' }}
                onClick={() => setSelectedTx(null)}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
