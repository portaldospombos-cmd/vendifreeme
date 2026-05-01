import AdminLayout from '../components/AdminLayout';
import { AlertTriangle, CheckCircle, XCircle, Eye, Flag, Filter, Search } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

const reports = [
  { id: 1, type: 'Listing', target: 'iPhone 15 Pro Max - $200', reporter: 'User_492', reason: 'Suspected Scam', date: '2 hours ago', severity: 'High' },
  { id: 2, type: 'User', target: 'Scammer_99', reporter: 'User_120', reason: 'Harassment', date: '5 hours ago', severity: 'Medium' },
  { id: 3, type: 'Comment', target: 'Nice item, but...', reporter: 'User_88', reason: 'Spam', date: '1 day ago', severity: 'Low' },
  { id: 4, type: 'Listing', target: 'Designer Bag (Fake)', reporter: 'User_331', reason: 'Counterfeit', date: '1 day ago', severity: 'High' },
];

export default function AdminModeration() {
  const { showToast } = useAdmin();

  const handleAction = (id: number, type: string) => {
    showToast(`Report #${id} ${type} processed`, 'success');
  };

  return (
    <AdminLayout title="Moderation Queue">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
            <h4 className="text-sm font-black font-headline uppercase tracking-widest text-on-surface-variant mb-4">Filter Reports</h4>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-on-surface-variant mb-2 block">Severity</label>
                <select className="w-full bg-surface-container-low/50 border border-outline-variant/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" onChange={() => showToast('Filtering by severity...')}>
                  <option>All Severities</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant mb-2 block">Report Type</label>
                <div className="space-y-2">
                  {['Listing', 'User', 'Comment', 'Message'].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary/20" onChange={() => showToast(`Filter updated: ${type}`)} />
                      <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center font-bold">
                <Flag size={16} />
              </div>
              <h4 className="font-bold text-sm text-primary">Moderator Tip</h4>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Prioritize High severity reports first. These often involve scams or counterfeit items that harm the community trust.
            </p>
          </div>
        </div>

        {/* Reports List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-outline-variant/10 flex items-center gap-4 mb-6">
            <Search className="text-on-surface-variant/40" size={20} />
            <input type="text" placeholder="Search reports..." className="flex-1 bg-transparent outline-none text-sm" onChange={(e) => e.target.value.length > 2 && showToast(`Searching for "${e.target.value}"`)} />
          </div>

          {reports.map((report) => (
            <div key={report.id} className="bg-white p-6 rounded-3xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6">
              <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center ${
                report.severity === 'High' ? 'bg-error/10 text-error' : 
                report.severity === 'Medium' ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                <AlertTriangle size={28} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">{report.type} Report</span>
                    <h4 className="text-lg font-black font-headline text-on-surface truncate">{report.target}</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    report.severity === 'High' ? 'bg-error/10 text-error' : 
                    report.severity === 'Medium' ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {report.severity} Priority
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Reason</p>
                    <p className="text-sm font-medium">{report.reason}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Reporter</p>
                    <p className="text-sm font-medium">{report.reporter} • {report.date}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-outline-variant/10">
                  <button onClick={() => handleAction(report.id, 'taken action')} className="flex items-center gap-2 px-4 py-2 bg-error text-white text-xs font-bold rounded-xl hover:bg-error/90 transition-colors active:scale-95">
                    <XCircle size={16} />
                    Take Action
                  </button>
                  <button onClick={() => handleAction(report.id, 'dismissed')} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-xl hover:bg-primary/20 transition-colors active:scale-95">
                    <CheckCircle size={16} />
                    Dismiss
                  </button>
                  <button onClick={() => showToast(`Opening review for report #${report.id}`)} className="flex items-center gap-2 px-4 py-2 bg-surface-container-low text-on-surface-variant text-xs font-bold rounded-xl hover:bg-surface-container-high transition-colors active:scale-95">
                    <Eye size={16} />
                    Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
