import { useEffect, useState } from "react";
import { api } from "../api";
import { Trash2, Mail, MailOpen, Archive, Reply, X } from "lucide-react";

const statusColors = {
  unread: "bg-accent/20 text-orange-400",
  read: "bg-blue-900/30 text-blue-400",
  replied: "bg-green-900/30 text-green-400",
  archived: "bg-neutral-800 text-neutral-500",
};

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const r = await api.messages(filter ? { status: filter } : {}); setMessages(r.messages); }
    catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    await api.updateMessageStatus(id, status);
    setMessages((m) => m.map((x) => x._id === id ? { ...x, status } : x));
    if (selected?._id === id) setSelected((s) => ({ ...s, status }));
  };

  const del = async (id) => {
    await api.deleteMessage(id);
    setMessages((m) => m.filter((x) => x._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const open = (msg) => { setSelected(msg); if (msg.status === "unread") updateStatus(msg._id, "read"); };

  const filters = ["", "unread", "read", "replied", "archived"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-700 text-white">Messages</h1>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-500 capitalize transition-all ${filter === f ? "bg-accent text-white" : "bg-neutral-800 text-neutral-400 hover:text-white"}`}>
              {f || "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* List */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-500">
              <Mail size={28} className="mb-2 opacity-40" />
              <p className="text-sm">No messages</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {messages.map((m) => (
                <div key={m._id} onClick={() => open(m)}
                  className={`px-5 py-4 cursor-pointer hover:bg-neutral-800/50 transition-colors ${selected?._id === m._id ? "bg-neutral-800" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-500 text-sm ${m.status === "unread" ? "text-white" : "text-neutral-300"}`}>{m.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[m.status]}`}>{m.status}</span>
                      </div>
                      <p className="text-xs text-neutral-400 truncate">{m.subject}</p>
                      <p className="text-xs text-neutral-600 truncate mt-0.5">{m.message}</p>
                    </div>
                    <span className="text-xs text-neutral-600 whitespace-nowrap">{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="font-display font-600 text-white text-lg">{selected.subject}</h3>
                  <p className="text-sm text-neutral-400 mt-0.5">{selected.name} · {selected.email}</p>
                  <p className="text-xs text-neutral-600 mt-0.5">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-neutral-500 hover:text-white"><X size={16} /></button>
              </div>

              <div className="bg-neutral-800 rounded-xl p-4 mb-5">
                <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  onClick={() => updateStatus(selected._id, "replied")}
                  className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-xs font-500 px-4 py-2 rounded-xl transition-colors">
                  <Reply size={13} /> Reply
                </a>
                <button onClick={() => updateStatus(selected._id, "archived")}
                  className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-500 px-4 py-2 rounded-xl transition-colors">
                  <Archive size={13} /> Archive
                </button>
                <button onClick={() => del(selected._id)}
                  className="flex items-center gap-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs font-500 px-4 py-2 rounded-xl transition-colors">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-500">
              <MailOpen size={28} className="mb-2 opacity-40" />
              <p className="text-sm">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
