import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useConnection } from "@/context/ConnectionContext";
import { ConnectionDetails } from "@/types/database";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل." }),
  database: z.string().min(1, { message: "اسم قاعدة البيانات مطلوب." }),
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

  const form = useForm<ConnectionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      database: "mydb",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ConnectionFormValues) => {
    // نرسل النوع كـ PostgreSQL بشكل افتراضي
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
                <Input placeholder="قاعدة بيانات المشروع" {...field} className="rounded-lg border-2" />
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