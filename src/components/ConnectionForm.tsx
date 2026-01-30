import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getDatabaseTypes, useConnection } from "@/context/ConnectionContext";
import { DatabaseType } from "@/types/database";
import { Loader2, Database } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  type: z.custom<DatabaseType>(),
  host: z.string().min(1, { message: "Host is required." }),
  port: z.coerce.number().int().positive().min(1).max(65535),
  database: z.string().min(1, { message: "Database name is required." }),
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type ConnectionFormValues = z.infer<typeof formSchema>;

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
      host: "localhost",
      port: 5432,
      database: "mydb",
      username: "user",
      password: "password",
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="host"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Host</FormLabel>
                <FormControl>
                  <Input placeholder="localhost" {...field} className="rounded-lg border-2 focus:border-primary transition-colors" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="5432" {...field} onChange={(e) => field.onChange(e.target.value)} className="rounded-lg border-2 focus:border-primary transition-colors" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="postgres" {...field} className="rounded-lg border-2 focus:border-primary transition-colors" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} className="rounded-lg border-2 focus:border-primary transition-colors" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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