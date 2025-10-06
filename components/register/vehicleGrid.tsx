// src/components/register/VehicleGrid.tsx
import Image from 'next/image';

interface VehicleGridProps {
  selectedVehicle: string | null;
  onSelect: (vehicleName: string) => void;
}

const vehicles = [
  { name: 'Electric Minibus', image: '/images/electric_minibus.jpg', description: 'Eco-friendly and modern electric vehicle.' },
  { name: 'Traditional Minibus', image: '/images/king_long_16seater.jpg', description: 'Standard fuel-efficient minibus for daily operations.' },
  { name: 'Luxury Minibus', image: '/images/luxury_minibus.jpg', description: 'Premium comfort with enhanced features.' },
  { name: 'Other Minibus', image: '/images/toyota_hiace.jpg', description: 'For special requirements or specific models.' },
];

export function VehicleGrid({ selectedVehicle, onSelect }: VehicleGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle.name}
          className={`
            flex flex-col items-center justify-between
            p-6 sm:p-8 lg:p-10 border rounded-xl cursor-pointer transition-all duration-300 group
            ${selectedVehicle === vehicle.name 
              ? 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/50 bg-blue-50 dark:bg-blue-900/20 shadow-lg' 
              : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md'
            }
          `}
          onClick={() => onSelect(vehicle.name)}
        >
          {/* Responsive image container */}
          <div className="relative w-full h-48 sm:h-56 md:h-60 lg:h-72 xl:h-80 mb-4 overflow-hidden rounded-lg">
            <Image
              src={vehicle.image}
              alt={vehicle.name}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg transform transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />
          </div>

          {/* Content (title & description) */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-2">{vehicle.name}</h3>
            <p className="text-sm sm:text-base md:text-lg lg:text-lg text-gray-500 dark:text-gray-400 font-light">{vehicle.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
