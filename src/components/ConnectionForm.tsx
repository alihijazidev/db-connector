import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getDatabaseTypes, useConnection } from "@/context/ConnectionContext";
import { DatabaseType, ConnectionDetails } from "@/types/database";
import { Loader2, Database } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل." }),
  type: z.custom<DatabaseType>(),
  database: z.string().min(1, { message: "اسم قاعدة البيانات مطلوب." }),
});

type ConnectionFormValues = Omit<ConnectionDetails, 'id'>;

interface ConnectionFormProps {
  onSuccess: () => void;
}

export const ConnectionForm: React.FC<ConnectionFormProps> = ({ onSuccess }) => {
  const { addConnection } = useConnection();
  const dbTypes = getDatabaseTypes();

  const form = useForm<ConnectionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: dbTypes[0],
      database: "mydb",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ConnectionFormValues) => {
    const success = await addConnection(values);
    if (success) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم الاتصال</FormLabel>
              <FormControl>
                <Input placeholder="قاعدة بيانات المشروع" {...field} className="rounded-lg border-2" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع قاعدة البيانات</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-lg border-2">
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dbTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "PostgreSQL" ? "بوستجري إس كيو إل" : 
                       type === "MySQL" ? "ماي إس كيو إل" : 
                       type === "SQL Server" ? "إس كيو إل سيرفر" : "إس كيو لايت"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="database"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم قاعدة البيانات</FormLabel>
              <FormControl>
                <Input placeholder="my_db" {...field} className="rounded-lg border-2" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full rounded-xl py-6 text-lg font-semibold" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="ms-2 h-4 w-4 animate-spin" />
              جاري الاتصال...
            </>
          ) : (
            "اختبار الاتصال والحفظ"
          )}
        </Button>
      </form>
    </Form>
  );
};