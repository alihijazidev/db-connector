import React from 'react';
import { useForm } from "react-hook-form";
import { Stack, TextInput, Select, Button, Group, Text, Box, Paper, ThemeIcon } from '@mantine/core';
import { Database, ShieldCheck, Globe, Loader2, Link2 } from "lucide-react";
import { useConnection, getAvailableDatabases } from "@/context/ConnectionContext";

export const ConnectionForm = ({ onSuccess }) => {
  const { addConnection } = useConnection();
  const availableDatabases = getAvailableDatabases();

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: "",
      database: availableDatabases[0],
    }
  });

  const onSubmit = async (values) => {
    const success = await addConnection({
      ...values,
      type: "PostgreSQL",
    });
    if (success) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="xl">
        <Box>
          <TextInput
            label="اسم الاتصال"
            placeholder="مثال: قاعدة بيانات الإنتاج"
            size="md"
            radius="xl"
            leftSection={<Globe size={18} />}
            error={errors.name?.message}
            {...register("name", { required: "يرجى إدخال اسم للاتصال" })}
          />
        </Box>

        <Box>
          <Select
            label="اختر قاعدة البيانات"
            placeholder="اختر من القائمة"
            size="md"
            radius="xl"
            leftSection={<Database size={18} />}
            data={availableDatabases}
            defaultValue={availableDatabases[0]}
            onChange={(val) => setValue('database', val)}
          />
        </Box>

        <Paper p="md" radius="xl" withBorder style={{ backgroundColor: 'var(--mantine-color-indigo-0)' }}>
          <Group align="flex-start" wrap="nowrap">
            <ThemeIcon color="indigo" variant="light" radius="xl">
              <ShieldCheck size={18} />
            </ThemeIcon>
            <Text size="xs" fw={500} c="indigo" style={{ lineHeight: 1.5 }}>
              سيتم اختبار الاتصال تلقائياً وحفظ البيانات محلياً في متصفحك بشكل آمن. نحن لا نطلع على بياناتك أبداً.
            </Text>
          </Group>
        </Paper>

        <Button 
          type="submit" 
          size="lg" 
          radius="xl" 
          fullWidth
          loading={isSubmitting}
          leftSection={!isSubmitting && <Link2 size={20} />}
          className="shadow-xl shadow-indigo-100"
        >
          {isSubmitting ? "جاري الاتصال..." : "تثبيت الاتصال الآن"}
        </Button>
      </Stack>
    </form>
  );
};