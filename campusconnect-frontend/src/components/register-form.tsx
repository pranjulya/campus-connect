"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["student", "professor"]),
});

export default function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
    },
  });

  const router = useRouter();
  const { setToken } = useAuthStore();
  const registerMutation = useApi("/auth/register");

  function onSubmit(values: z.infer<typeof formSchema>) {
    registerMutation.mutate(values, {
      onSuccess: (data) => {
        setToken(data.data.token);
        router.push("/");
      },
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email && <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...form.register("password")} />
            {form.formState.errors.password && <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select id="role" {...form.register("role")} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="student">Student</option>
              <option value="professor">Professor</option>
            </select>
            {form.formState.errors.role && <p className="text-red-500 text-sm">{form.formState.errors.role.message}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={registerMutation.isLoading}>
            {registerMutation.isLoading ? "Creating account..." : "Register"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
