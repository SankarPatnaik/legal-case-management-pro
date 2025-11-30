import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';
import Layout from '../components/Layout';

interface ClientCaseSummary {
  _id: string;
  title: string;
  status: string;
  caseType: string;
}

interface Client {
  _id: string;
  name: string;
  organization?: string;
  email?: string;
  phone?: string;
  notes?: string;
  cases: ClientCaseSummary[];
  createdAt: string;
}

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);

  const loadClients = async () => {
    setLoading(true);
    const res = await api.get('/clients');
    setClients(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await api.post('/clients', form);
    setForm({ name: '', organization: '', email: '', phone: '', notes: '' });
    setSaving(false);
    loadClients();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800">Add client</h2>
          <p className="text-sm text-slate-500 mb-4">Create a record for a client or matter contact.</p>
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                placeholder="Client or contact name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Organization</label>
              <input
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                placeholder="Law firm or company"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                placeholder="client@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                rows={3}
                placeholder="Key contacts, billing preferences or intake notes"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Add client'}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-base font-semibold text-slate-800">Client roster</h2>
            <p className="text-sm text-slate-500">Track matter owners and linked cases.</p>
          </div>
          {loading ? (
            <p className="p-4 text-sm text-slate-500">Loading clients...</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {clients.map((client) => (
                <div key={client._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">{client.name}</h3>
                      <p className="text-xs text-slate-500">{client.organization || 'Independent'}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {client.cases.length} open matters
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-600">
                    <div>📧 {client.email || 'No email added'}</div>
                    <div>📞 {client.phone || 'No phone added'}</div>
                    <div>Created {new Date(client.createdAt).toLocaleDateString()}</div>
                  </div>
                  {client.notes && (
                    <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{client.notes}</p>
                  )}
                  {client.cases.length > 0 && (
                    <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-600 mb-1">Linked cases</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {client.cases.map((c) => (
                          <div
                            key={c._id}
                            className="rounded-md bg-white border border-slate-200 px-3 py-2 text-xs text-slate-700 shadow-sm"
                          >
                            <div className="font-semibold text-slate-800">{c.title}</div>
                            <div className="text-slate-500">{c.caseType}</div>
                            <div className="mt-1 inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                              {c.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {clients.length === 0 && (
                <p className="p-4 text-sm text-slate-500">No clients yet. Add your first client above.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ClientsPage;
