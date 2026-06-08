import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldOff, UserCog, Loader2 } from "lucide-react";
import AdminServices from "@/services/AdminServices";
import { notifySuccess, notifyError } from "@/utils/toast";

const ROLES = [
  {
    value: "super admin",
    label: "Super Admin",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  {
    value: "admin",
    label: "Admin",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    value: "ceo",
    label: "CEO",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    value: "manager",
    label: "Manager",
    color:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    value: "accountant",
    label: "Accountant",
    color:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    value: "cashier",
    label: "Cashier",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
  {
    value: "driver",
    label: "Driver",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  },
  {
    value: "security guard",
    label: "Security Guard",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  },
];

const ACCESS_LIST_OPTIONS = [
  { value: "dashboard", label: "Dashboard" },
  { value: "products", label: "Products" },
  { value: "categories", label: "Categories" },
  { value: "attributes", label: "Attributes" },
  { value: "coupons", label: "Coupons" },
  { value: "customers", label: "Customers" },
  { value: "orders", label: "Orders" },
  { value: "our-staff", label: "Our Staff" },
  { value: "settings", label: "Settings" },
  { value: "store-settings", label: "Store Settings" },
  { value: "languages", label: "Languages" },
  { value: "currencies", label: "Currencies" },
  { value: "notifications", label: "Notifications" },
  { value: "store-customization", label: "Store Customization" },
  { value: "online-store", label: "Online Store" },
];

const RoleAssignModal = ({
  isOpen,
  onClose,
  staff,
  mode = "assign", // "assign" or "unassign"
  showingTranslateValue,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState(staff?.role || "cashier");
  const [selectedAccess, setSelectedAccess] = useState(
    staff?.access_list || [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const staffName =
    typeof staff?.name === "object"
      ? showingTranslateValue(staff?.name)
      : staff?.name || "Staff";

  const currentRoleInfo = ROLES.find((r) => r.value === staff?.role);

  const handleAccessToggle = useCallback((accessValue) => {
    setSelectedAccess((prev) =>
      prev.includes(accessValue)
        ? prev.filter((a) => a !== accessValue)
        : [...prev, accessValue],
    );
  }, []);

  const handleSelectAllAccess = useCallback(() => {
    const allValues = ACCESS_LIST_OPTIONS.map((o) => o.value);
    setSelectedAccess((prev) =>
      prev.length === allValues.length ? [] : allValues,
    );
  }, []);

  const handleAssign = async () => {
    try {
      setIsSubmitting(true);
      const res = await AdminServices.assignRole(staff._id, {
        role: selectedRole,
        access_list: selectedAccess,
      });
      notifySuccess(res.message || `Role assigned successfully!`);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      onClose();
    } catch (err) {
      notifyError(
        err?.response?.data?.message || err.message || "Failed to assign role",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnassign = async () => {
    try {
      setIsSubmitting(true);
      const res = await AdminServices.unassignRole(staff._id);
      notifySuccess(res.message || `Role unassigned successfully!`);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      onClose();
    } catch (err) {
      notifyError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to unassign role",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-130 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "assign" ? (
              <>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                {t("AssignRole") || "Assign Role"}
              </>
            ) : (
              <>
                <ShieldOff className="w-5 h-5 text-red-500" />
                {t("UnassignRole") || "Unassign Role"}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "assign"
              ? `Assign a new role and permissions to ${staffName}`
              : `Remove the current role from ${staffName} and reset to default`}
          </DialogDescription>
        </DialogHeader>

        {/* Current Staff Info */}
        <div className="rounded-lg border p-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <UserCog className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{staffName}</p>
              <p className="text-xs text-muted-foreground">{staff?.email}</p>
            </div>
            <div className="ml-auto">
              {currentRoleInfo && (
                <Badge
                  variant="outline"
                  className={`capitalize ${currentRoleInfo.color}`}
                >
                  {currentRoleInfo.label}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {mode === "assign" ? (
          <div className="space-y-4">
            {/* Role Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("SelectRole") || "Select Role"}
              </label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <span className="capitalize">{role.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Access List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {t("AccessPermissions") || "Access Permissions"}
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAllAccess}
                  className="text-xs h-7"
                >
                  {selectedAccess.length === ACCESS_LIST_OPTIONS.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ACCESS_LIST_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer text-xs transition-colors ${
                      selectedAccess.includes(option.value)
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAccess.includes(option.value)}
                      onChange={() => handleAccessToggle(option.value)}
                      className="sr-only"
                    />
                    <div
                      className={`h-3.5 w-3.5 rounded-sm border flex items-center justify-center ${
                        selectedAccess.includes(option.value)
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {selectedAccess.includes(option.value) && (
                        <svg
                          className="h-2.5 w-2.5 text-primary-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Unassign confirmation */
          <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-4">
            <p className="text-sm text-red-700 dark:text-red-300">
              This will remove the{" "}
              <strong className="capitalize">{staff?.role}</strong> role from{" "}
              <strong>{staffName}</strong> and reset their role to{" "}
              <strong>Cashier</strong> with no access permissions.
            </p>
            {staff?.access_list?.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-red-600 dark:text-red-400 mb-1.5 font-medium">
                  Current permissions that will be removed:
                </p>
                <div className="flex flex-wrap gap-1">
                  {staff.access_list.map((access) => (
                    <Badge
                      key={access}
                      variant="outline"
                      className="text-[10px] capitalize border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                    >
                      {access}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t("Cancel") || "Cancel"}
          </Button>
          {mode === "assign" ? (
            <Button onClick={handleAssign} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Assign Role
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleUnassign}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Unassigning...
                </>
              ) : (
                <>
                  <ShieldOff className="mr-2 h-4 w-4" />
                  Unassign Role
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleAssignModal;
