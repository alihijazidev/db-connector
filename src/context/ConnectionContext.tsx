import React, { createContext, useState, useContext, ReactNode } from 'react';
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

// Mock function to simulate backend connection test
const simulateConnectionTest = (details: Omit<ConnectionDetails, 'id'>): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate failure for specific credentials (e.g., username 'fail')
      if (details.username === 'fail' || details.port === 1111) {
        resolve(false);
      } else {
        resolve(true);
      }
    }, 1000);
  });
};

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  const [connections, setConnections] = useState<ConnectionDetails[]>([]);
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);

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