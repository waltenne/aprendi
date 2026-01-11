'use client';

import { useEffect, useState } from 'react';
import { Star, GitFork, Eye } from 'lucide-react';

interface GitHubRepoStats {
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
}

const CACHE_KEY = 'github_stats_aprendi';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function GitHubStats() {
  const [stats, setStats] = useState<GitHubRepoStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar cache primeiro
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        const isValid = Date.now() - timestamp < CACHE_DURATION;
        
        if (isValid) {
          setStats(data);
          setLoading(false);
          return;
        }
      } catch (e) {
        // Cache inválido, continuar com fetch
      }
    }

    // Buscar dados da API
    fetch('https://api.github.com/repos/waltenne/aprendi')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
        
        // Salvar no cache
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data, timestamp: Date.now() })
        );
      })
      .catch((error) => {
        console.error('❌ Erro ao buscar stats do GitHub:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="mt-3 px-3">
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-muted animate-pulse" />
              <div className="h-3 w-6 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="mt-3 px-3">
      <div className="flex items-center gap-3 text-xs">
        <a
          href="https://github.com/waltenne/aprendi/stargazers"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1 hover:text-yellow-500 transition-colors"
          title="Stars"
        >
          <Star className="h-3 w-3 text-yellow-500" />
          <span className="font-medium tabular-nums">{stats.stargazers_count}</span>
        </a>
        <a
          href="https://github.com/waltenne/aprendi/forks"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1 hover:text-blue-500 transition-colors"
          title="Forks"
        >
          <GitFork className="h-3 w-3 text-blue-500" />
          <span className="font-medium tabular-nums">{stats.forks_count}</span>
        </a>
        <a
          href="https://github.com/waltenne/aprendi/watchers"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1 hover:text-emerald-500 transition-colors"
          title="Watch"
        >
          <Eye className="h-3 w-3 text-emerald-500" />
          <span className="font-medium tabular-nums">{stats.watchers_count}</span>
        </a>
      </div>
    </div>
  );
}
