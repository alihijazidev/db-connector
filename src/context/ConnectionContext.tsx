import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ConnectionDetails, DatabaseType } from '@/types/database';
import { toast } from 'sonner';

interface ConnectionContextType {
  connections: ConnectionDetails[];
  activeConnectionId: string | null;
  addConnection: (details: Omit<ConnectionDetails, 'id'>) => Promise<boolean>;
  setActiveConnection: (id: string | null) => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

const MOCK_DB_TYPES: DatabaseType[] = ["PostgreSQL", "MySQL", "SQL Server", "SQLite"];
const MOCK_DATABASES = ["production_db", "staging_db", "analytics_warehouse", "user_data_store", "test_env"];
const STORAGE_KEY = 'db_connections';

const simulateConnectionTest = (details: Omit<ConnectionDetails, 'id'>): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (details.name.toLowerCase().includes('fail')) {
        resolve(false);
      } else {
        resolve(true);
      }
    }, 1000);
  });
};

const loadConnections = (): ConnectionDetails[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as ConnectionDetails[];
      } catch (e) {
        console.error("Failed to parse stored connections:", e);
        return [];
      }
    }
  }
  return [];
};

const saveConnections = (connections: ConnectionDetails[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
  }
};

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  const [connections, setConnections] = useState<ConnectionDetails[]>(loadConnections);
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);

  useEffect(() => {
    saveConnections(connections);
  }, [connections]);

  const addConnection = async (details: Omit<ConnectionDetails, 'id'>): Promise<boolean> => {
    const loadingToastId = toast.loading(`جاري محاولة الاتصال بـ ${details.name}...`);
    
    const isSuccessful = await simulateConnectionTest(details);

    toast.dismiss(loadingToastId);

    if (isSuccessful) {
      const newConnection: ConnectionDetails = {
        ...details,
        id: crypto.randomUUID(),
      };
      setConnections((prev) => [...prev, newConnection]);
      setActiveConnectionId(newConnection.id);
      toast.success(`تم الاتصال بـ ${details.name} بنجاح!`);
      return true;
    } else {
      toast.error(`فشل الاتصال بـ ${details.name}. تحقق من البيانات.`);
      return false;
    }
  };

  const setActiveConnection = (id: string | null) => {
    setActiveConnectionId(id);
  };

  return (
    <ConnectionContext.Provider value={{ connections, activeConnectionId, addConnection, setActiveConnection }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
};

export const getDatabaseTypes = () => MOCK_DB_TYPES;
export const getAvailableDatabases = () => MOCK_DATABASES;