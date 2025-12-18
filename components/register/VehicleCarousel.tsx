'use client';

import * as React from "react";
import Image from "next/image";
// Import LucideIcon type from lucide-react (assuming this is available)
import { CheckCircle2, Users, Bus, Truck, LucideIcon } from "lucide-react"; 
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";
// Import Carousel components
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"; 
import { Button } from "@/components/ui/button";

// Define the structure for the vehicle data
interface Vehicle {
  key: string; 
  nameKey: string;
  descriptionKey: string;
  images: string[]; 
  capacity: string;
  type: 'minibus' | 'truck'; // Added type for categorization
}

interface VehicleDetailSelectorProps {
  selectedVehicle: string | null;
  onSelect: (vehicleName: string) => void;
}

// --- UPDATED VEHICLE DATA ARRAY (Minibuses + Trucks) ---
const vehicles: Vehicle[] = [
  // --- MINIBUSES ---
  {
    key: "15_plus_1_seater",
    nameKey: "model15Plus1Seater",
    descriptionKey: "desc15Plus1Seater",
    images: [
        "/images/minibus_15_front.jpg", 
        "/images/minibus_15_side.jpg", 
        "/images/minibus_15_interior.jpg", 
        "/images/minibus_15_interior2.jpg",
    ],
    capacity: "15 + 1 people",
    type: 'minibus',
  },
  {
    key: "18_seater",
    nameKey: "model18Seater",
    descriptionKey: "desc18Seater",
    images: [
        "/images/minibus_18_front.jpg", 
        "/images/minibus_18_side.jpg",
        "/images/minibus_18_interior.jpg",
        "/images/minibus_18_interior2.jpg",
    ],
    capacity: "18 people",
    type: 'minibus',
  },
  {
    key: "22_plus_1_seater",
    nameKey: "model22Plus1Seater",
    descriptionKey: "desc22Plus1Seater",
    images: [
        "/images/minibus_22_front.jpg", 
        "/images/minibus_22_side.jpg",
        "/images/minibus_22_interior.jpg", 
         "/images/minibus_22_interior2.jpg"
    ],
    capacity: "22 + 1 people",
    type: 'minibus',
  },
  // --- NEW TRUCKS ---
  {
    key: "shacman_dump_truck",
    nameKey: "modelShacmanDump",
    descriptionKey: "descShacmanDump",
    images: [
        "/images/truck_shacman_dump_front.jpg", 
        "/images/truck_shacman_dump_side.jpg",
        "/images/truck_shacman_dump_front2.jpg", 
        "/images/truck_shacman_dump_side2.jpg",
    ],
    capacity: "30-50 Ton Payload",
    type: 'truck',
  },
  {
    key: "shacman_tractor_head",
    nameKey: "modelShacmanTractor",
    descriptionKey: "descShacmanTractor",
    images: [
        "/images/truck_shacman_tractor_front.jpg", 
        "/images/truck_shacman_tractor_interior.jpg",
        "/images/truck_shacman_tractor_interior2.jpg",
         "/images/truck_shacman_tractor_front.jpg", 
    ],
    capacity: "40-60 Ton GTW",
    type: 'truck',
  },
  {
    key: "shacman_cement_mixer",
    nameKey: "modelShacmanMixer",
    descriptionKey: "descShacmanMixer",
    images: [
        "/images/truck_shacman_mixer_front.jpg", 
        "/images/truck_shacman_mixer_rear.jpg",
         "/images/truck_shacman_mixer_front2.jpg", 
        "/images/truck_shacman_mixer_rear2.jpg",
    ],
    capacity: "8-12 cbm Capacity",
    type: 'truck',
  },
];

export function VehicleDetailSelector({ selectedVehicle, onSelect }: VehicleDetailSelectorProps) {
    const { t } = useTranslation();

    // Group vehicles for easier rendering in the selection grid
    const groupedVehicles = React.useMemo(() => {
        return vehicles.reduce((acc, vehicle) => {
            acc[vehicle.type] = acc[vehicle.type] || [];
            acc[vehicle.type].push(vehicle);
            return acc;
        }, {} as Record<'minibus' | 'truck', Vehicle[]>);
    }, []);

    const currentVehicleData = React.useMemo(() => {
        const found = vehicles.find(v => t(`step2.vehicles.${v.nameKey}`) === selectedVehicle);
        // Use the first minibus as fallback if selected vehicle is null or not found
        const fallbackVehicle = vehicles.find(v => v.type === 'minibus') || vehicles[0]; 
        const vehicleToDisplay = found || fallbackVehicle;
        
        return {
            ...vehicleToDisplay,
            name: t(`step2.vehicles.${vehicleToDisplay.nameKey}`),
            description: t(`step2.vehicles.${vehicleToDisplay.descriptionKey}`),
            icon: vehicleToDisplay.type === 'minibus' ? Bus : Truck, // Determine icon
        };
    }, [selectedVehicle, t]);

    const IconComponent = currentVehicleData.icon;

    return (
        <div className="space-y-8">
            
            {/* 1. Main Product View */}
            <div className={cn(
                "p-4 sm:p-6 lg:p-8 rounded-xl border transition-all duration-300 shadow-md",
                selectedVehicle === currentVehicleData.name 
                    ? "border-green-400 bg-green-50 dark:bg-green-950/50 shadow-lg" 
                    : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-blue-300"
            )}>
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Image Area (Left) - Carousel */}
                    <div className="relative w-full lg:w-3/5 rounded-lg overflow-hidden shadow-xl">
                        <Carousel 
                            opts={{ loop: true }}
                            className="w-full"
                        >
                            <CarouselContent className="h-full">
                                {currentVehicleData.images.map((imagePath, index) => (
                                    <CarouselItem key={index} className="aspect-[4/3]">
                                        <div className="relative w-full h-full bg-gray-100 dark:bg-zinc-700">
                                            {/* Corrected: Uses 'fill' and objectFit */}
                                            <Image 
                                                src={imagePath} 
                                                alt={`${currentVehicleData.name} image ${index + 1}`} 
                                                fill 
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious 
                                type="button" 
                                className="absolute z-20 left-2 w-8 h-8 bg-white/70 hover:bg-white dark:bg-zinc-900/70 dark:hover:bg-zinc-900" 
                                tabIndex={-1} 
                            />
                            <CarouselNext 
                                type="button" 
                                className="absolute z-20 right-2 w-8 h-8 bg-white/70 hover:bg-white dark:bg-zinc-900/70 dark:hover:bg-zinc-900" 
                                tabIndex={-1}
                            />
                        </Carousel>
                        
                        {selectedVehicle === currentVehicleData.name && (
                            <div className="absolute top-2 left-2 z-10 p-2 bg-green-500 rounded-full shadow-lg">
                                <CheckCircle2 className="w-6 h-6 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Description Area (Right) */}
                    <div className="w-full lg:w-2/5 space-y-4">
                        <div className="flex items-center">
                            {/* Use the dynamically chosen icon */}
                            <IconComponent className="w-8 h-8 mr-3 text-gray-800 dark:text-gray-200" />
                            <h2 className="text-xl sm:text-2xl text-gray-900 dark:text-white">
                                {currentVehicleData.name}
                            </h2>
                        </div>
                        
                        <div className="flex items-center text-base font-medium text-blue-600 dark:text-blue-400 border-l-4 border-blue-500 pl-3 py-1 bg-blue-50 dark:bg-zinc-900 rounded-sm">
                           <Users className="w-5 h-5 mr-2" />
                           {currentVehicleData.capacity}
                        </div>

                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed pt-2">
                            {currentVehicleData.description}
                        </p>
                        
                        {/* Call to action/Select button */}
                        <Button
                            type="button"
                            onClick={() => onSelect(currentVehicleData.name)}
                            className={cn(
                                "w-full mt-4 px-6 py-3 text-sm rounded-lg font-semibold transition-colors duration-200 shadow-md",
                                selectedVehicle === currentVehicleData.name 
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                            )}
                        >
                            {selectedVehicle === currentVehicleData.name ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    {t('step2.selected')}
                                </>
                            ) : (
                                t('step2.selectThisVehicle')
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. Options Grid (Categorized Selector area) */}
            <div className="pt-4 space-y-8">
                {/* Minibus Selection */}
                <VehicleCategorySection
                    title={t('step2.category.minibus')}
                    vehicles={groupedVehicles.minibus || []}
                    t={t}
                    selectedVehicle={selectedVehicle}
                    onSelect={onSelect}
                    icon={Bus}
                    keyPrefix="minibus"
                />

                {/* Truck Selection */}
                <VehicleCategorySection
                    title={t('step2.category.truck')}
                    vehicles={groupedVehicles.truck || []}
                    t={t}
                    selectedVehicle={selectedVehicle}
                    onSelect={onSelect}
                    icon={Truck}
                    keyPrefix="truck"
                />
            </div>
        </div>
    );
}

// --- NEW HELPER COMPONENT FOR CATEGORIZATION & IMAGE FIX ---
interface VehicleCategorySectionProps {
    title: string;
    vehicles: Vehicle[];
    t: (key: string) => string;
    selectedVehicle: string | null;
    onSelect: (vehicleName: string) => void;
    // FIX: Changed React.ElementType to LucideIcon (assuming the import is available)
    // If LucideIcon is NOT available, use React.FC<React.SVGProps<SVGSVGElement>>
    icon: LucideIcon; 
    keyPrefix: string;
}

function VehicleCategorySection({ title, vehicles, t, selectedVehicle, onSelect, icon: Icon, keyPrefix }: VehicleCategorySectionProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                {/* Error was here. It is fixed by correctly typing the 'icon' prop above. */}
                <Icon className={`w-5 h-5 mr-2 ${keyPrefix === 'truck' ? 'text-red-600' : 'text-green-600'}`} />
                {title}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4"> 
                {vehicles.map((vehicle) => {
                    const name = t(`step2.vehicles.${vehicle.nameKey}`);
                    const isSelected = selectedVehicle === name;
                    
                    return (
                        <div
                            key={vehicle.key}
                            onClick={() => onSelect(name)}
                            className={cn(
                                "p-3 rounded-xl border-2 cursor-pointer text-center transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
                                isSelected 
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/30 ring-4 ring-green-200 dark:ring-green-700/50 shadow-lg" 
                                    : "border-gray-200 dark:border-zinc-700 hover:border-blue-400 bg-white dark:bg-zinc-800"
                            )}
                        >
                            <div className="relative mx-auto rounded-lg mb-3 aspect-video overflow-hidden bg-gray-100 dark:bg-zinc-700">
                                {/* FIX APPLIED HERE: Use 'fill' to make image cover its container */}
                                <Image
                                    src={vehicle.images[0]} 
                                    alt={name}
                                    fill // Use fill to make it expand to the parent dimensions
                                    style={{ objectFit: 'cover' }} // Ensures the image covers the area without distortion
                                />
                                {isSelected && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-green-600/30">
                                        <CheckCircle2 className="w-8 h-8 text-white" />
                                    </div>
                                )}
                            </div>
                            
                            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 mb-1">{name}</p>
                            <p className="text-xs font-normal text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <Users className="w-3 h-3 mr-1" />
                                {vehicle.capacity}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}