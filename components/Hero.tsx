
import React from 'react';

interface HeroProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

const Hero: React.FC<HeroProps> = ({ searchTerm, onSearchChange }) => {

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // La búsqueda es en vivo, por lo que el envío del formulario no necesita hacer nada especial.
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto text-center py-12 px-6 md:py-16 md:px-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Nuestro Catálogo de Vehículos
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    Encuentra el auto perfecto para ti. Calidad y confianza en cada kilómetro.
                </p>

                <div className="mt-8 max-w-2xl mx-auto">
                    <form onSubmit={handleFormSubmit} className="bg-slate-200 dark:bg-gray-800/60 p-2 rounded-2xl flex gap-2 shadow-inner">
                        <input
                            type="text"
                            placeholder="¿Qué vehículo buscas?"
                            aria-label="¿Qué vehículo buscas?"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full flex-grow px-5 py-4 text-lg bg-white dark:bg-gray-900 border-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-rago-burgundy rounded-xl transition"
                        />
                        <button
                            type="submit"
                            className="px-8 py-4 text-lg font-bold text-white bg-rago-burgundy rounded-xl hover:bg-rago-burgundy-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-200 dark:focus:ring-offset-gray-800 focus:ring-rago-burgundy-darker transition-colors"
                        >
                            Buscar!
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Hero;