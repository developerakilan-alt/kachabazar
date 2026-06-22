"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLayout, FiChevronUp } from "react-icons/fi";
import { getShowingLayouts } from "@services/ThemeServices";

const LayoutSwitcher = ({ currentLayout = "default", storeLayouts = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLayout, setActiveLayout] = useState(currentLayout);
  const [layouts, setLayouts] = useState(storeLayouts);
  const [loading, setLoading] = useState(storeLayouts.length === 0);
  const router = useRouter();

  useEffect(() => {
    if (storeLayouts.length > 0) return;
    const fetchLayouts = async () => {
      try {
        const { layouts: data } = await getShowingLayouts();
        if (data && data.length > 0) {
          setLayouts(data);
        }
      } catch (err) {
        console.error("Failed to fetch layouts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLayouts();
  }, [storeLayouts]);

  useEffect(() => {
    setActiveLayout(currentLayout);
  }, [currentLayout]);

  const handleLayoutChange = (layout) => {
    setActiveLayout(layout);
    setIsOpen(false);
    router.push(`/?layout=${layout}`);
    router.refresh();
  };

  const visibleLayouts = layouts.filter((l) => l.value !== "heritage");

  if (loading || visibleLayouts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="bg-background border border-border rounded-2xl shadow-2xl p-2 mb-1 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 pt-1 pb-2">
            Switch Layout
          </p>
          {visibleLayouts.map((layout) => {
            const isActive = activeLayout === layout.value;
            return (
              <button
                key={layout.value}
                onClick={() => handleLayoutChange(layout.value)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="text-base">{layout.icon}</span>
                <span>{layout.label}</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        title="Switch layout"
      >
        <FiLayout className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">Layout</span>
        <FiChevronUp
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default LayoutSwitcher;
