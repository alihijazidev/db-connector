import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useConnection } from '@/context/ConnectionContext';
import { Box, Stack, Group, Text, ThemeIcon, NavLink, ScrollArea, Badge, Button, Divider, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Database, LayoutDashboard, Plus, Code, Settings, Sparkles, Link as LinkIcon } from 'lucide-react';
import { ConnectionForm } from './ConnectionForm';

export const Sidebar = ({ onClose }) => {
  const { connections, activeConnectionId, setActiveConnection } = useConnection();
  const location = useLocation();
  const [opened, { open, close }] = useDisclosure(false);

  const handleAddSuccess = () => {
    close();
    if (onClose) onClose(); // إغلاق السايدبار في الموبايل
  };

  return (
    <Box className="flex flex-col h-full bg-white">
      {/* Modal لنموذج الاتصال */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="md" variant="light">
              <Plus size={18} />
            </ThemeIcon>
            <Text fw={900}>إضافة اتصال جديد</Text>
          </Group>
        }
        centered
        radius="2rem"
        padding="xl"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <ConnectionForm onSuccess={handleAddSuccess} />
      </Modal>

      {/* Brand */}
      <Box p="xl" className="pb-8">
        <Group gap="md">
          <ThemeIcon 
            size={48} 
            radius="xl" 
            variant="gradient" 
            gradient={{ from: 'indigo', to: 'indigo.4', deg: 45 }}
            className="shadow-lg shadow-indigo-100 rotate-3"
          >
            <Database size={24} />
          </ThemeIcon>
          <Stack gap={0}>
            <Text fw={900} size="xl" className="tracking-tight text-slate-800">داتا-مايند</Text>
            <Group gap={4}>
              <Sparkles size={10} color="var(--mantine-color-orange-5)" />
              <Text size="10px" fw={900} c="dimmed" tt="uppercase" lts={1}>إصدار المحترفين</Text>
            </Group>
          </Stack>
        </Group>
      </Box>

      <ScrollArea className="flex-1 px-md">
        <Stack gap="lg">
          <NavLink
            component={Link}
            to="/"
            label="لوحة التحكم"
            leftSection={<LayoutDashboard size={20} />}
            active={location.pathname === '/'}
            variant="filled"
            onClick={onClose}
            className="rounded-2xl py-3.5 font-bold"
          />

          <Divider label="اتصالاتك النشطة" labelPosition="right" color="slate.1" />

          {connections.length === 0 ? (
            <Box p="xl" className="text-center border-2 border-dashed border-slate-100 rounded-3xl">
              <Text size="xs" c="dimmed" fw={700}>لا يوجد اتصالات نشطة حالياً</Text>
            </Box>
          ) : (
            <Stack gap="sm">
              {connections.map(conn => (
                <NavLink
                  key={conn.id}
                  label={conn.name}
                  description={conn.database}
                  leftSection={<Database size={18} />}
                  active={activeConnectionId === conn.id}
                  onClick={() => { setActiveConnection(conn.id); }}
                  className="rounded-2xl py-3 border border-transparent data-[active]:border-indigo-100"
                  rightSection={activeConnectionId === conn.id && (
                    <Badge variant="dot" color="indigo" size="sm">نشط</Badge>
                  )}
                  opened={activeConnectionId === conn.id}
                >
                  <NavLink
                    component={Link}
                    to={`/query/${conn.id}`}
                    label="منشئ الاستعلامات"
                    leftSection={<Code size={16} />}
                    onClick={onClose}
                    className="rounded-xl mt-1 text-xs font-bold"
                  />
                </NavLink>
              ))}
            </Stack>
          )}
        </Stack>
      </ScrollArea>

      <Box p="xl" className="border-t border-slate-50">
        <Stack gap="sm">
          <Button 
            fullWidth 
            size="lg" 
            radius="xl" 
            variant="filled" 
            color="indigo.9"
            leftSection={<Plus size={20} />}
            className="shadow-xl shadow-indigo-200"
            onClick={open}
          >
            إضافة اتصال
          </Button>
          <Button 
            fullWidth 
            variant="subtle" 
            color="slate.5" 
            leftSection={<Settings size={18} />}
            className="font-bold"
          >
            الإعدادات
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};