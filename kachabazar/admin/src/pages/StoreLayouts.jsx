import { useState, useEffect, useCallback } from "react";
import { FiLayout, FiEdit2, FiTrash2, FiStar, FiEye, FiEyeOff, FiPlus } from "react-icons/fi";
import LayoutServices from "@/services/LayoutServices";
import { notifySuccess, notifyError } from "@/utils/toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Label from "@/components/form/label/Label";
import InputArea from "@/components/form/input/InputArea";

const StoreLayouts = () => {
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLayout, setEditingLayout] = useState(null);
  const [form, setForm] = useState({
    value: "",
    label: "",
    description: "",
    icon: "",
    color: "",
    status: "show",
    sortOrder: 0,
  });

  const fetchLayouts = useCallback(async () => {
    try {
      const res = await LayoutServices.getAllLayouts();
      setLayouts(res.data || []);
    } catch (err) {
      notifyError("Failed to load layouts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLayouts();
  }, [fetchLayouts]);

  const resetForm = () => {
    setEditingLayout(null);
    setForm({
      value: "",
      label: "",
      description: "",
      icon: "",
      color: "",
      status: "show",
      sortOrder: 0,
    });
  };

  const handleEdit = (layout) => {
    setEditingLayout(layout);
    setForm({
      value: layout.value,
      label: layout.label,
      description: layout.description || "",
      icon: layout.icon || "",
      color: layout.color || "",
      status: layout.status,
      sortOrder: layout.sortOrder || 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLayout) {
        await LayoutServices.updateLayout(editingLayout._id, form);
        notifySuccess("Layout updated successfully!");
      } else {
        await LayoutServices.addLayout(form);
        notifySuccess("Layout added successfully!");
      }
      resetForm();
      fetchLayouts();
    } catch (err) {
      notifyError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this layout?")) return;
    try {
      await LayoutServices.deleteLayout(id);
      notifySuccess("Layout deleted successfully!");
      fetchLayouts();
    } catch (err) {
      notifyError(err.response?.data?.message || "Delete failed");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await LayoutServices.updateLayoutStatus(id, {
        status: currentStatus === "show" ? "hide" : "show",
      });
      notifySuccess("Status updated!");
      fetchLayouts();
    } catch (err) {
      notifyError(err.response?.data?.message || "Status update failed");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await LayoutServices.setDefaultLayout(id);
      notifySuccess("Default layout updated!");
      fetchLayouts();
    } catch (err) {
      notifyError(err.response?.data?.message || "Failed to set default");
    }
  };

  const handleSeed = async () => {
    if (!window.confirm("Seed default layouts? This will only work if no layouts exist.")) return;
    try {
      await LayoutServices.seedLayouts();
      notifySuccess("Layouts seeded successfully!");
      fetchLayouts();
    } catch (err) {
      notifyError(err.response?.data?.message || "Seed failed");
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Store Layouts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage store layout options visible to customers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSeed}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Seed Default Layouts
          </button>
          <button
            onClick={resetForm}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Add Layout
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-1 border border-border">
          <CardHeader>
            <CardTitle>{editingLayout ? "Edit Layout" : "New Layout"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label label="Value (unique key)" />
                <InputArea
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder="e.g. modern, minimal"
                  required
                />
              </div>
              <div>
                <Label label="Label (display name)" />
                <InputArea
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="e.g. Modern, Minimal"
                  required
                />
              </div>
              <div>
                <Label label="Description" />
                <InputArea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Short description"
                />
              </div>
              <div>
                <Label label="Icon (emoji)" />
                <InputArea
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="e.g. 🏠, ✨"
                />
              </div>
              <div>
                <Label label="Color (Tailwind class)" />
                <InputArea
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  placeholder="e.g. text-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label label="Sort Order" />
                  <InputArea
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label label="Status" />
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm"
                  >
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
                >
                  {editingLayout ? "Update" : "Create"}
                </button>
                {editingLayout && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* List */}
        <Card className="lg:col-span-2 border border-border">
          <CardHeader>
            <CardTitle>All Layouts ({layouts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : layouts.length === 0 ? (
              <div className="text-center py-12">
                <FiLayout className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground text-sm">
                  No layouts yet. Click "Seed Default Layouts" to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {layouts.map((layout) => (
                  <div
                    key={layout._id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{layout.icon || "📄"}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">
                            {layout.label}
                          </h4>
                          {layout.isDefault && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              Default
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              layout.status === "show"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {layout.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          <code className="text-primary">{layout.value}</code>
                          {layout.description && ` — ${layout.description}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSetDefault(layout._id)}
                        className={`p-2 rounded-lg transition-colors ${
                          layout.isDefault
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-primary hover:bg-muted"
                        }`}
                        title="Set as default"
                      >
                        <FiStar className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(layout._id, layout.status)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title={layout.status === "show" ? "Hide" : "Show"}
                      >
                        {layout.status === "show" ? (
                          <FiEye className="w-4 h-4" />
                        ) : (
                          <FiEyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(layout)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(layout._id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoreLayouts;
