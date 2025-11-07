"use client";

import { useNotifications } from "@/hooks/use-notifications";
import { useMarkNotificationAsRead } from "@/hooks/use-mark-notification-as-read";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const { notifications, isLoading, isError } = useNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching notifications.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Notifications</h1>
      <div className="mt-4">
        {notifications && notifications.length === 0 && <p>No notifications yet.</p>}
        {notifications && notifications.length > 0 && (
          <ul>
            {notifications.map((notification: any) => (
              <li key={notification._id} className="flex items-center justify-between py-2 border-b">
                <span>{notification.message}</span>
                {!notification.isRead && (
                  <Button
                    onClick={() => handleMarkAsRead(notification._id)}
                    disabled={markAsReadMutation.isLoading}
                    variant="outline"
                    size="sm"
                  >
                    {markAsReadMutation.isLoading ? "Marking..." : "Mark as Read"}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
