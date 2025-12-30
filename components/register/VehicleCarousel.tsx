'use client';

import * as React from "react";
import Image from "next/image";
import { CheckCircle2, Users, Bus, Truck, Loader2 } from "lucide-react"; 
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"; 
import { Button } from "@/components/ui/button";

interface Vehicle {
  id: string;
  name: string;
  description: string;
  capacity: string;
  type: 'minibus' | 'truck';
  images: string[];
}

interface VehicleDetailSelectorProps {
  selectedVehicle: string | null;
  onSelect: (vehicleName: string) => void;
}

export function VehicleDetailSelector({ selectedVehicle, onSelect }: VehicleDetailSelectorProps) {
    const { t } = useTranslation();
    const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    // Load data from API
    React.useEffect(() => {
        async function fetchVehicles() {
            try {
                const response = await fetch('/api/vehicles');
                const data = await response.json();
                setVehicles(data);
            } catch (error) {
                console.error("Failed to load vehicles", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchVehicles();
    }, []);

    const groupedVehicles = React.useMemo(() => {
        return vehicles.reduce((acc, vehicle) => {
            const type = vehicle.type as 'minibus' | 'truck';
            acc[type] = acc[type] || [];
            acc[type].push(vehicle);
            return acc;
        }, {} as Record<'minibus' | 'truck', Vehicle[]>);
    }, [vehicles]);

    const currentVehicleData = React.useMemo(() => {
        if (vehicles.length === 0) return null;
        const found = vehicles.find(v => v.name === selectedVehicle);
        // Fallback to first available vehicle
        return found || vehicles[0];
    }, [selectedVehicle, vehicles]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-muted-foreground">Loading vehicle fleet...</p>
            </div>
        );
    }

    if (vehicles.length === 0) return <div className="p-8 text-center">No vehicles found in database.</div>;

    const IconComponent = currentVehicleData?.type === 'minibus' ? Bus : Truck;

    return (
        <div className="space-y-8">
            {/* 1. Main Product View */}
            <div className={cn(
                "p-4 sm:p-6 lg:p-8 rounded-xl border transition-all duration-300 shadow-md",
                selectedVehicle === currentVehicleData?.name 
                    ? "border-green-400 bg-green-50 dark:bg-green-950/50 shadow-lg" 
                    : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
            )}>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="relative w-full lg:w-3/5 rounded-lg overflow-hidden shadow-xl">
                        <Carousel opts={{ loop: true }} className="w-full">
                            <CarouselContent>
                                {currentVehicleData?.images.map((imagePath, index) => (
                                    <CarouselItem key={index} className="aspect-[4/3]">
                                        <div className="relative w-full h-full bg-gray-100 dark:bg-zinc-700">
                                            <Image src={imagePath} alt="vehicle" fill style={{ objectFit: 'cover' }} />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                        </Carousel>
                    </div>

                    <div className="w-full lg:w-2/5 space-y-4">
                        <div className="flex items-center">
                            <IconComponent className="w-8 h-8 mr-3 text-gray-800 dark:text-gray-200" />
                            <h2 className="text-xl sm:text-2xl text-gray-900 dark:text-white font-bold">
                                {currentVehicleData?.name}
                            </h2>
                        </div>
                        <div className="flex items-center text-base font-medium text-blue-600 bg-blue-50 dark:bg-zinc-900 px-3 py-1 rounded-sm">
                           <Users className="w-5 h-5 mr-2" />
                           {currentVehicleData?.capacity}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {currentVehicleData?.description}
                        </p>
                       <Button
  onClick={() => onSelect(currentVehicleData!.name)}
  className="w-full mt-4"
  variant={
    selectedVehicle === currentVehicleData?.name
      ? "secondary"
      : "default"
  }
>

                            {selectedVehicle === currentVehicleData?.name ? t('step2.selected') : t('step2.selectThisVehicle')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. Options Grid */}
            <div className="pt-4 space-y-8">
                {Object.entries(groupedVehicles).map(([type, list]) => (
                    <div key={type} className="space-y-4">
                        <h3 className="text-xl font-bold capitalize flex items-center">
                            {type === 'minibus' ? <Bus className="mr-2 text-green-600"/> : <Truck className="mr-2 text-red-600"/>}
                            {t(`step2.category.${type}`)}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {list.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    onClick={() => onSelect(vehicle.name)}
                                    className={cn(
                                        "p-3 rounded-xl border-2 cursor-pointer transition-all bg-white dark:bg-zinc-800",
                                        selectedVehicle === vehicle.name ? "border-green-500 ring-2 ring-green-200" : "border-gray-200"
                                    )}
                                >
                                    <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                                        <Image src={vehicle.images[0]} alt={vehicle.name} fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <p className="text-sm font-bold truncate">{vehicle.name}</p>
                                    <p className="text-xs text-blue-600 flex items-center"><Users className="w-3 h-3 mr-1"/>{vehicle.capacity}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}