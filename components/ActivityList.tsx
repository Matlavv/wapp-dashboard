import { CheckCircle2, XCircle, Clock } from 'lucide-react';

type Log = {
  id: string;
  function_name: string;
  status: 'success' | 'error';
  logs: string;
  created_at: string;
};

export const ActivityList = ({ logs }: { logs: Log[] }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 opacity-40">
        <Clock className="w-10 h-10 mb-4" />
        <p className="text-sm italic">Aucun log récent</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="flex gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors group">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            log.status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {log.status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{log.function_name}</h4>
            <p className="text-xs text-muted truncate">{log.logs}</p>
          </div>
          <div className="text-[10px] text-muted whitespace-nowrap opacity-50">
            {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );
};
