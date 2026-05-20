"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Radio, Battery, Signal, Thermometer, Loader2 } from "lucide-react";
import { useApp } from "@/providers/app-provider";

interface Device {
    id: string;
    name: string;
    lat: number;
    lng: number;
    city: string;
    status: string;
    battery: number;
    signal: number;
    temp: number;
}

const seededDevices: Device[] = [
    { id: "DEV-001", name: "Solar Farm Unit #4", lat: 23.0225, lng: 72.5714, city: "Ahmedabad", status: "online", battery: 94, signal: 98, temp: 42 },
    { id: "DEV-002", name: "Wind Turbine Cluster A", lat: 8.7642, lng: 78.1348, city: "Tirunelveli", status: "online", battery: 87, signal: 95, temp: 38 },
    { id: "DEV-003", name: "Biogas Plant Sensor #2", lat: 19.076, lng: 72.8777, city: "Mumbai", status: "online", battery: 78, signal: 91, temp: 44 },
    { id: "DEV-004", name: "Agri Monitor Station", lat: 30.7333, lng: 76.7794, city: "Chandigarh", status: "offline", battery: 12, signal: 0, temp: 0 },
    { id: "DEV-005", name: "Metro Grid Sensor", lat: 28.6139, lng: 77.209, city: "New Delhi", status: "online", battery: 91, signal: 97, temp: 36 },
    { id: "DEV-006", name: "Mangrove Eco Monitor", lat: 9.9312, lng: 76.2673, city: "Kochi", status: "online", battery: 82, signal: 88, temp: 31 },
];

export default function DeviceMapPage() {
    const { user } = useApp();
    const [devices, setDevices] = useState<Device[]>(seededDevices);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDevices() {
            try {
                const entityId = user.entity?.id || "";
                const res = await fetch(`/api/sources/list?entityId=${entityId}`);
                if (res.ok) {
                    const data = await res.json();
                    
                    if (data && data.length > 0) {
                        // Map database sources to Device shapes
                        const dbDevices = data.map((source: any) => {
                            const id = source.sourceId || source.id;
                            
                            // Deterministically hash the ID to get lat/lng coordinates in Gujarat (20.0-24.5 lat, 69.0-74.5 lng)
                            let hashVal1 = 0;
                            let hashVal2 = 0;
                            const str = id.toString();
                            for (let i = 0; i < str.length; i++) {
                                hashVal1 = str.charCodeAt(i) + ((hashVal1 << 5) - hashVal1);
                                hashVal2 = str.charCodeAt(i) * 31 + ((hashVal2 << 7) - hashVal2);
                            }
                            const val1 = Math.abs(Math.sin(hashVal1) * 10000) % 1;
                            const val2 = Math.abs(Math.cos(hashVal2) * 10000) % 1;

                            const lat = 20.0 + val1 * 4.5;
                            const lng = 69.0 + val2 * 5.5;

                            return {
                                id: id.slice(0, 10),
                                name: source.assetName || "Smart Inverter Sensor",
                                lat: lat,
                                lng: lng,
                                city: source.assetType || "Gujarat Region",
                                status: "online",
                                battery: Math.round(80 + val1 * 20),
                                signal: Math.round(90 + val2 * 10),
                                temp: Math.round(30 + val1 * 15)
                            };
                        });

                        // Merge DB devices with seeded devices, avoiding ID collisions
                        const filteredSeeds = seededDevices.filter(
                            (sd) => !dbDevices.some((db: any) => db.id === sd.id)
                        );
                        setDevices([...dbDevices, ...filteredSeeds]);
                    } else {
                        setDevices(seededDevices);
                    }
                }
            } catch (err) {
                console.error("Failed to load telemetry sources for map:", err);
            } finally {
                setLoading(false);
            }
        }
        loadDevices();
    }, [user.entity?.id]);

    return (
        <div className="space-y-5 max-w-7xl mx-auto animate-fade-in p-4 md:p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Device Map</h1>
                    <p className="text-sm text-foreground/25">IoT sensor network • Real-time device telemetry</p>
                </div>
                <Badge className="bg-green-400/10 text-green-400 border-green-400/15 text-xs gap-1 py-1 shrink-0">
                    <Radio size={10} className="animate-pulse" /> {devices.filter((d) => d.status === "online").length} Online
                </Badge>
            </div>

            {loading && devices.length === seededDevices.length ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-green-400" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Map Canvas */}
                    <Card className="lg:col-span-2 glass-hover overflow-hidden group border border-foreground/[0.04] relative">
                        <CardContent className="p-0 relative" style={{ height: 420 }}>
                            {/* Grid overlay */}
                            <div className="absolute inset-0" style={{
                                backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
                                backgroundSize: "30px 30px"
                            }} />
                            {/* India outline hint */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-[120px] text-foreground/[0.015] font-black select-none">🇮🇳</div>
                            </div>
                            {/* Device markers */}
                            {devices.map((d) => {
                                const x = ((d.lng - 68) / (97 - 68)) * 80 + 10;
                                const y = ((37 - d.lat) / (37 - 7)) * 80 + 10;
                                return (
                                    <div
                                        key={d.id}
                                        className="absolute group/marker"
                                        style={{ left: `${x}%`, top: `${y}%` }}
                                    >
                                        {d.status === "online" && <div className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-green-400/15 animate-ping" />}
                                        <div className={`relative z-10 w-3.5 h-3.5 -ml-[7px] -mt-[7px] rounded-full cursor-default transition-all duration-200 group-hover/marker:scale-150 ${d.status === "online"
                                                ? "bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.4)]"
                                                : "bg-red-400/50"
                                            }`} />
                                        <div className="absolute left-4 top-0 glass rounded-lg px-2.5 py-1.5 opacity-0 group-hover/marker:opacity-100 transition-all duration-200 whitespace-nowrap z-20 pointer-events-none shadow-xl border border-white/5">
                                            <p className="text-xs font-semibold text-white">{d.name}</p>
                                            <p className="text-[8px] text-foreground/30">{d.city} · {d.lat.toFixed(4)}° N, {d.lng.toFixed(4)}° E</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {/* Legend */}
                            <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-2 border border-white/5">
                                <p className="text-[8px] text-foreground/20 mb-1">DEVICE STATUS</p>
                                <div className="flex gap-3">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-green-400" />
                                        <span className="text-[8px] text-foreground/30 font-medium">Online</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-red-400/50" />
                                        <span className="text-[8px] text-foreground/30 font-medium">Offline</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Device List */}
                    <div className="space-y-2 overflow-y-auto max-h-[420px] pr-1 custom-scrollbar">
                        {devices.map((d, i) => (
                            <Card
                                key={d.id}
                                className={`glass transition-all duration-300 cursor-default group border border-foreground/[0.04] ${d.status === "offline" ? "opacity-50" : "hover:bg-foreground/[0.04] hover:border-foreground/8"}`}
                                style={{ opacity: 1 }}
                            >
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2.5 mb-2">
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${d.status === "online" ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.3)]" : "bg-red-400/50"}`} />
                                        <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors flex-1 truncate">{d.name}</p>
                                        <span className="text-[8px] text-foreground/20 font-mono tracking-tight shrink-0">{d.id}</span>
                                    </div>
                                    <div className="flex gap-3 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Battery size={10} className="text-foreground/15" />
                                            <span className={`${d.battery > 50 ? "text-green-400/60" : d.battery > 20 ? "text-amber-400/60" : "text-red-400/60"}`}>{d.battery}%</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Signal size={10} className="text-foreground/15" />
                                            <span className="text-foreground/30">{d.signal}%</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Thermometer size={10} className="text-foreground/15" />
                                            <span className="text-foreground/30">{d.temp}°C</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
