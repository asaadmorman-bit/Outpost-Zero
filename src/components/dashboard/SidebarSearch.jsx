import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, ChevronRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

export default function SidebarSearch({ navigationGroups }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm.length < 2) {
            setResults([]);
            setShowResults(false);
            return;
        }

        const allPages = navigationGroups.flatMap(group => 
            group.items.map(item => ({
                ...item,
                groupName: group.name
            }))
        );

        const filtered = allPages.filter(page =>
            page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            page.groupName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setResults(filtered.slice(0, 5));
        setShowResults(true);
    }, [searchTerm, navigationGroups]);

    const handleResultClick = (page) => {
        navigate(page.href);
        setSearchTerm('');
        setShowResults(false);
    };

    return (
        <div className="relative px-4 py-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search pages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white text-sm"
                />
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute top-full left-4 right-4 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                    {results.map((result, index) => {
                        const IconComponent = result.icon;
                        return (
                            <button
                                key={index}
                                onClick={() => handleResultClick(result)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700/50 transition-colors text-left"
                            >
                                <IconComponent className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-white font-medium">{result.name}</div>
                                    <div className="text-xs text-gray-500">{result.groupName}</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
                        );
                    })}
                </div>
            )}

            {showResults && results.length === 0 && searchTerm.length >= 2 && (
                <div className="absolute top-full left-4 right-4 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 p-4">
                    <p className="text-sm text-gray-400 text-center">No pages found</p>
                </div>
            )}
        </div>
    );
}