import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/apiClient';
import Layout from '../components/Layout';
import { useAuth } from '../state/AuthContext';

interface TimeEntry {
  _id: string;
  description: string;
  hours: number;
  rate: number;
  totalAmount: number;
  createdAt: string;
  case?: { title: string };
  user?: { name: string };
}

interface InvoiceItemInput {
  description: string;
  quantity: number;
  rate: number;
}

interface Invoice {
  _id: string;
  total: number;
  status: string;
  dueDate?: string;
  currency: string;
  client?: { name: string };
  case?: { title: string };
  createdAt: string;
}

interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  billable: boolean;
  createdAt: string;
}

const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [timeForm, setTimeForm] = useState({
    case: '',
    description: '',
    hours: 1,
    rate: 100,
    billable: true
  });

  const [invoiceForm, setInvoiceForm] = useState({
    client: '',
    case: '',
    taxRate: 18,
    currency: 'INR',
    gstNumber: '',
    dueDate: ''
  });

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemInput[]>([
    { description: 'Professional services', quantity: 1, rate: 1000 }
  ]);

  const [expenseForm, setExpenseForm] = useState({
    case: '',
    client: '',
    description: '',
    amount: 0,
    category: 'OTHER',
    billable: true
  });

  const invoicePreview = useMemo(() => {
    const subtotal = invoiceItems.reduce((acc, item) => acc + item.quantity * item.rate, 0);
    const taxAmount = subtotal * (invoiceForm.taxRate / 100);
    return {
      subtotal,
      taxAmount,
      total: subtotal + taxAmount
    };
  }, [invoiceItems, invoiceForm.taxRate]);

  const loadData = async () => {
    const [timeRes, invoiceRes, expenseRes] = await Promise.all([
      api.get('/billing/time-entries'),
      api.get('/billing/invoices'),
      api.get('/billing/expenses')
    ]);
    setTimeEntries(timeRes.data);
    setInvoices(invoiceRes.data);
    setExpenses(expenseRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/billing/time-entries', timeForm);
    setTimeForm({ ...timeForm, description: '', hours: 1 });
    loadData();
  };

  const handleInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/billing/invoices', {
      ...invoiceForm,
      items: invoiceItems
    });
    setInvoiceForm({ ...invoiceForm, case: '', client: '', gstNumber: '' });
    loadData();
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/billing/expenses', expenseForm);
    setExpenseForm({ ...expenseForm, description: '', amount: 0 });
    loadData();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">Log Time Entry</h3>
            <p className="text-xs text-slate-500">Capture billable and non-billable work against matters.</p>
            <form className="mt-3 space-y-3" onSubmit={handleTimeSubmit}>
              <input
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="Case ID"
                value={timeForm.case}
                onChange={(e) => setTimeForm({ ...timeForm, case: e.target.value })}
                required
              />
              <textarea
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="Work description"
                value={timeForm.description}
                onChange={(e) => setTimeForm({ ...timeForm, description: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  step={0.25}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Hours"
                  value={timeForm.hours}
                  onChange={(e) => setTimeForm({ ...timeForm, hours: Number(e.target.value) })}
                />
                <input
                  type="number"
                  min={0}
                  step={10}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Rate"
                  value={timeForm.rate}
                  onChange={(e) => setTimeForm({ ...timeForm, rate: Number(e.target.value) })}
                />
              </div>
              <label className="flex items-center space-x-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={timeForm.billable}
                  onChange={(e) => setTimeForm({ ...timeForm, billable: e.target.checked })}
                />
                <span>Billable</span>
              </label>
              <button
                type="submit"
                className="w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Log time
              </button>
            </form>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">Create Invoice</h3>
            <p className="text-xs text-slate-500">GST-friendly invoices mapped to cases and clients.</p>
            <form className="mt-3 space-y-2" onSubmit={handleInvoiceSubmit}>
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Client ID"
                  value={invoiceForm.client}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, client: e.target.value })}
                  required
                />
                <input
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Case ID (optional)"
                  value={invoiceForm.case}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, case: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  placeholder="GST Number"
                  value={invoiceForm.gstNumber}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, gstNumber: e.target.value })}
                />
                <input
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Due date"
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Tax %"
                  value={invoiceForm.taxRate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, taxRate: Number(e.target.value) })}
                />
                <input
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Currency"
                  value={invoiceForm.currency}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, currency: e.target.value })}
                />
              </div>
              <div className="rounded-md border border-slate-200 p-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Line items</span>
                  <button
                    type="button"
                    className="text-emerald-600"
                    onClick={() =>
                      setInvoiceItems([...invoiceItems, { description: 'Service', quantity: 1, rate: 0 }])
                    }
                  >
                    + Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {invoiceItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-5 gap-2">
                      <input
                        className="col-span-2 rounded-md border border-slate-200 px-3 py-2 text-sm"
                        value={item.description}
                        onChange={(e) => {
                          const next = [...invoiceItems];
                          next[idx].description = e.target.value;
                          setInvoiceItems(next);
                        }}
                      />
                      <input
                        type="number"
                        className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                        value={item.quantity}
                        onChange={(e) => {
                          const next = [...invoiceItems];
                          next[idx].quantity = Number(e.target.value);
                          setInvoiceItems(next);
                        }}
                      />
                      <input
                        type="number"
                        className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                        value={item.rate}
                        onChange={(e) => {
                          const next = [...invoiceItems];
                          next[idx].rate = Number(e.target.value);
                          setInvoiceItems(next);
                        }}
                      />
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>
                          {(item.quantity * item.rate).toLocaleString('en-IN', {
                            style: 'currency',
                            currency: invoiceForm.currency || 'INR'
                          })}
                        </span>
                        <button
                          type="button"
                          className="text-rose-600"
                          onClick={() => setInvoiceItems(invoiceItems.filter((_, i) => i !== idx))}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{invoicePreview.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({invoiceForm.taxRate}%)</span>
                    <span>{invoicePreview.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Total</span>
                    <span>{invoicePreview.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
              >
                Create invoice
              </button>
            </form>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Recent time entries</h3>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                {user?.name}
              </span>
            </div>
            <div className="mt-3 space-y-3 text-sm">
              {timeEntries.map((entry) => (
                <div key={entry._id} className="rounded-md border border-slate-100 p-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{entry.case?.title || 'Case'}</span>
                    <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-1 text-slate-800">{entry.description}</p>
                  <p className="text-xs text-slate-600">
                    {entry.hours}h @ {entry.rate} → {entry.totalAmount.toFixed(2)}
                  </p>
                </div>
              ))}
              {timeEntries.length === 0 && <p className="text-xs text-slate-500">No entries yet.</p>}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Invoices</h3>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                Billing
              </span>
            </div>
            <div className="mt-3 space-y-3 text-sm">
              {invoices.map((inv) => (
                <div key={inv._id} className="rounded-md border border-slate-100 p-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{inv.client?.name || 'Client'}</span>
                    <span>{new Date(inv.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-800">{inv.case?.title || 'General matter'}</p>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>
                      {inv.total.toLocaleString('en-IN', { style: 'currency', currency: inv.currency || 'INR' })}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 font-medium uppercase text-slate-700">
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
              {invoices.length === 0 && <p className="text-xs text-slate-500">No invoices yet.</p>}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Expenses</h3>
              <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
                Disbursements
              </span>
            </div>
            <form className="mt-3 space-y-2" onSubmit={handleExpenseSubmit}>
              <input
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="Case ID (optional)"
                value={expenseForm.case}
                onChange={(e) => setExpenseForm({ ...expenseForm, case: e.target.value })}
              />
              <input
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="Client ID (optional)"
                value={expenseForm.client}
                onChange={(e) => setExpenseForm({ ...expenseForm, client: e.target.value })}
              />
              <input
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="Description"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  step={10}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Amount"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                  required
                />
                <select
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                >
                  <option value="OTHER">Other</option>
                  <option value="COURT_FEE">Court fee</option>
                  <option value="FILING">Filing</option>
                  <option value="TRAVEL">Travel</option>
                </select>
              </div>
              <label className="flex items-center space-x-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={expenseForm.billable}
                  onChange={(e) => setExpenseForm({ ...expenseForm, billable: e.target.checked })}
                />
                <span>Billable</span>
              </label>
              <button
                type="submit"
                className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Record expense
              </button>
            </form>
            <div className="mt-4 space-y-2 text-xs text-slate-600">
              {expenses.map((exp) => (
                <div key={exp._id} className="rounded-md border border-slate-100 p-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{new Date(exp.createdAt).toLocaleDateString()}</span>
                    <span className="uppercase">{exp.category}</span>
                  </div>
                  <p className="text-sm text-slate-800">{exp.description}</p>
                  <p className="text-[11px] text-slate-600">₹{exp.amount.toFixed(2)}</p>
                </div>
              ))}
              {expenses.length === 0 && <p className="text-xs text-slate-500">No expenses logged.</p>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BillingPage;
