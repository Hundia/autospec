import { useState, useEffect, useCallback, useRef } from 'react';
import type { ProjectState, WSMessage } from '../../../types/index';

interface UseProjectStateReturn {
  state: ProjectState | null;
  isConnected: boolean;
  error: string | null;
  refresh: () => void;
}

export function useProjectState(): UseProjectStateReturn {
  const [state, setState] = useState<ProjectState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    // Clean up existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);

          if (message.type === 'state') {
            setState(convertMapsFromJSON(message.payload));
          } else if (message.type === 'update') {
            setState(convertMapsFromJSON(message.payload.state));
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);

        // Attempt to reconnect after delay
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (e) => {
        console.error('WebSocket error:', e);
        setError('Connection error. Attempting to reconnect...');
      };

      wsRef.current = ws;
    } catch (e) {
      console.error('Failed to create WebSocket:', e);
      setError('Failed to connect to server');

      // Attempt to reconnect
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/state');
      if (response.ok) {
        const data = await response.json();
        setState(convertMapsFromJSON(data));
      }
    } catch (e) {
      console.error('Failed to refresh state:', e);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return { state, isConnected, error, refresh };
}

// Convert JSON objects back to Maps
function convertMapsFromJSON(data: any): ProjectState {
  return {
    ...data,
    sprints: new Map(
      Array.isArray(data.sprints)
        ? data.sprints.map((s: any) => [s.id, s])
        : Object.entries(data.sprints || {})
    ),
    sprintSummaries: new Map(
      Array.isArray(data.sprintSummaries)
        ? data.sprintSummaries.map((s: any) => [s.sprintId, s])
        : Object.entries(data.sprintSummaries || {})
    ),
    specs: new Map(
      Object.entries(data.specs || {})
    ),
  };
}

export function useSprintData(sprintId: number | undefined) {
  const [sprint, setSprint] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sprintId === undefined) {
      setSprint(null);
      setSummary(null);
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`/api/sprints/${sprintId}`).then((r) => r.json()),
      fetch(`/api/sprints/${sprintId}/summary`).then((r) => r.json()).catch(() => null),
    ])
      .then(([sprintData, summaryData]) => {
        setSprint(sprintData);
        setSummary(summaryData);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sprintId]);

  return { sprint, summary, loading, error };
}

export function useScreens() {
  const [screens, setScreens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/screens')
      .then((r) => r.json())
      .then(setScreens)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { screens, loading };
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/metrics')
      .then((r) => r.json())
      .then(setMetrics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { metrics, loading };
}
