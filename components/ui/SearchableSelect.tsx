
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Option {
    code: string;
    name_with_type: string;
}

interface SearchableSelectProps {
    label: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    label,
    options,
    value,
    onChange,
    placeholder = "Chọn...",
    disabled = false,
    loading = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get selected item object to display name
    const selectedItem = options.find(opt => opt.code === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter options based on search term (removing accents for better VN search)
    const removeAccents = (str: string) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const filteredOptions = options.filter(opt => 
        removeAccents(opt.name_with_type).includes(removeAccents(searchTerm))
    );

    const handleSelect = (code: string) => {
        onChange(code);
        setIsOpen(false);
        setSearchTerm(''); // Reset search
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{label}</label>
            
            {/* Trigger Button */}
            <div 
                className={`
                    w-full h-12 border flex items-center justify-between px-4 text-sm bg-[#f9f9f9] transition-colors
                    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'cursor-pointer hover:border-gray-400 bg-white'}
                    ${isOpen ? 'border-black' : 'border-gray-200'}
                `}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={`${selectedItem ? 'text-black' : 'text-gray-400'}`}>
                    {selectedItem ? selectedItem.name_with_type : (loading ? "Đang tải..." : placeholder)}
                </span>
                <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-xl max-h-60 flex flex-col animate-fade-in">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                autoFocus
                                className="w-full bg-gray-50 border border-gray-200 rounded pl-8 pr-8 py-2 text-sm outline-none focus:border-black transition-colors"
                                placeholder="Nhập để tìm kiếm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-2 top-2.5 text-gray-400 hover:text-black"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Options List */}
                    <ul className="flex-1 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <li 
                                    key={opt.code}
                                    onClick={() => handleSelect(opt.code)}
                                    className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${value === opt.code ? 'bg-gray-100 font-bold' : 'text-gray-700'}`}
                                >
                                    {opt.name_with_type}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-3 text-sm text-gray-400 text-center">
                                Không tìm thấy kết quả "{searchTerm}"
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
