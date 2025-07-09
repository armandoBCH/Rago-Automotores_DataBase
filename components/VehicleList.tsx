
import React from 'react';
import { Vehicle } from '../types';
import VehicleCard from './VehicleCard';

interface VehicleListProps {
    vehicles: Vehicle[];
    onVehicleClick: (vehicle: Vehicle) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, onVehicleClick }) => {
    if (vehicles.length === 0) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No se encontraron vehículos</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Intenta ajustar los filtros de búsqueda.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} onClick={() => onVehicleClick(vehicle)} />
            ))}
        </div>
    );
};

export default VehicleList;
