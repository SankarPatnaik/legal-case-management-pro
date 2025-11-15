import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';
import Layout from '../components/Layout';
import { useAuth } from '../state/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CaseItem {
  _id: string;
  title: string;
  caseType: string;
  status: string;
  priority: string;
  assignedTo?: { name: string; email: string };
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/cases');
        setCases(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Welcome back, {user?.name}
            </h2>
            <p className="text-sm text-slate-500">
              Overview of active legal matters and cases.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading cases...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">Title</th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">Type</th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">Priority</th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">Assigned To</th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cases.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/cases/${c._id}`)}
                  >
                    <td className="px-4 py-2">{c.title}</td>
                    <td className="px-4 py-2">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {c.caseType}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          c.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700'
                            : c.status === 'INVESTIGATION'
                            ? 'bg-amber-50 text-amber-700'
                            : c.status === 'CLOSED'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-sky-50 text-sky-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          c.priority === 'HIGH'
                            ? 'bg-red-50 text-red-700'
                            : c.priority === 'MEDIUM'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-4 py-2">{c.assignedTo?.name || '-'}</td>
                    <td className="px-4 py-2 text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {cases.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-center text-sm text-slate-500"
                    >
                      No cases yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
