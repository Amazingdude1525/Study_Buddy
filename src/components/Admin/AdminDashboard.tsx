import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, Camera, ArrowLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingOrbs from "../FloatingOrbs";
import { getAdminLogs, getAdminSnapshots, getAdminUsers } from "../../services/api";

export default function AdminDashboard() {
  const [tab, setTab] = useState<"logs" | "snapshots" | "users">("logs");
  const [logs, setLogs] = useState<any[]>([]);
  const [snaps, setSnaps] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [lRes, sRes, uRes] = await Promise.all([
          getAdminLogs(), getAdminSnapshots(), getAdminUsers()
        ]);
        setLogs(lRes.data);
        setSnaps(sRes.data);
        setUsers(uRes.data);
      } catch (e) {
        console.error("Admin fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="mesh-gradient-bg min-h-screen">
      <FloatingOrbs />
      <div className="relative z-10 p-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Security Admin</h1>
            <p className="text-sm text-muted-foreground">Fraud tracking & identity verification</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-lg bg-secondary/20 w-fit overflow-x-auto">
          {([
            { key: "logs" as const, label: "Access Logs", icon: Eye },
            { key: "snapshots" as const, label: "Snapshot Audit", icon: Camera },
            { key: "users" as const, label: "Users", icon: Users },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === t.key && (
                <motion.div
                  layoutId="admin-tab"
                  className="absolute inset-0 rounded-md glass-card"
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
              <t.icon className="h-4 w-4 relative z-10" />
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        {tab === "logs" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  {["User Email", "IP Address", "Location", "Timestamp"].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/10 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{users.find(u => u.id === log.user_id)?.email || log.user_id}</td>
                    <td className="px-6 py-4 mono-font text-muted-foreground">{log.ip_address || '127.0.0.1'}</td>
                    <td className="px-6 py-4 text-muted-foreground">{log.location_city ? `${log.location_city}, ${log.location_country}` : 'Local'}</td>
                    <td className="px-6 py-4 mono-font text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</td>
                  </motion.tr>
                ))}
                {logs.length === 0 && !loading && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No access logs found.</td></tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}

        {tab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  {["Auth ID", "Name", "Email", "Joined", "Admin"].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/10">
                    <td className="px-6 py-4 mono-font text-muted-foreground text-xs">{u.google_sub.substring(0, 10)}...</td>
                    <td className="px-6 py-4 font-medium">{u.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                    <td className="px-6 py-4 mono-font text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-xs">{u.is_admin ? "✅ True" : ""}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {tab === "snapshots" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {snaps.map((snap, i) => (
              <motion.div
                key={snap.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (i % 10) * 0.05 }}
                className="glass-card overflow-hidden break-inside-avoid relative group"
              >
                <div className="aspect-[4/3] bg-black flex relative items-center justify-center overflow-hidden">
                  <img src={snap.image_base64.startsWith('data:') ? snap.image_base64 : `data:image/jpeg;base64,${snap.image_base64}`} alt="Webcam Capture" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white border border-white/20">
                    {snap.emotion_detected}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium truncate">{users.find(u => u.id === snap.user_id)?.email || snap.user_id}</p>
                  <p className="text-[10px] text-muted-foreground mono-font mt-1">{new Date(snap.timestamp).toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
            {snaps.length === 0 && !loading && <div className="p-8 text-center text-muted-foreground w-full">No webcam snapshots captured yet.</div>}
          </motion.div>
        )}
      </div>
    </div>
  );
}
