import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';

export default function GithubSyncManager() {
  const [syncStatus, setSyncStatus] = useState('INITIALIZING');
  const [lastCommit, setLastCommit] = useState(null);
  const [error, setError] = useState(null);

  // BASE44 CUSTOM INTEGRATION PARAMETERS
  const GITHUB_API_URL = "https://api.github.com/repos/asaadmorman-bit/Outpost-Zero/commits/main";

  useEffect(() => {
    const fetchLatestRepoState = async () => {
      try {
        setSyncStatus('SYNCING_BACKGROUND');
        
        // Fetching cleanly via standard HTTPS direct API access
        const response = await fetch(GITHUB_API_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            // If your repo becomes private later, add your token securely here:
            // 'Authorization': `Bearer ${import.meta.env.VITE_GITHUB_DEPLOY_TOKEN}`
          }
        });

        if (!response.ok) {
          throw new Error(`GitHub API responded with status ${response.status}`);
        }

        const data = await response.json();
        
        // Extracting only metadata to confirm integration status without pulling code blocks
        if (data && data.sha) {
          setLastCommit({
            sha: data.sha.substring(0, 7),
            date: data.commit.author.date,
            message: data.commit.message
          });
          setSyncStatus('SECURELY_SYNCHRONIZED');
          setError(null);
        }
      } catch (err) {
        setSyncStatus('CONNECTION_STALLED');
        setError(err.message);
        console.error("Custom GitHub API Synchronization Failure:", err);
      }
    };

    // Run synchronization hook immediately on dashboard load
    fetchLatestRepoState();
    
    // Polling interval: Check for new production repository deployments every 60 seconds
    const interval = setInterval(fetchLatestRepoState, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs text-zinc-400">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-md ${syncStatus === 'SECURELY_SYNCHRONIZED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
          {syncStatus === 'SECURELY_SYNCHRONIZED' ? <ShieldCheck className="h-4 w-4" /> : <RefreshCw className="h-4 w-4 animate-spin" />}
        </div>
        <div>
          <div className="text-zinc-200 font-medium font-sans">EDS Custom GitHub Integration Client</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">TARGET_ENDPOINT // api.github.com</div>
        </div>
      </div>

      {error ? (
        <div className="flex items-center space-x-2 text-rose-400 bg-rose-950/20 px-3 py-1.5 rounded border border-rose-900/30">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Integration Stalled: {error}</span>
        </div>
      ) : lastCommit ? (
        <div className="flex flex-wrap items-center gap-3 bg-zinc-900/60 px-3 py-2 rounded-md border border-zinc-800/80">
          <div><span className="text-zinc-600">BRANCH:</span> <span className="text-zinc-300">main</span></div>
          <div className="text-zinc-800">|</div>
          <div><span className="text-zinc-600">DEPLOY_SHA:</span> <span className="text-emerald-400 font-bold">{lastCommit.sha}</span></div>
          <div className="text-zinc-800">|</div>
          <div className="max-w-xs truncate"><span className="text-zinc-600">DESC:</span> <span className="text-zinc-400 truncate">{lastCommit.message}</span></div>
        </div>
      ) : (
        <div className="text-zinc-600 animate-pulse">Establishing pipeline transport layer...</div>
      )}
    </div>
  );
}