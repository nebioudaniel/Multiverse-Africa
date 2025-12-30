'use client';

import * as React from "react";
import { Trash2, Edit, Plus, Loader2, Bus, Truck, Users, Info, Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminVehiclesPage() {
    const [vehicles, setVehicles] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");

    const fetchVehicles = async () => {
        try {
            const res = await fetch('/api/vehicles');
            const data = await res.json();
            setVehicles(data);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => { fetchVehicles(); }, []);

    const onDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setVehicles(vehicles.filter(v => v.id !== id));
            }
        } catch (error) {
            alert("Delete failed");
        }
    };

    const filteredVehicles = vehicles.filter((v) =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm text-muted-foreground font-medium">Loading fleet data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Fleet Management</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage your vehicle catalog and images.</p>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-sm w-full sm:w-auto">
                    <Link href="/admin/vehicles/new">
                        <Plus className="w-4 h-4 mr-2" /> Add New Vehicle
                    </Link>
                </Button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search by name or type..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {filteredVehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 text-center bg-gray-50/50">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No vehicles found</h3>
                    <p className="text-muted-foreground mb-6 max-w-xs text-sm">
                        {searchQuery ? "No results match your search." : "Start by adding your first vehicle."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredVehicles.map((v) => (
                        <div key={v.id} className="group relative flex flex-col md:flex-row items-center gap-6 p-4 bg-white dark:bg-zinc-900 border rounded-2xl transition-all hover:border-blue-200 hover:shadow-sm">
                            <div className="relative w-full md:w-48 aspect-video md:aspect-square rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image src={v.images?.[0] || "/placeholder-car.png"} fill className="object-cover group-hover:scale-105 transition-transform duration-500" alt={v.name} />
                            </div>

                            <div className="flex-1 space-y-2 w-full">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{v.name}</h2>
                                        <Badge variant="secondary" className={cn(
                                            "capitalize text-[10px]",
                                            v.type === 'truck' ? "bg-orange-50 text-orange-700 border-orange-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        )}>
                                            {v.type === 'truck' ? <Truck className="w-3 h-3 mr-1"/> : <Bus className="w-3 h-3 mr-1"/>}
                                            {v.type}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-1.5 font-medium text-blue-600">
                                        <Users className="w-4 h-4" /> {v.capacity}
                                    </div>
                                    <div className="flex items-center gap-1.5 italic">
                                        <Info className="w-4 h-4" /> {v.images?.length || 0} Photos
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2 max-w-2xl">{v.description}</p>
                            </div>

                            <div className="flex md:flex-col gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                                <Button variant="outline" size="sm" asChild className="flex-1 md:w-32 border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700">
                                    <Link href={`/admin/vehicles/${v.id}`}>
                                        <Edit className="w-4 h-4 mr-2" /> Edit
                                    </Link>
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="flex-1 md:w-32 border-gray-200 hover:border-red-500 hover:bg-red-50 hover:text-red-700 transition-colors">
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete <strong>{v.name}</strong> from your fleet records and remove its images from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction 
                                                onClick={() => onDelete(v.id)}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Delete Vehicle
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}