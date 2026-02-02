import React from 'react';
import { AppShell, Burger, Group, Text, Box, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Sidebar } from './Sidebar';
import { Database } from 'lucide-react';

export const Layout = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: { base: 70, md: 0 } }}
      navbar={{
        width: 300,
        breakpoint: 'md',
        collapsed: { mobile: !opened },
      }}
      padding="0"
    >
      <AppShell.Header className="md:hidden border-b-slate-100 px-md">
        <Group h="100%" justify="space-between">
          <Group>
            <Box className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Database size={20} />
            </Box>
            <Text fw={900} size="lg">داتا-مايند</Text>
          </Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="0" className="border-e-slate-100 shadow-xl">
        <Sidebar onClose={() => opened && toggle()} />
      </AppShell.Navbar>

      <AppShell.Main bg="#f8fafc">
        <ScrollArea h="100vh" className="custom-scrollbar" offsetScrollbars>
          <Box p={{ base: 'md', md: 'xl', lg: 50 }}>
            {children}
          </Box>
        </ScrollArea>
      </AppShell.Main>
    </AppShell>
  );
};