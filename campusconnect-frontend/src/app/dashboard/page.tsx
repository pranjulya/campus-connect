export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold">Enrolled Courses</h2>
          <p>You are not enrolled in any courses yet.</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
          <p>No upcoming deadlines.</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold">Unread Notifications</h2>
          <p>No unread notifications.</p>
        </div>
      </div>
    </div>
  );
}
