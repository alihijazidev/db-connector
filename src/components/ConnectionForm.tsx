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
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  type: z.custom<DatabaseType>(),
  database: z.string().min(1, { message: "Database name is required." }),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 bg-card rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-primary flex items-center">
          <Database className="w-6 h-6 mr-2" /> New Database Connection
        </h3>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Connection Name</FormLabel>
              <FormControl>
                <Input placeholder="My Project DB" {...field} className="rounded-lg border-2 focus:border-primary transition-colors" />
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
              <FormLabel>Database Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-lg border-2 focus:ring-primary transition-colors">
                    <SelectValue placeholder="Select a database type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dbTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
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
              <FormLabel>Database Name</FormLabel>
              <FormControl>
                <Input placeholder="my_database" {...field} className="rounded-lg border-2 focus:border-primary transition-colors" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full rounded-xl py-6 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            "Test Connection & Save"
          )}
        </Button>
      </form>
    </Form>
  );
};