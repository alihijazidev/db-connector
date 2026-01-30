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
const STORAGE_KEY = 'db_connections';

// Mock function to simulate backend connection test
const simulateConnectionTest = (details: Omit<ConnectionDetails, 'id'>): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate failure if the name contains 'fail'
      if (details.name.toLowerCase().includes('fail')) {
        resolve(false);
      } else {
        resolve(true);
      }
    }, 1000);
  });
};

// Function to load connections from localStorage
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

// Function to save connections to localStorage
const saveConnections = (connections: ConnectionDetails[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
  }
};

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  const [connections, setConnections] = useState<ConnectionDetails[]>(loadConnections);
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);

  // Effect to save connections whenever the list changes
  useEffect(() => {
    saveConnections(connections);
  }, [connections]);

  const addConnection = async (details: Omit<ConnectionDetails, 'id'>): Promise<boolean> => {
    const loadingToastId = toast.loading(`Attempting to connect to ${details.name}...`);
    
    const isSuccessful = await simulateConnectionTest(details);

    toast.dismiss(loadingToastId);

    if (isSuccessful) {
      const newConnection: ConnectionDetails = {
        ...details,
        id: crypto.randomUUID(),
      };
      setConnections((prev) => [...prev, newConnection]);
      setActiveConnectionId(newConnection.id);
      toast.success(`Successfully connected to ${details.name}!`);
      return true;
    } else {
      toast.error(`Failed to connect to ${details.name}. Check credentials.`);
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