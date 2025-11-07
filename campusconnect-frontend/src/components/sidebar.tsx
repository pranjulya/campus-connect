import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden w-64 border-r md:block">
      <div className="flex flex-col p-4">
        <Link href="/" className="py-2">Dashboard</Link>
        <Link href="/courses" className="py-2">Courses</Link>
        <Link href="/profile" className="py-2">Profile</Link>
      </div>
    </aside>
  );
}
