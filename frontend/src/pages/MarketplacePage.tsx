import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/apiClient';
import Layout from '../components/Layout';

interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}

interface LawyerProfile {
  _id: string;
  fullName: string;
  headline?: string;
  bio?: string;
  practiceAreas: string[];
  jurisdictions: string[];
  languages: string[];
  rateType: string;
  rateAmount?: number;
  availability: AvailabilitySlot[];
  yearsExperience?: number;
  verificationStatus: string;
  badges: string[];
  reviewsSummary?: { averageRating: number; totalReviews: number };
}

interface Booking {
  _id: string;
  lawyerProfile: LawyerProfile;
  contactName: string;
  contactEmail: string;
  practiceArea: string;
  message?: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  status: string;
  rateType: string;
  priceQuote?: number;
  currency?: string;
  createdAt: string;
}

interface IntakeForm {
  _id: string;
  contactName: string;
  contactEmail: string;
  practiceArea: string;
  caseType?: string;
  description?: string;
  budget?: number;
  urgency?: string;
  jurisdiction?: string;
  preferredContactMethod?: string;
  status: string;
  createdAt: string;
}

const emptyAvailability: AvailabilitySlot = {
  dayOfWeek: 1,
  startTime: '09:00',
  endTime: '17:00',
  timezone: 'UTC'
};

const MarketplacePage: React.FC = () => {
  const [filters, setFilters] = useState({
    practiceArea: '',
    language: '',
    jurisdiction: '',
    rateType: '',
    search: ''
  });
  const [profiles, setProfiles] = useState<LawyerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    headline: '',
    bio: '',
    practiceAreas: '',
    jurisdictions: '',
    languages: '',
    rateType: 'HOURLY',
    rateAmount: 250,
    yearsExperience: 5,
    verificationStatus: 'PENDING',
    badges: 'Featured,Verified',
    availability: [emptyAvailability]
  });
  const [bookingForm, setBookingForm] = useState({
    contactName: '',
    contactEmail: '',
    practiceArea: '',
    message: '',
    startsAt: '',
    endsAt: '',
    timezone: 'UTC',
    rateType: 'HOURLY',
    priceQuote: 0,
    currency: 'USD'
  });
  const [selectedProfile, setSelectedProfile] = useState<LawyerProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [intakeForm, setIntakeForm] = useState({
    contactName: '',
    contactEmail: '',
    practiceArea: '',
    caseType: '',
    description: '',
    budget: '',
    urgency: 'MEDIUM',
    jurisdiction: '',
    preferredContactMethod: 'EMAIL'
  });
  const [intakes, setIntakes] = useState<IntakeForm[]>([]);

  const loadProfiles = async () => {
    setLoading(true);
    const res = await api.get('/lawyers', { params: filters });
    setProfiles(res.data);
    setLoading(false);
  };

  const loadBookings = async () => {
    const res = await api.get('/bookings');
    setBookings(res.data);
  };

  const loadIntakes = async () => {
    const res = await api.get('/intake');
    setIntakes(res.data);
  };

  useEffect(() => {
    loadProfiles();
    loadBookings();
    loadIntakes();
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [filters.practiceArea, filters.language, filters.jurisdiction, filters.rateType, filters.search]);

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...profileForm,
      practiceAreas: profileForm.practiceAreas.split(',').map((p) => p.trim()).filter(Boolean),
      jurisdictions: profileForm.jurisdictions.split(',').map((p) => p.trim()).filter(Boolean),
      languages: profileForm.languages.split(',').map((p) => p.trim()).filter(Boolean),
      badges: profileForm.badges.split(',').map((p) => p.trim()).filter(Boolean)
    };
    await api.post('/lawyers', payload);
    loadProfiles();
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;
    await api.post('/bookings', {
      ...bookingForm,
      lawyerProfile: selectedProfile._id
    });
    setBookingForm({
      contactName: '',
      contactEmail: '',
      practiceArea: '',
      message: '',
      startsAt: '',
      endsAt: '',
      timezone: 'UTC',
      rateType: 'HOURLY',
      priceQuote: 0,
      currency: 'USD'
    });
    setSelectedProfile(null);
    loadBookings();
  };

  const submitIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/intake', intakeForm);
    setIntakeForm({
      contactName: '',
      contactEmail: '',
      practiceArea: '',
      caseType: '',
      description: '',
      budget: '',
      urgency: 'MEDIUM',
      jurisdiction: '',
      preferredContactMethod: 'EMAIL'
    });
    loadIntakes();
  };

  const selectedAvailability = useMemo(() => selectedProfile?.availability || [], [selectedProfile]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Marketplace</h2>
              <p className="text-sm text-slate-500">
                Search verified lawyers, publish profiles, capture intake, and request consultations.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 w-full md:w-auto">
              <input
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search keywords"
                className="rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
              />
              <input
                value={filters.practiceArea}
                onChange={(e) => setFilters({ ...filters, practiceArea: e.target.value })}
                placeholder="Practice area"
                className="rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
              />
              <input
                value={filters.jurisdiction}
                onChange={(e) => setFilters({ ...filters, jurisdiction: e.target.value })}
                placeholder="Jurisdiction"
                className="rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
              />
              <input
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                placeholder="Language"
                className="rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
              />
              <select
                value={filters.rateType}
                onChange={(e) => setFilters({ ...filters, rateType: e.target.value })}
                className="rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
              >
                <option value="">Rate type</option>
                <option value="HOURLY">Hourly</option>
                <option value="FLAT">Flat fee</option>
                <option value="CONTINGENCY">Contingency</option>
              </select>
            </div>
          </div>
          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Loading profiles...</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((profile) => (
                <div key={profile._id} className="rounded-lg border border-slate-200 p-4 shadow-sm bg-slate-50">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-slate-800">{profile.fullName}</h3>
                      <p className="text-sm text-slate-600">{profile.headline || 'Experienced counsel'}</p>
                      <p className="mt-2 text-sm text-slate-600">{profile.bio}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {profile.verificationStatus}
                      </span>
                      <div className="text-xs text-slate-500">
                        {profile.reviewsSummary?.averageRating || '—'} ★ ({profile.reviewsSummary?.totalReviews || 0})
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-700">
                    {profile.practiceAreas.map((area) => (
                      <span key={area} className="rounded-full bg-white px-3 py-1 shadow-sm border border-slate-200">
                        {area}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>Jurisdictions: {profile.jurisdictions.join(', ') || 'N/A'}</div>
                    <div>Languages: {profile.languages.join(', ') || 'N/A'}</div>
                    <div>
                      Rate: {profile.rateType} {profile.rateAmount ? `$${profile.rateAmount}` : ''}
                    </div>
                    <div>Experience: {profile.yearsExperience || '—'} years</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
                    {profile.badges.map((badge) => (
                      <span key={badge} className="rounded-full bg-sky-50 px-2 py-1 text-sky-700 font-medium">
                        {badge}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-xs text-slate-500">
                      Availability: {profile.availability.length} slot(s)
                    </div>
                    <button
                      onClick={() => setSelectedProfile(profile)}
                      className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
                    >
                      Request consult
                    </button>
                  </div>
                </div>
              ))}
              {profiles.length === 0 && (
                <p className="text-sm text-slate-500">No profiles match these filters yet.</p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-base font-semibold text-slate-800">Publish or update your lawyer profile</h3>
            <p className="text-sm text-slate-500 mb-4">Add practice focus, rates, and availability to be discoverable.</p>
            <form onSubmit={submitProfile} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Full name</label>
                  <input
                    required
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Headline</label>
                  <input
                    value={profileForm.headline}
                    onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Practice areas (comma separated)</label>
                  <input
                    value={profileForm.practiceAreas}
                    onChange={(e) => setProfileForm({ ...profileForm, practiceAreas: e.target.value })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Jurisdictions (comma separated)</label>
                  <input
                    value={profileForm.jurisdictions}
                    onChange={(e) => setProfileForm({ ...profileForm, jurisdictions: e.target.value })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Languages (comma separated)</label>
                  <input
                    value={profileForm.languages}
                    onChange={(e) => setProfileForm({ ...profileForm, languages: e.target.value })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Badges</label>
                  <input
                    value={profileForm.badges}
                    onChange={(e) => setProfileForm({ ...profileForm, badges: e.target.value })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Rate type</label>
                  <select
                    value={profileForm.rateType}
                    onChange={(e) => setProfileForm({ ...profileForm, rateType: e.target.value })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  >
                    <option value="HOURLY">Hourly</option>
                    <option value="FLAT">Flat fee</option>
                    <option value="CONTINGENCY">Contingency</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Rate amount</label>
                  <input
                    type="number"
                    value={profileForm.rateAmount}
                    onChange={(e) => setProfileForm({ ...profileForm, rateAmount: Number(e.target.value) })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Years experience</label>
                  <input
                    type="number"
                    value={profileForm.yearsExperience}
                    onChange={(e) => setProfileForm({ ...profileForm, yearsExperience: Number(e.target.value) })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Availability</label>
                {profileForm.availability.map((slot, idx) => (
                  <div key={idx} className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
                    <input
                      type="number"
                      min={0}
                      max={6}
                      value={slot.dayOfWeek}
                      onChange={(e) => {
                        const next = [...profileForm.availability];
                        next[idx] = { ...next[idx], dayOfWeek: Number(e.target.value) };
                        setProfileForm({ ...profileForm, availability: next });
                      }}
                      className="rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    />
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => {
                        const next = [...profileForm.availability];
                        next[idx] = { ...next[idx], startTime: e.target.value };
                        setProfileForm({ ...profileForm, availability: next });
                      }}
                      className="rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    />
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => {
                        const next = [...profileForm.availability];
                        next[idx] = { ...next[idx], endTime: e.target.value };
                        setProfileForm({ ...profileForm, availability: next });
                      }}
                      className="rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    />
                    <input
                      value={slot.timezone}
                      onChange={(e) => {
                        const next = [...profileForm.availability];
                        next[idx] = { ...next[idx], timezone: e.target.value };
                        setProfileForm({ ...profileForm, availability: next });
                      }}
                      className="rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setProfileForm({ ...profileForm, availability: [...profileForm.availability, emptyAvailability] })}
                  className="mt-2 text-xs font-semibold text-sky-700 hover:underline"
                >
                  + Add availability slot
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Save profile
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-base font-semibold text-slate-800">Guided intake</h3>
            <p className="text-sm text-slate-500 mb-4">Collect matter details, contact preferences, and triage priority.</p>
            <form onSubmit={submitIntake} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Contact name</label>
                  <input
                    required
                    value={intakeForm.contactName}
                    onChange={(e) => setIntakeForm({ ...intakeForm, contactName: e.target.value })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Contact email</label>
                  <input
                    required
                    type="email"
                    value={intakeForm.contactEmail}
                    onChange={(e) => setIntakeForm({ ...intakeForm, contactEmail: e.target.value })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Practice area</label>
                  <input
                    required
                    value={intakeForm.practiceArea}
                    onChange={(e) => setIntakeForm({ ...intakeForm, practiceArea: e.target.value })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Case type</label>
                  <input
                    value={intakeForm.caseType}
                    onChange={(e) => setIntakeForm({ ...intakeForm, caseType: e.target.value })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Summary</label>
                <textarea
                  value={intakeForm.description}
                  onChange={(e) => setIntakeForm({ ...intakeForm, description: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Budget</label>
                  <input
                    value={intakeForm.budget}
                    onChange={(e) => setIntakeForm({ ...intakeForm, budget: e.target.value })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Urgency</label>
                  <select
                    value={intakeForm.urgency}
                    onChange={(e) => setIntakeForm({ ...intakeForm, urgency: e.target.value })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Jurisdiction</label>
                  <input
                    value={intakeForm.jurisdiction}
                    onChange={(e) => setIntakeForm({ ...intakeForm, jurisdiction: e.target.value })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Preferred contact</label>
                  <select
                    value={intakeForm.preferredContactMethod}
                    onChange={(e) => setIntakeForm({ ...intakeForm, preferredContactMethod: e.target.value })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  >
                    <option value="EMAIL">Email</option>
                    <option value="PHONE">Phone</option>
                    <option value="VIDEO">Video</option>
                  </select>
                </div>
                <div className="flex items-end justify-end">
                  <button
                    type="submit"
                    className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
                  >
                    Submit intake
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-4 divide-y divide-slate-100">
              {intakes.map((item) => (
                <div key={item._id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.contactName}</p>
                      <p className="text-xs text-slate-500">{item.practiceArea} • {item.caseType}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                  <p className="text-xs text-slate-500">Submitted {new Date(item.createdAt).toLocaleString()}</p>
                </div>
              ))}
              {intakes.length === 0 && <p className="text-sm text-slate-500">No intake submissions yet.</p>}
            </div>
          </div>
        </div>

        {selectedProfile && (
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Book a consultation</h3>
                <p className="text-sm text-slate-500">Request time with {selectedProfile.fullName}.</p>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-600">
              <p>Availability preview:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedAvailability.map((slot, idx) => (
                  <span key={idx} className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                    Day {slot.dayOfWeek} • {slot.startTime}-{slot.endTime} {slot.timezone}
                  </span>
                ))}
                {selectedAvailability.length === 0 && <span>No availability published.</span>}
              </div>
            </div>
            <form onSubmit={submitBooking} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Contact name</label>
                <input
                  required
                  value={bookingForm.contactName}
                  onChange={(e) => setBookingForm({ ...bookingForm, contactName: e.target.value })}
                  className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Contact email</label>
                <input
                  required
                  type="email"
                  value={bookingForm.contactEmail}
                  onChange={(e) => setBookingForm({ ...bookingForm, contactEmail: e.target.value })}
                  className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Practice area</label>
                <input
                  required
                  value={bookingForm.practiceArea}
                  onChange={(e) => setBookingForm({ ...bookingForm, practiceArea: e.target.value })}
                  className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Message</label>
                <input
                  value={bookingForm.message}
                  onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                  className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Start</label>
                <input
                  required
                  type="datetime-local"
                  value={bookingForm.startsAt}
                  onChange={(e) => setBookingForm({ ...bookingForm, startsAt: e.target.value })}
                  className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">End</label>
                <input
                  required
                  type="datetime-local"
                  value={bookingForm.endsAt}
                  onChange={(e) => setBookingForm({ ...bookingForm, endsAt: e.target.value })}
                  className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Timezone</label>
                <input
                  value={bookingForm.timezone}
                  onChange={(e) => setBookingForm({ ...bookingForm, timezone: e.target.value })}
                  className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Rate type</label>
                  <select
                    value={bookingForm.rateType}
                    onChange={(e) => setBookingForm({ ...bookingForm, rateType: e.target.value })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  >
                    <option value="HOURLY">Hourly</option>
                    <option value="FLAT">Flat fee</option>
                    <option value="CONTINGENCY">Contingency</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Quote</label>
                  <input
                    type="number"
                    value={bookingForm.priceQuote}
                    onChange={(e) => setBookingForm({ ...bookingForm, priceQuote: Number(e.target.value) })}
                    className="mt-1 w-full rounded-md border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
                >
                  Send booking request
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-slate-800">Bookings</h3>
          <p className="text-sm text-slate-500 mb-3">Track consultation requests, rates, and status across the marketplace.</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Lawyer</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Contact</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Practice</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">When</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Rate</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50">
                    <td className="px-3 py-2">{booking.lawyerProfile?.fullName}</td>
                    <td className="px-3 py-2">{booking.contactName}<br />{booking.contactEmail}</td>
                    <td className="px-3 py-2">{booking.practiceArea}</td>
                    <td className="px-3 py-2 text-slate-600">
                      {new Date(booking.startsAt).toLocaleString()} → {new Date(booking.endsAt).toLocaleTimeString()} ({booking.timezone})
                    </td>
                    <td className="px-3 py-2">{booking.rateType} {booking.priceQuote ? `$${booking.priceQuote}` : ''}</td>
                    <td className="px-3 py-2">
                      <span className="rounded-full bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">{booking.status}</span>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-sm text-slate-500" colSpan={6}>
                      No bookings yet. Publish a profile and request time above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MarketplacePage;
