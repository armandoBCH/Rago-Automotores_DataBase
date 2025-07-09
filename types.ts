import type { Database } from './lib/database.types';

export type Vehicle = Database['public']['Tables']['vehicles']['Row'];
export type VehicleInsert = Database['public']['Tables']['vehicles']['Insert'];
export type VehicleUpdate = Database['public']['Tables']['vehicles']['Update'];

// Data type for the vehicle form.
// It is now a direct alias for the VehicleInsert type from Supabase.
// The `Insert` type already defines `id` as optional,
// which is suitable for both creating and editing vehicles. `created_at` is also
// optional and will be handled by the database, so it does not need to be provided by the form.
export type VehicleFormData = VehicleInsert;
