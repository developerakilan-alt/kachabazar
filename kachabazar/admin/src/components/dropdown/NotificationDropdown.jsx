import { useEffect, useState, useCallback } from "react";
import { FiBell, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NotificationServices from "@/services/NotificationServices";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { notifyError } from "@/utils/toast";

export function NotificationDropdown() {
  const [data, setData] = useState([]);
  const [totalUnreadDoc, setTotalUnreadDoc] = useState(0);
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { showDateTimeFormat } = useUtilsFunction();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await NotificationServices.getAllNotification();
      setData(res?.notifications || []);
      setTotalUnreadDoc(res?.totalUnreadDoc || 0);
    } catch (err) {
      // silently fail for header dropdown
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and when popover opens
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (popoverOpen) fetchNotifications();
  }, [popoverOpen, fetchNotifications]);

  const handleStatusChange = async (id) => {
    try {
      await NotificationServices.updateStatusNotification(id, {
        status: "read",
      });
      fetchNotifications();
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await NotificationServices.deleteNotification(id);
      fetchNotifications();
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  // Show only the latest 5 notifications
  const displayData = data.slice(0, 5);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <FiBell className="h-5 w-5" />
          {totalUnreadDoc > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {totalUnreadDoc > 9 ? "9+" : totalUnreadDoc}
            </span>
          )}
          <span className="sr-only">View notifications</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-96 p-0" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h4 className="text-sm font-semibold">Notifications</h4>
            {totalUnreadDoc > 0 && (
              <p className="text-muted-foreground text-xs">
                {totalUnreadDoc} unread
              </p>
            )}
          </div>
        </div>

        {/* Notification list */}
        {loading && data.length === 0 ? (
          <div className="space-y-3 p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-2.5 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : displayData.length > 0 ? (
          <ScrollArea className="max-h-[360px]">
            <div className="divide-y">
              {displayData.map((item) => (
                <Link
                  key={item._id}
                  to={
                    item.productId
                      ? `/product/${item.productId}`
                      : `/order/${item.orderId}`
                  }
                  onClick={() => {
                    handleStatusChange(item._id);
                    setPopoverOpen(false);
                  }}
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  {/* Avatar */}
                  <Avatar className="h-9 w-9 flex-shrink-0 border">
                    <AvatarImage src={item.image} alt="notification" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {item.productId ? "P" : "O"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground text-sm leading-snug font-medium">
                      {item.message}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      {item.productId ? (
                        <Badge
                          variant="danger"
                          className="text-[10px] px-1.5 py-0"
                        >
                          Stock Out
                        </Badge>
                      ) : (
                        <Badge
                          variant="success"
                          className="text-[10px] px-1.5 py-0"
                        >
                          New Order
                        </Badge>
                      )}
                      <span className="text-muted-foreground text-[11px]">
                        {showDateTimeFormat(item.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Unread indicator + delete */}
                  <div className="flex flex-shrink-0 items-center gap-1.5">
                    {item.status === "unread" && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, item._id)}
                      className="rounded p-1 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-10 text-center">
            <FiBell className="text-muted-foreground/40 mx-auto mb-2 h-8 w-8" />
            <p className="text-muted-foreground text-sm">
              No notifications yet
            </p>
          </div>
        )}

        {/* Footer */}
        {data.length > 0 && (
          <div className="border-t px-4 py-2.5">
            <Link
              to="/notifications"
              onClick={() => setPopoverOpen(false)}
              className="text-primary block text-center text-sm font-medium hover:underline"
            >
              Show all notifications
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
