"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart, Wallet, TrendingUp, Search, Filter, ShoppingCart, RefreshCw, Zap, ShieldCheck, Loader2, CheckCircle2
} from "lucide-react";
import { useApp } from "@/providers/app-provider"; // Assuming user context

interface MarketOrder {
    id: string;
    seller: string;
    type: string;
    quantity: number;
    price: number;
    location: string;
    methodology: string;
    entity_id: string;
}

export default function CarbonExchangePage() {
  const { user } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"MARKET" | "WALLET">("MARKET");
  
  const [walletData, setWalletData] = useState<any>(null);
  const [orders, setOrders] = useState<MarketOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTrading, setIsTrading] = useState<string | null>(null);
  const [tradeSuccess, setTradeSuccess] = useState<string | null>(null);

  const fetchWallet = async () => {
    try {
      const res = await fetch("/api/market/wallet");
      if (res.ok) setWalletData(await res.json());
    } catch (error) {
      console.error("Failed to fetch wallet", error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/market/orders");
      if (res.ok) setOrders(await res.json());
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchOrders();
  }, []);

  const handleBuy = async (orderId: string, quantity: number, price: number) => {
    const confirmBuy = window.confirm(`Confirm purchase of ${quantity} units at $${price.toFixed(2)} per unit? Total: $${(quantity * price).toFixed(2)}`);
    if (!confirmBuy) return;

    setIsTrading(orderId);
    try {
      const res = await fetch("/api/market/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            orderId,
            buyerEntityId: user?.entity?.id || "mock-buyer-id" // fallback for demo
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setTradeSuccess(orderId);
        // Refresh data
        await fetchWallet();
        await fetchOrders();
        setTimeout(() => setTradeSuccess(null), 3000);
      } else {
        alert(data.error || "Trade failed");
      }
    } catch (error) {
        console.error("Trade Error", error);
        alert("An error occurred while executing the trade.");
    } finally {
      setIsTrading(null);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.seller.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <LineChart className="text-green-400" size={24} /> Carbon Exchange
          </h1>
          <p className="text-sm text-foreground/40 mt-1">Trade verified I-RECs and Carbon Credits instantly.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-foreground/[0.03] p-1 rounded-lg border border-foreground/5 w-fit">
          <button 
            onClick={() => setActiveTab("MARKET")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "MARKET" ? "bg-green-500/10 text-green-400 shadow-sm" : "text-foreground/40 hover:text-foreground/80"}`}
          >
            Marketplace
          </button>
          <button 
            onClick={() => setActiveTab("WALLET")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === "WALLET" ? "bg-green-500/10 text-green-400 shadow-sm" : "text-foreground/40 hover:text-foreground/80"}`}
          >
            <Wallet size={14} /> My Wallet
          </button>
        </div>
      </div>

      {activeTab === "WALLET" ? (
        /* WALLET VIEW */
        <div className="space-y-6 animate-scale-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-green">
              <CardContent className="p-6">
                <p className="text-xs text-green-400/70 font-semibold tracking-wider uppercase mb-2">Fiat Balance (USD)</p>
                <p className="text-4xl font-black text-green-400 tabular-nums">
                  ${walletData ? walletData.fiat_balance.toLocaleString(undefined, {minimumFractionDigits: 2}) : "0.00"}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="bg-green-500 text-black hover:bg-green-400 flex-1 h-8 text-xs font-semibold cursor-pointer">Deposit</Button>
                  <Button size="sm" variant="outline" className="border-green-500/20 text-green-400 hover:bg-green-500/10 flex-1 h-8 text-xs cursor-pointer">Withdraw</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6">
                <p className="text-xs text-foreground/40 font-semibold tracking-wider uppercase mb-2">Carbon Credits (tCO₂e)</p>
                <p className="text-4xl font-black tabular-nums">{walletData ? walletData.carbon_credits.toLocaleString() : "0"}</p>
                <p className="text-xs text-green-400 mt-2 flex items-center gap-1"><TrendingUp size={12}/> Updated Live</p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6">
                <p className="text-xs text-foreground/40 font-semibold tracking-wider uppercase mb-2">I-RECs Owned (MWh)</p>
                <p className="text-4xl font-black tabular-nums">{walletData ? walletData.i_recs.toLocaleString() : "0"}</p>
                <p className="text-xs text-green-400 mt-2 flex items-center gap-1"><TrendingUp size={12}/> Updated Live</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="glass">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
              <ShieldCheck size={32} className="text-foreground/20" />
              <h3 className="text-sm font-semibold">Ready to Retire?</h3>
              <p className="text-xs text-foreground/40 max-w-md">You can select credits from your wallet to officially retire them against your corporate emissions. A cryptographic certificate of retirement will be generated.</p>
              <Button variant="outline" className="border-green-400/20 text-green-400 hover:bg-green-500/10 cursor-pointer h-8 text-xs mt-2" onClick={() => alert("Retirement module opening...")}>
                Retire Credits
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* MARKETPLACE VIEW */
        <div className="space-y-4 animate-scale-in">
          {/* Filters */}
          <div className="flex gap-3">
            <div className="flex items-center gap-2 glass rounded-lg px-3 py-2 flex-1 md:flex-none md:w-64">
              <Search size={14} className="text-foreground/30" />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sellers or assets..." 
                className="bg-transparent border-none text-sm outline-none w-full placeholder:text-foreground/20 text-foreground/80" 
              />
            </div>
            <Button variant="outline" className="glass border-foreground/5 hover:bg-foreground/5 cursor-pointer h-9 px-3 text-xs gap-2">
              <Filter size={14} /> Filters
            </Button>
            <Button onClick={fetchOrders} variant="outline" className="glass border-foreground/5 hover:bg-foreground/5 cursor-pointer h-9 w-9 p-0 flex items-center justify-center">
              <RefreshCw size={14} className={`text-foreground/40 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Order Book Grid */}
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-foreground/20 gap-2">
                <Loader2 size={24} className="animate-spin" />
                <span className="text-sm">Loading market orders...</span>
             </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredOrders.map(order => (
                <Card key={order.id} className="glass hover:border-green-500/30 hover:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-all duration-300 group cursor-default relative overflow-hidden">
                    {tradeSuccess === order.id && (
                        <div className="absolute inset-0 bg-green-500/10 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-fade-in border border-green-500/30">
                            <CheckCircle2 size={32} className="text-green-400 mb-2" />
                            <p className="text-green-400 font-bold text-sm">Trade Complete!</p>
                        </div>
                    )}
                    <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                        <Badge className={`text-[10px] mb-2 ${order.type === 'I-REC' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                            {order.type === 'I-REC' ? <Zap size={10} className="mr-1 inline" /> : null}
                            {order.type}
                        </Badge>
                        <h3 className="font-semibold text-sm">{order.seller}</h3>
                        <p className="text-[10px] text-foreground/40 mt-0.5">{order.methodology} • {order.location}</p>
                        </div>
                        <div className="text-right">
                        <p className="text-lg font-black text-green-400">${order.price.toFixed(2)}</p>
                        <p className="text-[9px] text-foreground/30 uppercase tracking-widest">per {order.type === 'I-REC' ? 'MWh' : 'tCO₂e'}</p>
                        </div>
                    </div>
                    
                    <div className="h-px w-full bg-foreground/5 my-3" />
                    
                    <div className="flex justify-between items-center">
                        <div>
                        <p className="text-[10px] text-foreground/40 uppercase tracking-wider mb-0.5">Available Volume</p>
                        <p className="text-sm font-medium tabular-nums">{order.quantity.toLocaleString()} {order.type === 'I-REC' ? 'MWh' : 'tCO₂e'}</p>
                        </div>
                        <Button 
                            size="sm" 
                            disabled={isTrading === order.id}
                            onClick={() => handleBuy(order.id, order.quantity, order.price)}
                            className="bg-foreground/5 hover:bg-green-500 hover:text-black text-foreground/80 border border-foreground/10 h-8 text-xs px-4 cursor-pointer transition-colors font-semibold group/btn disabled:opacity-50"
                        >
                        {isTrading === order.id ? (
                            <Loader2 size={13} className="animate-spin" />
                        ) : (
                            <><ShoppingCart size={13} className="mr-1.5 opacity-50 group-hover/btn:opacity-100" /> Buy</>
                        )}
                        </Button>
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>
          )}
          
          {!loading && filteredOrders.length === 0 && (
            <div className="py-12 text-center text-foreground/30 text-sm glass rounded-xl">
              No orders found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
