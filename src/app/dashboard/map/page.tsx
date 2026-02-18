"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Radio, Battery, Signal, Thermometer, Wifi, Activity } from "lucide-react";

const devices = [
    { id: "DEV-001", name: "Solar Farm Unit #4", lat: 23.0225, lng: 72.5714, city: "Ahmedabad", status: "online", battery: 94, signal: 98, temp: 42 },
    { id: "DEV-002", name: "Wind Turbine Cluster A", lat: 8.7642, lng: 78.1348, city: "Tirunelveli", status: "online", battery: 87, signal: 95, temp: 38 },
    { id: "DEV-003", name: "Biogas Plant Sensor #2", lat: 19.076, lng: 72.8777, city: "Mumbai", status: "online", battery: 78, signal: 91, temp: 44 },
    { id: "DEV-004", name: "Agri Monitor Station", lat: 30.7333, lng: 76.7794, city: "Chandigarh", status: "offline", battery: 12, signal: 0, temp: 0 },
    { id: "DEV-005", name: "Metro Grid Sensor", lat: 28.6139, lng: 77.209, city: "New Delhi", status: "online", battery: 91, signal: 97, temp: 36 },
    { id: "DEV-006", name: "Mangrove Eco Monitor", lat: 9.9312, lng: 76.2673, city: "Kochi", status: "online", battery: 82, signal: 88, temp: 31 },
];

export default function DeviceMapPage() {
    return (
        <div className="space-y-5 max-w-7xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Device Map</h1>
                    <p className="text-[11px] text-foreground/25">IoT sensor network • Real-time device telemetry</p>
                </div>
                <Badge className="bg-green-400/10 text-green-400 border-green-400/15 text-[9px] gap-1">
                    <Radio size={10} /> {devices.filter((d) => d.status === "online").length} Online
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Map */}
                <Card className="lg:col-span-2 glass-hover overflow-hidden group">
                    <CardContent className="p-0 relative" style={{ height: 420 }}>
                        {/* Grid overlay */}
                        <div className="absolute inset-0" style={{
                            backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
                            backgroundSize: "30px 30px"
                        }} />
                        {/* India outline hint */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-[80px] text-foreground/[0.02] font-black select-none">🇮🇳</div>
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
                                    <div className="absolute left-4 top-0 glass rounded-lg px-2.5 py-1.5 opacity-0 group-hover/marker:opacity-100 transition-all duration-200 whitespace-nowrap z-20 pointer-events-none">
                                        <p className="text-[10px] font-semibold text-foreground/80">{d.name}</p>
                                        <p className="text-[8px] text-foreground/30">{d.city}</p>
                                    </div>
                                </div>
                            );
                        })}
                        {/* Legend */}
                        <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-2">
                            <p className="text-[8px] text-foreground/20 mb-1">DEVICE STATUS</p>
                            <div className="flex gap-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-400" />
                                    <span className="text-[8px] text-foreground/30">Online</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-red-400/50" />
                                    <span className="text-[8px] text-foreground/30">Offline</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Device List */}
                <div className="space-y-2">
                    {devices.map((d, i) => (
                        <Card
                            key={d.id}
                            className={`glass transition-all duration-300 cursor-default group ${d.status === "offline" ? "opacity-50" : "hover:bg-foreground/[0.04] hover:border-foreground/8"
                                } animate-slide-up stagger-${Math.min(i + 1, 6)}`}
                            style={{ opacity: 0 }}
                        >
                            <CardContent className="p-3">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${d.status === "online" ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.3)]" : "bg-red-400/50"
                                        }`} />
                                    <p className="text-[12px] font-semibold text-foreground/70 group-hover:text-foreground/90 transition-colors flex-1 truncate">{d.name}</p>
                                    <span className="text-[8px] text-foreground/15 font-mono">{d.id}</span>
                                </div>
                                <div className="flex gap-3 text-[9px]">
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
        </div>
    );
}
