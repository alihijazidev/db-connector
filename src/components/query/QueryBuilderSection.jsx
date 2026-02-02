import React from 'react';
import { Paper, Group, Text, ThemeIcon, Stack, Badge } from '@mantine/core';
import { cn } from '@/lib/utils';

export const QueryBuilderSection = ({
  title,
  description,
  icon,
  children,
  badge,
  variant = "indigo"
}) => {
  const colorMap = {
    indigo: "indigo",
    amber: "orange",
    emerald: "teal",
    blue: "blue",
  };

  const activeColor = colorMap[variant] || "indigo";

  return (
    <Paper 
      shadow="xl" 
      radius="2.5rem" 
      p="xl" 
      withBorder 
      className={cn("transition-all duration-500 hover:shadow-2xl")}
      style={{
        backgroundColor: `var(--mantine-color-${activeColor}-0)`,
        borderColor: `var(--mantine-color-${activeColor}-2)`,
      }}
    >
      <Stack gap="xl">
        {/* Horizontal Header using Mantine Group */}
        <Group align="center" gap="lg" wrap="nowrap">
          <ThemeIcon 
            size={56} 
            radius="xl" 
            variant="gradient"
            gradient={{ from: activeColor, to: `${activeColor}.4`, deg: 45 }}
            className="shadow-lg shrink-0"
          >
            {React.cloneElement(icon, { size: 28, strokeWidth: 2.5 })}
          </ThemeIcon>
          
          <Stack gap={2} style={{ flex: 1 }}>
            <Group gap="xs">
              <Text size="xl" fw={900} className="tracking-tight text-slate-800">
                {title}
              </Text>
              {badge && (
                <Badge variant="white" color={activeColor} size="sm" radius="xl" className="shadow-sm">
                  {badge}
                </Badge>
              )}
            </Group>
            <Text size="sm" fw={500} c="dimmed">
              {description}
            </Text>
          </Stack>
        </Group>

        {/* Content Area */}
        <Paper 
          radius="2rem" 
          p="lg" 
          withBorder 
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderColor: 'rgba(255, 255, 255, 0.5)'
          }}
        >
          {children}
        </Paper>
      </Stack>
    </Paper>
  );
};