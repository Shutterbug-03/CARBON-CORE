"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/providers/app-provider";
import {
  User, Shield, Smartphone, Users, QrCode, Copy, CheckCircle2,
  Wifi, WifiOff, Plus, Settings, Key, Building2, MapPin, Hash
} from "lucide-react";

const verificationBadges = [
  { label: "GSTIN Verified", icon: CheckCircle2, status: true },
  { label: "PAN Verified", icon: CheckCircle2, status: true },
  { label: "Device Registered", icon: Smartphone, status: true },
  { label: "CIH Generated", icon: Key, status: true },
];

const registeredDevices = [
  { id: "HW-FUS-SRT-2024-0442", type: "Solar Inverter", model: "Huawei SUN2000-50KTL", lastData: "2 mins ago", status: "online", fingerprint: "a3f8...d921" },
  { id: "SM-DGVCL-MTR-88471", type: "Smart Meter", model: "DGVCL Grid Meter", lastData: "15 mins ago", status: "online", fingerprint: "c7b2...e445" },
  { id: "GPS-IOT-SRT-0442", type: "GPS Tracker", model: "GreenPe IoT v2", lastData: "5 mins ago", status: "online", fingerprint: "91d6...f782" },
  { id: "DG-FUEL-MON-003", type: "Fuel Sensor", model: "DG Fuel Monitor", lastData: "3 days ago", status: "offline", fingerprint: "b4e1...a203" },
];

const teamMembers = [
  { name: "Priya Malhotra", role: "Admin", email: "priya@company.com", status: "Active" },
  { name: "Rajesh Kumar", role: "Data Entry", email: "rajesh@company.com", status: "Active" },
  { name: "Auditor Bot", role: "Auditor (Read-only)", email: "audit@vvb.org", status: "Expires in 14d" },
];

export default function AccountPage() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<"identity" | "devices" | "team">("identity");
  const [copied, setCopied] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(true);

  useEffect(() => {
    async function loadDevices() {
      try {
        const res = await fetch(`/api/sources/list?entityId=${user.entity?.id || ""}`);
        if (res.ok) {
          const data = await res.json();
          setDevices(data);
        }
      } catch (err) {
        console.error("Failed to fetch devices:", err);
      } finally {
        setLoadingDevices(false);
      }
    }
    if (user.entity?.id) {
      loadDevices();
    }
  }, [user.entity?.id]);

  const cihId = `GP-IND-2024-GJ-${user.entity?.registrationId?.slice(-6) || "044821"}-SOL`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "identity" as const, icon: User, label: "Identity" },
    { id: "devices" as const, icon: Smartphone, label: "Devices" },
    { id: "team" as const, icon: Users, label: "My Team" },
  ];

  const devicesList = devices.length > 0 ? devices.map(d => ({
    id: d.sourceId,
    type: d.type === "IOT_SENSOR" ? "IoT Sensor" : "CSV Ingestion",
    model: `${d.assetName} (${d.assetType})`,
    lastData: d.lastActive ? new Date(d.lastActive).toLocaleTimeString() + " UTC" : "Never",
    status: d.totalDataPoints > 0 ? "online" : "offline",
    fingerprint: d.id.slice(0, 4) + "..." + d.id.slice(-4),
  })) : registeredDevices;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">My Account</h1>
        <p className="text-sm text-foreground/40 mt-1">Identity & Asset Hub — Your verified digital presence on GreenPe</p>
      </div>

      {/* CIH Banner */}
      <Card className="border-green-500/20 bg-gradient-to-r from-green-500/5 to-transparent">
        <CardContent className="py-5 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
            <QrCode size={28} className="text-black" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.2em] text-green-400/60 uppercase font-semibold mb-1">Climate Identity Hash (CIH) — Your GreenPe ID</p>
            <div className="flex items-center gap-3">
              <p className="text-lg font-mono font-bold text-green-400">{cihId}</p>
              <button onClick={() => copyToClipboard(cihId)} className="p-1.5 rounded-lg hover:bg-foreground/5 transition cursor-pointer">
                {copied ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} className="text-foreground/30" />}
              </button>
            </div>
            <p className="text-xs text-foreground/30 mt-1">Cryptographically binds: Company + Asset + Device + GPS + Timestamp</p>
          </div>
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-3 py-1">VERIFIED</Badge>
        </CardContent>
      </Card>

      {/* Verification Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {verificationBadges.map((b) => (
          <div key={b.label} className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-foreground/[0.06] bg-foreground/[0.02]">
            <b.icon size={16} className="text-green-400" />
            <span className="text-xs font-medium text-foreground/60">{b.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-foreground/[0.03] p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab.id ? "bg-green-500 text-black shadow" : "text-foreground/40 hover:text-foreground/70"
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "identity" && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Company Details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                ["Company Name", user.entity?.name || "—"],
                ["GSTIN", user.entity?.registrationId || "24AADCS7412M1Z8"],
                ["UDYAM / MSME", "UDYAM-GJ-06-0044821"],
                ["PAN", "AADCS7412M"],
                ["Industry", "NIC-13111 — Textile Fibres"],
                ["Region", "Gujarat, India"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-foreground/40">{k}</span>
                  <span className="font-mono text-xs text-foreground/70">{v}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Subscription Plan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20">
                <p className="text-lg font-bold text-green-400">MVP Starter</p>
                <p className="text-xs text-foreground/40 mt-1">Unlimited MRV runs · 50 GIC/month · 1 user</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-foreground/40">GICs This Month</span><span className="font-bold">3 / 50</span></div>
                <div className="w-full h-2 rounded-full bg-foreground/[0.06]"><div className="h-full rounded-full bg-green-500" style={{ width: "6%" }} /></div>
              </div>
              <Button className="w-full bg-foreground/5 hover:bg-foreground/10 text-foreground/60">Upgrade Plan</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "devices" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-foreground/40">{devicesList.length} registered devices</p>
            <Button size="sm" className="gap-2 bg-green-500 text-black hover:bg-green-400"><Plus size={14} /> Add Device</Button>
          </div>
          {devicesList.map((d) => (
            <Card key={d.id} className="hover:border-foreground/10 transition-colors">
              <CardContent className="py-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${d.status === "online" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                  {d.status === "online" ? <Wifi size={18} className="text-green-400" /> : <WifiOff size={18} className="text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{d.type} — {d.model}</p>
                  <p className="text-xs text-foreground/30 font-mono">{d.id}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={d.status === "online" ? "text-green-400 border-green-500/20" : "text-red-400 border-red-500/20"}>{d.status}</Badge>
                  <p className="text-[10px] text-foreground/20 mt-1">Last: {d.lastData}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "team" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-foreground/40">{teamMembers.length} team members</p>
            <Button size="sm" className="gap-2 bg-green-500 text-black hover:bg-green-400"><Plus size={14} /> Invite Member</Button>
          </div>
          {teamMembers.map((m) => (
            <Card key={m.email} className="hover:border-foreground/10 transition-colors">
              <CardContent className="py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-foreground/[0.04] flex items-center justify-center text-sm font-bold text-foreground/40">{m.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="text-xs text-foreground/30">{m.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-foreground/50">{m.role}</Badge>
                  <p className="text-[10px] text-foreground/20 mt-1">{m.status}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
