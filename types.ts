
import type { Database } from './lib/database.types';

export type Vehicle = Database['public']['Tables']['vehicles']['Row'];
export type VehicleInsert = Database['public']['Tables']['vehicles']['Insert'];
export type VehicleUpdate = Database['public']['Tables']['vehicles']['Update'];

// Data type for the vehicle form.
// Manually defined to be structurally compatible with VehicleInsert but without `created_at`.
// This avoids complex type inference issues with Omit<> that can cause compiler errors.
export type VehicleFormData = {
    id?: number;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    engine: string;
    transmission: 'Automática' | 'Manual';
    fuelType: string;
    description: string;
    images: string[];
};
