'use client';

import React from 'react';

// =============================================================================
// Table Component - Standardized for PraxiomNotes
// =============================================================================

export interface Column<T> {
  key: string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  hoverable?: boolean;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  hoverable = true,
}: TableProps<T>) {
  return (
    <div className="w-full overflow-hidden bg-white rounded-xl border border-neutral-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-neutral-50/50 border-b border-neutral-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-2.5 font-semibold text-neutral-500 uppercase tracking-[0.2em] text-[10px] ${col.headerClassName || ''
                    } ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {data.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-neutral-500 italic"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr
                  key={item.id || rowIndex}
                  onClick={() => onRowClick?.(item)}
                  className={`
                    transition-all duration-200
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${hoverable ? 'hover:bg-neutral-50/80 hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]' : ''}
                  `}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-neutral-700 ${col.className || ''}`}
                    >
                      {col.render
                        ? col.render(item[col.key], item)
                        : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
