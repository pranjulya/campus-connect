"use client";

import { useMe } from "@/hooks/use-me";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { me, isLoading, isError } = useMe();
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching user data.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-4">
        <p>Name: {me.name}</p>
        <p>Email: {me.email}</p>
        <p>Role: {me.role}</p>
      </div>
      <Button onClick={handleLogout} className="mt-4">Logout</Button>
    </div>
  );
}
