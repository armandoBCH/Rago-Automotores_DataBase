
import React from 'react';

interface FilterBarProps {
    filters: {
        make: string;
        year: string;
        price: string;
    };
    onFilterChange: (filters: FilterBarProps['filters']) => void;
    brands: string[];
}

const FilterInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
        </label>
        <input {...props} id={props.name} className="w-full px-4 py-2 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rago-burgundy focus:border-transparent transition-colors" />
    </div>
);

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, brands }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };

    const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const cleanedValue = value.replace(/\D/g, ''); // Allow only digits
        onFilterChange({ ...filters, [name]: cleanedValue });
    };

    const resetFilters = () => {
        onFilterChange({ make: '', year: '', price: '' });
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label htmlFor="make" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Marca
                    </label>
                    <select
                        id="make"
                        name="make"
                        value={filters.make}
                        onChange={handleChange}
                        className="w-full px-4 py-2 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rago-burgundy focus:border-transparent transition-colors appearance-none bg-no-repeat bg-right pr-8"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                    >
                        <option value="">Todas</option>
                        {brands.map((brand) => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>

                <FilterInput
                    label="Año (desde)"
                    name="year"
                    type="text"
                    pattern="\d*"
                    inputMode="numeric"
                    placeholder="Ej: 2020"
                    value={filters.year}
                    onChange={handleNumericChange}
                />

                <FilterInput
                    label="Precio (hasta)"
                    name="price"
                    type="text"
                    pattern="\d*"
                    inputMode="numeric"
                    placeholder="Ej: 3000000"
                    value={filters.price}
                    onChange={handleNumericChange}
                />
                 <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                >
                    Limpiar Filtros
                </button>
            </div>
        </div>
    );
};

export default FilterBar;