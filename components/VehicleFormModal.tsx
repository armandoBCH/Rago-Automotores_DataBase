import React, { useState, useEffect, useMemo } from 'react';
import { Vehicle, VehicleFormData } from '../types';
import { XIcon, PlusIcon, TrashIcon, UpIcon, DownIcon, ShieldIcon, TagIcon, CalendarIcon, GaugeIcon, CogIcon, SlidersIcon, GasPumpIcon } from '../constants';
import VehicleCard from './VehicleCard';
import ImageCarousel from './ImageCarousel';
import { optimizeUrl } from '../utils/image';

// The form's internal state. `id` is present for edits. Numeric fields are strings.
type FormState = {
    id?: number;
    make: string;
    model: string;
    year: string;
    price: string;
    mileage: string;
    engine: string;
    transmission: 'Automática' | 'Manual';
    fuelType: string;
    customFuelType: string;
    description: string;
    images: string[];
};

const DRAFT_STORAGE_KEY = 'rago-new-vehicle-draft';

const getInitialFormState = (): FormState => ({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    engine: '',
    transmission: 'Manual',
    fuelType: 'Nafta',
    customFuelType: '',
    description: '',
    images: [''],
});

const ImagePreview: React.FC<{ url: string }> = ({ url }) => {
    const optimizedSrc = optimizeUrl(url, { w: 80, h: 64, fit: 'cover', output: 'webp' });
    const isPlaceholder = optimizedSrc.includes('i.imgur.com/g2a4A0a.png');

    if (!url?.trim()) {
        return <div className="w-20 h-16 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 text-center p-1">URL Vacía</div>;
    }
    
    // Show error only if URL is not empty but results in a placeholder
    if (isPlaceholder && url.trim().startsWith('http')) {
        return <div className="w-20 h-16 rounded bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-xs text-red-500 text-center leading-tight p-1">URL Inválida</div>;
    }

    return (
        <img
            src={optimizedSrc}
            alt="Previsualización"
            className="w-20 h-16 object-cover rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
            loading="lazy"
            decoding="async"
        />
    );
};

interface VehicleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (vehicle: VehicleFormData) => void;
    initialData?: Vehicle;
    brands: string[];
}

const VehicleFormModal: React.FC<VehicleFormModalProps> = ({ isOpen, onClose, onSubmit, initialData, brands }) => {
    const [formData, setFormData] = useState<FormState>(getInitialFormState());
    const [previewMode, setPreviewMode] = useState<'card' | 'detail'>('card');
    
    const isOtherFuelType = formData.fuelType === 'Otro';

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            // EDITING MODE: Clear any draft and populate from initialData
            localStorage.removeItem(DRAFT_STORAGE_KEY);
            const standardFuelTypes = ['Nafta', 'Diesel', 'GNC'];
            const isStandard = standardFuelTypes.includes(initialData.fuelType);
            
            setFormData({
                id: initialData.id,
                make: initialData.make,
                model: initialData.model,
                engine: initialData.engine,
                transmission: initialData.transmission,
                description: initialData.description,
                images: initialData.images,
                year: String(initialData.year),
                price: String(initialData.price),
                mileage: String(initialData.mileage),
                fuelType: isStandard ? initialData.fuelType : 'Otro',
                customFuelType: isStandard ? '' : initialData.fuelType,
            });
        } else {
            // NEW VEHICLE MODE: Try to load from draft in localStorage
            const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
            if (savedDraft) {
                setFormData(JSON.parse(savedDraft));
            } else {
                const emptyState = getInitialFormState();
                emptyState.year = String(new Date().getFullYear());
                setFormData(emptyState);
            }
        }
         // Reset to card view when modal opens
        setPreviewMode('card');
    }, [initialData, isOpen]);
    
    // Effect to save draft to localStorage for NEW vehicles
    useEffect(() => {
        if (!initialData && isOpen) {
            localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
        }
    }, [formData, initialData, isOpen]);

    const previewVehicle: Vehicle = useMemo(() => {
        const validImages = formData.images.filter(img => img.trim() !== '');
        
        return {
            id: initialData?.id || 0,
            created_at: initialData?.created_at || new Date().toISOString(),
            make: formData.make || 'Marca',
            model: formData.model || 'Modelo',
            year: parseInt(formData.year, 10) || new Date().getFullYear(),
            price: parseInt(formData.price, 10) || 0,
            mileage: parseInt(formData.mileage, 10) || 0,
            engine: formData.engine || 'Motor',
            transmission: formData.transmission,
            fuelType: formData.fuelType === 'Otro' ? formData.customFuelType || 'Combustible' : formData.fuelType,
            description: formData.description || 'Descripción del vehículo.',
            images: validImages.length > 0 ? validImages : ['https://i.imgur.com/g2a4A0a.png'],
        };
    }, [formData, initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (['year', 'price', 'mileage'].includes(name)) {
            const cleanedValue = value.replace(/\D/g, ''); // Remove all non-digit characters
            setFormData(prev => ({ ...prev, [name]: cleanedValue }));
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    };

    const removeImageField = (index: number) => {
        if (formData.images.length > 1) {
            const newImages = formData.images.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, images: newImages }));
        }
    };
    
    const moveImage = (index: number, direction: 'up' | 'down') => {
        const newImages = [...formData.images];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < newImages.length) {
            [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
            setFormData(prev => ({ ...prev, images: newImages }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalImages = formData.images.filter(img => img.trim() !== '');
        if(finalImages.length === 0) {
            alert("Por favor, añade al menos una URL de imagen.");
            return;
        }

        const vehicleToSubmit: VehicleFormData = {
            id: formData.id, // Will be undefined for new vehicles
            make: formData.make,
            model: formData.model,
            engine: formData.engine,
            transmission: formData.transmission,
            description: formData.description,
            images: finalImages,
            year: parseInt(formData.year, 10) || 0,
            price: parseInt(formData.price, 10) || 0,
            mileage: parseInt(formData.mileage, 10) || 0,
            fuelType: formData.fuelType
        };

        if (isOtherFuelType) {
            if (!formData.customFuelType?.trim()) {
                alert("Por favor, especifique el tipo de combustible cuando selecciona 'Otro'.");
                return;
            }
            vehicleToSubmit.fuelType = formData.customFuelType.trim();
        }

        // Clear draft if it was a new vehicle that is being submitted
        if (!initialData) {
            localStorage.removeItem(DRAFT_STORAGE_KEY);
        }
        onSubmit(vehicleToSubmit);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        {initialData ? 'Editar Vehículo' : 'Añadir Vehículo'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                        <XIcon className="h-7 w-7"/>
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                        <form id="vehicle-form" onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="make" className="block text-base font-medium text-gray-700 dark:text-gray-300">Marca</label>
                                    <input
                                        id="make"
                                        name="make"
                                        list="brands-datalist"
                                        value={formData.make}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 form-input"
                                    />
                                    <datalist id="brands-datalist">
                                        {brands.map(brand => <option key={brand} value={brand} />)}
                                    </datalist>
                                </div>
                                <InputField label="Modelo" name="model" value={formData.model} onChange={handleChange} required />
                                <InputField label="Año" name="year" type="text" inputMode="numeric" value={formData.year} onChange={handleChange} required />
                                <InputField label="Precio (ARS)" name="price" type="text" inputMode="numeric" value={formData.price} onChange={handleChange} required />
                                <InputField label="Kilometraje (km)" name="mileage" type="text" inputMode="numeric" value={formData.mileage} onChange={handleChange} required />
                                <InputField label="Motor" name="engine" value={formData.engine} onChange={handleChange} required />
                                <div>
                                     <label htmlFor="transmission" className="block text-base font-medium text-gray-700 dark:text-gray-300">Transmisión</label>
                                     <select id="transmission" name="transmission" value={formData.transmission} onChange={handleChange} className="mt-1 form-input">
                                         <option>Manual</option>
                                         <option>Automática</option>
                                     </select>
                                </div>
                                 <div>
                                     <label htmlFor="fuelType" className="block text-base font-medium text-gray-700 dark:text-gray-300">Tipo de Combustible</label>
                                     <select 
                                        id="fuelType" 
                                        name="fuelType" 
                                        value={formData.fuelType} 
                                        onChange={handleChange} 
                                        className="mt-1 form-input"
                                     >
                                         <option>Nafta</option>
                                         <option>Diesel</option>
                                         <option>GNC</option>
                                         <option value="Otro">Otro</option>
                                     </select>
                                </div>
                                {isOtherFuelType && (
                                    <div>
                                        <label htmlFor="customFuelType" className="block text-base font-medium text-gray-700 dark:text-gray-300">Especificar Combustible</label>
                                        <input
                                            id="customFuelType"
                                            name="customFuelType"
                                            type="text"
                                            value={formData.customFuelType || ''}
                                            onChange={handleChange}
                                            required={isOtherFuelType}
                                            className="mt-1 form-input"
                                            placeholder="Ej: Eléctrico"
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-base font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required className="mt-1 form-input"></textarea>
                            </div>

                            {/* Image URLs */}
                            <div>
                                <label className="block text-base font-medium text-gray-700 dark:text-gray-300">URLs de Imágenes</label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">La primera imagen de la lista será la portada en el catálogo.</p>
                                <div className="space-y-4 mt-2">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="flex items-center gap-3 relative pt-2">
                                            {index === 0 && (
                                                <span className="absolute -top-1 -left-1 bg-rago-burgundy text-white text-xs font-bold px-2 py-0.5 rounded-full z-10 select-none">
                                                    Principal
                                                </span>
                                            )}
                                            <ImagePreview url={img} />
                                            <input type="url" placeholder="https://..." value={img} onChange={(e) => handleImageChange(index, e.target.value)} required={index === 0} className="form-input flex-grow" />
                                            <div className="flex items-center">
                                                <button type="button" onClick={() => moveImage(index, 'up')} disabled={index === 0} className="p-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 hover:text-gray-800 dark:hover:text-white"><UpIcon /></button>
                                                <button type="button" onClick={() => moveImage(index, 'down')} disabled={index === formData.images.length - 1} className="p-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 hover:text-gray-800 dark:hover:text-white"><DownIcon /></button>
                                                <button type="button" onClick={() => removeImageField(index)} disabled={formData.images.length <= 1} className="p-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-red-500 hover:text-red-700"><TrashIcon /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={addImageField} className="mt-2 flex items-center gap-1 text-base text-rago-burgundy hover:text-rago-burgundy-darker">
                                   <PlusIcon className="h-4 w-4" /> Añadir otra imagen
                                </button>
                            </div>
                        </form>
                        
                        <div className="hidden lg:block sticky top-0 h-fit p-6">
                            <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Previsualización</h4>
                             <div className="mb-4 flex justify-center rounded-lg bg-gray-200 dark:bg-gray-800 p-1">
                                <button
                                    onClick={() => setPreviewMode('card')}
                                    className={`w-full rounded-md py-2 text-sm font-medium transition-colors ${previewMode === 'card' ? 'bg-white dark:bg-gray-900 text-rago-burgundy shadow' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-gray-700/50'}`}
                                >
                                    Vista Tarjeta
                                </button>
                                <button
                                    onClick={() => setPreviewMode('detail')}
                                    className={`w-full rounded-md py-2 text-sm font-medium transition-colors ${previewMode === 'detail' ? 'bg-white dark:bg-gray-900 text-rago-burgundy shadow' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-gray-700/50'}`}
                                >
                                    Vista Detalle
                                </button>
                            </div>

                            {previewMode === 'card' ? (
                                <div className="transform scale-90 -translate-x-5">
                                    <VehicleCard vehicle={previewVehicle} onClick={() => {}} />
                                </div>
                            ) : (
                                <VehicleDetailPreview vehicle={previewVehicle} />
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-base font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                    <button type="submit" form="vehicle-form" className="px-4 py-2 text-base font-medium text-white bg-rago-burgundy rounded-lg hover:bg-rago-burgundy-darker">Guardar</button>
                </div>

            </div>
            <style>{`
                .form-input {
                    display: block;
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    background-color: #fff;
                    border: 1px solid #d1d5db;
                    border-radius: 0.375rem;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    transition: border-color 0.2s, box-shadow 0.2s;
                    font-size: 1rem;
                    line-height: 1.5rem;
                }
                .dark .form-input {
                    background-color: #1f2937;
                    border-color: #4b5563;
                    color: #e5e7eb;
                }
                .form-input:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(108, 30, 39, 0.5);
                    border-color: #6C1E27;
                }
            `}</style>
        </div>
    );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => {
    return (
        <div>
            <label htmlFor={props.name} className="block text-base font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <input id={props.name} {...props} className="mt-1 form-input" />
        </div>
    );
}

const SpecificationItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number; }> = ({ icon, label, value }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        <div className="flex items-center">
            <span className="text-rago-burgundy mr-3">{icon}</span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
        </div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-right">{value}</span>
    </div>
);

const VehicleDetailPreview: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
    return (
         <div className="border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-800 shadow-inner">
            <div className="max-h-[calc(85vh - 200px)] overflow-y-auto preview-scrollbar">
                <div className="aspect-[4/3] bg-gray-200 dark:bg-black relative rounded-lg overflow-hidden">
                    <ImageCarousel images={vehicle.images} />
                </div>
                <div className="p-4">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{vehicle.make} {vehicle.model}</h2>
                    <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Especificaciones</h3>
                        <div className="space-y-1">
                            <SpecificationItem icon={<ShieldIcon className="h-6 w-6"/>} label="Marca" value={vehicle.make} />
                            <SpecificationItem icon={<TagIcon className="h-6 w-6"/>} label="Modelo" value={vehicle.model} />
                            <SpecificationItem icon={<CalendarIcon className="h-6 w-6"/>} label="Año" value={vehicle.year} />
                            <SpecificationItem icon={<GaugeIcon className="h-6 w-6"/>} label="Kilometraje" value={`${vehicle.mileage.toLocaleString()} km`} />
                            <SpecificationItem icon={<CogIcon className="h-6 w-6"/>} label="Motor" value={vehicle.engine} />
                            <SpecificationItem icon={<SlidersIcon className="h-6 w-6"/>} label="Transmisión" value={vehicle.transmission} />
                            <SpecificationItem icon={<GasPumpIcon className="h-6 w-6"/>} label="Combustible" value={vehicle.fuelType} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Descripción</h3>
                        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{vehicle.description}</p>
                    </div>
                     <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                         <div className="text-center">
                            <p className="text-5xl font-extrabold text-rago-burgundy">${vehicle.price.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .preview-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .preview-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .dark .preview-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .preview-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #6C1E27;
                    border-radius: 4px;
                    border: 2px solid transparent;
                    background-clip: padding-box;
                }
                 .preview-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #50161D;
                }
            `}</style>
        </div>
    )
};

export default VehicleFormModal;
