import type { Database } from './lib/database.types';

export type Vehicle = Database['public']['Tables']['vehicles']['Row'];
export type VehicleInsert = Database['public']['Tables']['vehicles']['Insert'];
export type VehicleUpdate = Database['public']['Tables']['vehicles']['Update'];

// Data type for the vehicle form.
// It is based on the Insert type from Supabase, omitting `created_at`
// which is managed by the database. The `Insert` type already defines `id` as optional,
// which is suitable for both creating and editing vehicles.
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
