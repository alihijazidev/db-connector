import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

const ConnectionContext = createContext(undefined);

const MOCK_DB_TYPES = ["PostgreSQL", "MySQL", "SQL Server", "SQLite"];
const MOCK_DATABASES = ["production_db", "staging_db", "analytics_warehouse", "user_data_store", "test_env"];
const STORAGE_KEY = 'db_connections';

const simulateConnectionTest = (details) => {
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

const loadConnections = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return [];
      }
    }
  }
  return [];
};

const saveConnections = (connections) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
  }
};

export const ConnectionProvider = ({ children }) => {
  const [connections, setConnections] = useState(loadConnections);
  const [activeConnectionId, setActiveConnectionId] = useState(null);

  useEffect(() => {
    saveConnections(connections);
  }, [connections]);

  const addConnection = async (details) => {
    const loadingToastId = toast.loading(`جاري محاولة الاتصال بـ ${details.name}...`);
    const isSuccessful = await simulateConnectionTest(details);
    toast.dismiss(loadingToastId);

    if (isSuccessful) {
      const newConnection = {
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

  const setActiveConnection = (id) => {
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