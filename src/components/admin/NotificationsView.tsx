import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bell, CheckCircle, Calendar, ExternalLink } from 'lucide-react';
import { adminService } from '@/services/adminService';
import type { AdminNotification, NotificationType } from '@/types/admin-types';
import { cn } from '@/lib/utils';

export const NotificationsView = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    unreadCount: 0,
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const typeFilter = filter === 'all' || filter === 'unread' ? undefined : filter;
      const readFilter = filter === 'unread' ? false : undefined;

      const data = await adminService.getNotifications(
        pagination.page,
        pagination.limit,
        typeFilter,
        readFilter
      );

      setNotifications(data.notifications);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [pagination.page, filter]);

  const handleResolve = async (notificationId: string) => {
    try {
      await adminService.resolveNotification(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to resolve notification:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'calendly_deletion':
        return <Calendar className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-sm text-zinc-500">
            {pagination.unreadCount} unread notification{pagination.unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <Select value={filter} onValueChange={(value: typeof filter) => setFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="calendly_deletion">Calendly</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-zinc-300 mb-4" />
            <p className="text-zinc-500">No notifications found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification._id}
              className={cn(
                'transition-all',
                notification.read ? 'opacity-60' : 'border-l-4 border-l-teal-500'
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                      notification.type === 'calendly_deletion'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-teal-100 text-teal-600'
                    )}
                  >
                    {getTypeIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={cn('text-xs', getPriorityColor(notification.priority))}
                      >
                        {notification.priority}
                      </Badge>
                      <span className="text-xs text-zinc-400">
                        {formatDate(notification.createdAt)}
                      </span>
                      {notification.read && (
                        <Badge variant="secondary" className="text-xs">
                          Resolved
                        </Badge>
                      )}
                    </div>

                    <p className="font-medium text-zinc-800 mb-1">
                      {notification.message}
                    </p>

                    <p className="text-sm text-zinc-600 mb-3">
                      {notification.actionRequired}
                    </p>

                    {notification.metadata && (
                      <div className="text-xs text-zinc-500 space-y-1 mb-3">
                        {notification.metadata.userName && (
                          <p>User: {notification.metadata.userName}</p>
                        )}
                        {notification.metadata.userEmail && (
                          <p>Email: {notification.metadata.userEmail}</p>
                        )}
                        {notification.metadata.calendlyUserUri && (
                          <a
                            href={notification.metadata.calendlyUserUri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-teal-600 hover:underline"
                          >
                            Open in Calendly <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}

                    {!notification.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolve(notification._id)}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark as Resolved
                      </Button>
                    )}

                    {notification.resolvedAt && (
                      <p className="text-xs text-zinc-400 mt-2">
                        Resolved on {formatDate(notification.resolvedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-zinc-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page * pagination.limit >= pagination.total}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
