import React from 'react';
import { Layout } from '@/components/Layout';
import { Container, Title, Text, SimpleGrid, Card, Group, ThemeIcon, Box, Badge, Stack } from '@mantine/core';
import { Database, Zap, Shield, ArrowUpRight, BarChart3, Globe, Sparkles } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, color }) => (
  <Card 
    radius="3rem" 
    p="xl" 
    withBorder 
    className="transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group"
  >
    <ThemeIcon 
      size={60} 
      radius="2rem" 
      variant="light" 
      color={color} 
      className="mb-6 group-hover:scale-110 transition-transform"
    >
      <Icon size={30} />
    </ThemeIcon>
    
    <Group justify="space-between" mb="xs">
      <Title order={3} fw={900}>{title}</Title>
      <ArrowUpRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
    </Group>
    
    <Text c="dimmed" fw={500} size="md" className="leading-relaxed">
      {desc}
    </Text>
  </Card>
);

const Index = () => {
  return (
    <Layout>
      <Container size="xl">
        {/* Hero Section */}
        <Stack gap={30} className="mb-20">
          <Badge 
            variant="light" 
            color="indigo" 
            size="xl" 
            radius="xl" 
            className="w-fit"
            leftSection={<Sparkles size={14} />}
          >
            تحليل البيانات أصبح أسهل
          </Badge>
          <Title className="text-6xl md:text-7xl font-black text-slate-900 leading-tight">
            بياناتك تتحدث، <br /> 
            <Text component="span" variant="gradient" gradient={{ from: 'indigo', to: 'indigo.4', deg: 90 }}>
              نحن نساعدك على فهمها
            </Text>
          </Title>
          <Text size="xl" c="dimmed" className="max-w-2xl font-medium leading-relaxed">
            قم بربط قواعد بياناتك المختلفة في مكان واحد، وقم ببناء استعلامات معقدة بدون كتابة سطر كود واحد.
          </Text>
        </Stack>

        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" className="mb-20">
          {[
            { label: 'اتصال نشط', val: '24/7', icon: Globe, color: 'indigo' },
            { label: 'وقت الاستجابة', val: '45ms', icon: Zap, color: 'orange' },
            { label: 'أمان البيانات', val: '100%', icon: Shield, color: 'teal' },
            { label: 'تقارير يومية', val: 'بصري', icon: BarChart3, color: 'blue' },
          ].map((item, i) => (
            <Card key={i} radius="2rem" withBorder p="lg" bg="slate.0">
              <Group gap="md">
                <ThemeIcon size={44} radius="xl" variant="white" color={item.color} className="shadow-sm">
                  <item.icon size={22} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" fw={900} c="dimmed" tt="uppercase">{item.label}</Text>
                  <Text size="lg" fw={900}>{item.val}</Text>
                </Box>
              </Group>
            </Card>
          ))}
        </SimpleGrid>

        {/* Features */}
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing={30}>
          <FeatureCard 
            icon={Database} 
            title="تعدد المصادر" 
            desc="اربط MySQL، PostgreSQL، وSQL Server بكل سهولة وبضغطة زر واحدة."
            color="indigo"
          />
          <FeatureCard 
            icon={Zap} 
            title="بناء فوري" 
            desc="محرك ذكي لبناء الاستعلامات يمنحك النتائج في أجزاء من الثانية."
            color="orange"
          />
          <FeatureCard 
            icon={Shield} 
            title="حماية مطلقة" 
            desc="بياناتك مشفرة ومحفوظة في متصفحك فقط. نحن لا نطلع على بياناتك أبداً."
            color="teal"
          />
        </SimpleGrid>
      </Container>
    </Layout>
  );
};

export default Index;