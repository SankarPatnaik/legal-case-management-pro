import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';
import Layout from '../components/Layout';

interface DiaryEntry {
  _id: string;
  title: string;
  note: string;
  date: string;
  priority: string;
  case?: { _id: string; title: string; caseType: string };
}

interface CaseOption {
  _id: string;
  title: string;
  caseType: string;
}

const DiaryPage: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [cases, setCases] = useState<CaseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    note: '',
    date: new Date().toISOString().substring(0, 10),
    priority: 'MEDIUM',
    caseId: ''
  });

  const loadEntries = async () => {
    const res = await api.get('/diary');
    setEntries(res.data);
  };

  const loadCases = async () => {
    const res = await api.get('/cases');
    setCases(res.data.map((c: any) => ({ _id: c._id, title: c.title, caseType: c.caseType })));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([loadEntries(), loadCases()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await api.post('/diary', {
      title: form.title,
      note: form.note,
      priority: form.priority,
      date: form.date,
      case: form.caseId || undefined
    });
    setForm({ ...form, title: '', note: '' });
    setSaving(false);
    loadEntries();
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold text-slate-800">Log diary entry</h2>
            <p className="text-sm text-slate-500 mb-4">Capture tasks, hearings and touchpoints for your matters.</p>
            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                  placeholder="E.g. Draft motion, prep for deposition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Case (optional)</label>
                <select
                  value={form.caseId}
                  onChange={(e) => setForm({ ...form, caseId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                >
                  <option value="">Unassigned</option>
                  {cases.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title} ({c.caseType})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Notes</label>
                <textarea
                  required
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                  placeholder="Key facts, deadlines or follow-ups"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Save entry'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-800">Diary</h2>
                <p className="text-sm text-slate-500">Time-stamped activity history across your caseload.</p>
              </div>
            </div>
            {loading ? (
              <p className="p-4 text-sm text-slate-500">Loading diary...</p>
            ) : entries.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">No diary entries yet. Capture your first update.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {entries.map((entry) => (
                  <li key={entry._id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">{entry.title}</h3>
                        <p className="text-xs text-slate-500">
                          {new Date(entry.date).toLocaleDateString()} {entry.case ? `· ${entry.case.title}` : ''}
                        </p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          entry.priority === 'HIGH'
                            ? 'bg-red-50 text-red-700'
                            : entry.priority === 'LOW'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {entry.priority}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{entry.note}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DiaryPage;
