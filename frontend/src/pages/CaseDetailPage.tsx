import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/apiClient';
import Layout from '../components/Layout';

interface Party {
  name: string;
  role: string;
}

interface CaseData {
  _id: string;
  title: string;
  description?: string;
  caseType: string;
  status: string;
  priority: string;
  region?: string;
  jurisdiction?: string;
  parties?: Party[];
  assignedTo?: { name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/cases/${id}`);
        setData(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <p className="text-sm text-slate-500">Loading case...</p>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <p className="text-sm text-red-500">Case not found.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">{data.title}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {data.caseType} · Created {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-slate-500">Status:</span>{' '}
              <span className="inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">
                {data.status}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Priority:</span>{' '}
              <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                {data.priority}
              </span>
            </div>
          </div>
        </div>

        {data.description && (
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Description</h3>
            <p className="text-sm text-slate-700 whitespace-pre-line">{data.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Case Details</h3>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Region</dt>
                <dd className="text-slate-800">{data.region || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Jurisdiction</dt>
                <dd className="text-slate-800">{data.jurisdiction || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Assigned To</dt>
                <dd className="text-slate-800">{data.assignedTo?.name || '-'}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Parties</h3>
            {data.parties && data.parties.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {data.parties.map((p, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span className="text-slate-800">{p.name}</span>
                    <span className="text-slate-500 text-xs">{p.role}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No parties recorded.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CaseDetailPage;
