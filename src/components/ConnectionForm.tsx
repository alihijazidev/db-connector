import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useConnection, getAvailableDatabases } from "@/context/ConnectionContext";
import { ConnectionDetails } from "@/types/database";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل." }),
  database: z.string().min(1, { message: "يرجى اختيار قاعدة بيانات." }),
});

type ConnectionFormValues = {
  name: string;
  database: string;
};

interface ConnectionFormProps {
  onSuccess: () => void;
}

export const ConnectionForm: React.FC<ConnectionFormProps> = ({ onSuccess }) => {
  const { addConnection } = useConnection();
  const availableDatabases = getAvailableDatabases();

  const form = useForm<ConnectionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      database: availableDatabases[0],
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ConnectionFormValues) => {
    const success = await addConnection({
      ...values,
      type: "PostgreSQL",
    });
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
                <Input placeholder="مثال: قاعدة بيانات الإنتاج" {...field} className="rounded-lg border-2" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="database"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اختر قاعدة البيانات</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-lg border-2">
                    <SelectValue placeholder="اختر من القائمة..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableDatabases.map((db) => (
                    <SelectItem key={db} value={db}>
                      {db}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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