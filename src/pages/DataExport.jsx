import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check, Database, RefreshCw } from "lucide-react";
import { toast } from "sonner";

function escapeSQL(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return val;
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  return `'${String(val).replace(/'/g, "''")}'`;
}

function toISO(val) {
  if (!val) return "NULL";
  try {
    return `'${new Date(val).toISOString()}'`;
  } catch {
    return "NULL";
  }
}

function generateSQL(orders) {
  const lines = [];

  // CREATE TABLE
  lines.push(`-- BrawlMart Orders Export`);
  lines.push(`-- Generated: ${new Date().toISOString()}`);
  lines.push(`-- Total records: ${orders.length}`);
  lines.push(``);
  lines.push(`CREATE TABLE IF NOT EXISTS orders (`);
  lines.push(`  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`);
  lines.push(`  service_type TEXT,`);
  lines.push(`  current_rank TEXT,`);
  lines.push(`  desired_rank TEXT,`);
  lines.push(`  price NUMERIC(10, 2),`);
  lines.push(`  status TEXT DEFAULT 'pending',`);
  lines.push(`  customer_email TEXT,`);
  lines.push(`  customer_name TEXT,`);
  lines.push(`  notes TEXT,`);
  lines.push(`  created_by TEXT,`);
  lines.push(`  created_date TIMESTAMPTZ,`);
  lines.push(`  updated_date TIMESTAMPTZ`);
  lines.push(`);`);
  lines.push(``);

  if (orders.length === 0) {
    lines.push(`-- No order records found.`);
    return lines.join("\n");
  }

  lines.push(`-- INSERT statements`);
  lines.push(`INSERT INTO orders (`);
  lines.push(`  id, service_type, current_rank, desired_rank, price, status,`);
  lines.push(`  customer_email, customer_name, notes, created_by, created_date, updated_date`);
  lines.push(`) VALUES`);

  const rows = orders.map((o, i) => {
    const comma = i < orders.length - 1 ? "," : ";";
    return (
      `  (${escapeSQL(o.id)}, ${escapeSQL(o.service_type)}, ${escapeSQL(o.current_rank)}, ` +
      `${escapeSQL(o.desired_rank)}, ${o.price ?? "NULL"}, ${escapeSQL(o.status)}, ` +
      `${escapeSQL(o.customer_email)}, ${escapeSQL(o.customer_name)}, ${escapeSQL(o.notes)}, ` +
      `${escapeSQL(o.created_by)}, ${toISO(o.created_date)}, ${toISO(o.updated_date)})${comma}`
    );
  });

  lines.push(...rows);
  return lines.join("\n");
}

export default function DataExport() {
  const [orders, setOrders] = useState(null);
  const [sql, setSql] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchAndGenerate = async () => {
    setLoading(true);
    const data = await base44.entities.Order.list("-created_date", 1000);
    setOrders(data);
    setSql(generateSQL(data));
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    toast.success("SQL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([sql], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brawlmart_export_${new Date().toISOString().slice(0, 10)}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30">
            <Database className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Data Export</h1>
            <p className="text-slate-500 text-sm">Export orders as PostgreSQL-compatible SQL for Supabase</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-6">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div>
              <p className="text-white font-semibold">Orders Table</p>
              {orders !== null && (
                <p className="text-slate-500 text-sm">{orders.length} record{orders.length !== 1 ? "s" : ""} found</p>
              )}
            </div>
            <Button
              onClick={fetchAndGenerate}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Loading...</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" /> Generate SQL</>
              )}
            </Button>
          </div>
        </div>

        {sql && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <span className="text-sm font-semibold text-slate-300">PostgreSQL Output</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCopy}
                  className="border-white/10 text-slate-300 hover:text-white hover:bg-white/10">
                  {copied ? <Check className="w-4 h-4 mr-1 text-green-400" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button size="sm" onClick={handleDownload}
                  className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Download className="w-4 h-4 mr-1" /> Download .sql
                </Button>
              </div>
            </div>
            <pre className="p-6 text-xs text-slate-300 font-mono overflow-auto max-h-[60vh] whitespace-pre-wrap break-all leading-relaxed">
              {sql}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}