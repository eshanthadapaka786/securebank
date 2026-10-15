import React from 'react';
import { SPENDING_BY_CATEGORY, formatINR } from '../data/mockData';

export default function SpendingChart({ onSelectCategory }) {
  const totalSpending = SPENDING_BY_CATEGORY.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="chart-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Total Monthly Outflow:
        </span>
        <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--blue-dark)' }}>
          {formatINR(totalSpending)}
        </span>
      </div>

      <div className="chart-bars-wrap">
        {SPENDING_BY_CATEGORY.map((item) => (
          <div 
            key={item.category} 
            className="chart-bar-item"
            style={{ cursor: onSelectCategory ? 'pointer' : 'default' }}
            onClick={() => onSelectCategory && onSelectCategory(item.category)}
            title={`Click to filter ${item.category} transactions`}
          >
            <div className="chart-bar-header">
              <span className="chart-bar-category">
                <span className="category-dot" style={{ backgroundColor: item.color }}></span>
                {item.category}
              </span>
              <span className="chart-bar-val">
                {formatINR(item.amount)}{' '}
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.78rem' }}>
                  ({item.percentage}%)
                </span>
              </span>
            </div>

            <div className="chart-bar-track">
              <div
                className="chart-bar-fill"
                style={{
                  width: `${(item.amount / 25000) * 100}%`,
                  backgroundColor: item.color
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
