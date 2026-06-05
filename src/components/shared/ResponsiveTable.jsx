import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ResponsiveTable({ 
    columns, 
    data, 
    onRowClick,
    emptyMessage = 'No data available',
    className = ''
}) {
    if (!data || data.length === 0) {
        return (
            <Card className={`bg-gray-800/50 border-gray-700 ${className}`}>
                <CardContent className="p-8 text-center">
                    <p className="text-gray-400">{emptyMessage}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700">
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                                    style={{ width: column.width }}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={`${onRowClick ? 'cursor-pointer hover:bg-gray-800/50' : ''} transition-colors`}
                            >
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="px-4 py-4 text-sm text-gray-300">
                                        {column.render ? column.render(row) : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {data.map((row, rowIndex) => (
                    <Card
                        key={rowIndex}
                        onClick={() => onRowClick && onRowClick(row)}
                        className={`bg-gray-800/50 border-gray-700 ${onRowClick ? 'cursor-pointer active:bg-gray-800' : ''}`}
                    >
                        <CardContent className="p-4">
                            {columns.map((column, colIndex) => (
                                <div key={colIndex} className="mb-2 last:mb-0">
                                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                        {column.header}
                                    </div>
                                    <div className="text-sm text-gray-300">
                                        {column.render ? column.render(row) : row[column.key]}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}