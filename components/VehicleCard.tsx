import React, { useState } from 'react';
import { Vehicle } from '../types';
import { optimizeUrl } from '../utils/image';

interface VehicleCardProps {
    vehicle: Vehicle;
    onClick: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onClick }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const imageSrc = vehicle.images?.[0] || '';

    const placeholderUrl = optimizeUrl(imageSrc, { w: 20, h: 15, fit: 'cover', blur: 2, output: 'webp' });
    const srcSet = [400, 600, 800, 1200]
        .map(w => `${optimizeUrl(imageSrc, { w, h: Math.round(w * 0.75), fit: 'cover', output: 'webp', q: 75 })} ${w}w`)
        .join(', ');

    return (
        <div 
            className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 group"
        >
            <div 
                className="w-full aspect-[4/3] overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: `url(${placeholderUrl})` }}
            >
                <img 
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    src={optimizeUrl(imageSrc, { w: 800, h: 600, fit: 'cover', output: 'webp', q: 75 })}
                    srcSet={srcSet}
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
                    alt={`${vehicle.make} ${vehicle.model}`} 
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setIsLoaded(true)}
                />
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-baseline justify-between gap-x-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white truncate min-w-0">{vehicle.make} {vehicle.model}</h3>
                    <span className="text-sm font-semibold inline-block py-1 px-3 uppercase rounded-full text-rago-burgundy bg-rago-burgundy/10 dark:bg-gray-700 dark:text-gray-300 flex-shrink-0">
                        {vehicle.year}
                    </span>
                </div>
                
                <div className="flex-grow my-3">
                    <p className="text-4xl font-bold text-rago-burgundy">
                        ${vehicle.price.toLocaleString()}
                    </p>
                </div>
                <div className="flex justify-between items-center text-lg text-gray-600 dark:text-gray-300">
                    <span>{vehicle.mileage.toLocaleString()} km</span>
                    <span>{vehicle.transmission}</span>
                </div>
                 <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
                    <button 
                        onClick={onClick}
                        className="w-full text-center px-4 py-3 text-lg font-semibold text-white bg-rago-burgundy rounded-lg hover:bg-rago-burgundy-darker focus:outline-none focus:ring-2 focus:ring-rago-burgundy/50 transition-all duration-300"
                    >
                        Ver detalles
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;
