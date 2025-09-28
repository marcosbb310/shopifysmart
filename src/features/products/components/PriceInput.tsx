"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { Input, Button } from "@/components/ui";
import { Check, X, Edit3, Loader2 } from "lucide-react";

/**
 * Props for the PriceInput component
 */
interface PriceInputProps {
  /** Current price value */
  value: number;
  /** Label for the input field */
  label: string;
  /** Callback when price is saved */
  onSave: (newValue: number) => Promise<void> | void;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step increment for the input */
  step?: number;
}

/**
 * PriceInput component for editing product prices with inline editing
 * 
 * Features:
 * - Inline editing with save/cancel functionality
 * - Input validation with min/max constraints
 * - Loading states during save operations
 * - Error handling and display
 * - Keyboard shortcuts (Enter to save, Escape to cancel)
 * 
 * @param props - Component props
 * @returns JSX element representing the price input
 */
function PriceInputComponent({ 
  value, 
  label, 
  onSave, 
  disabled = false, 
  className = "",
  min = 0,
  max = 999999,
  step = 0.01
}: PriceInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditValue(value.toString());
  }, [value]);

  const handleEdit = useCallback(() => {
    if (disabled) return;
    setIsEditing(true);
    setEditValue(value.toString());
    setError("");
  }, [disabled, value]);

  const handleSave = useCallback(async () => {
    const numValue = parseFloat(editValue);
    
    if (isNaN(numValue)) {
      setError("Please enter a valid number");
      return;
    }
    
    if (numValue < min) {
      setError(`Value must be at least ${min}`);
      return;
    }
    
    if (numValue > max) {
      setError(`Value must be at most ${max}`);
      return;
    }

    try {
      setIsSaving(true);
      await onSave(numValue);
      setIsEditing(false);
      setError("");
    } catch (error) {
      setError("Failed to save. Please try again.");
      console.error("Price save error:", error);
    } finally {
      setIsSaving(false);
    }
  }, [editValue, min, max, onSave]);

  const handleCancel = useCallback(() => {
    setEditValue(value.toString());
    setIsEditing(false);
    setError("");
  }, [value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (isEditing) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
        <div className="space-y-1">
          <Input
            type="number"
            value={editValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            min={min}
            max={max}
            step={step}
            className="text-lg font-semibold"
            autoFocus
            aria-label={`Edit ${label.toLowerCase()}`}
            aria-describedby={error ? `${label.toLowerCase()}-error` : undefined}
            aria-invalid={!!error}
          />
          {error && (
            <p id={`${label.toLowerCase()}-error`} className="text-xs text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
              className="h-6 px-2"
              aria-label={`Save ${label.toLowerCase()}`}
            >
              {isSaving ? (
                <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
              ) : (
                <Check className="w-3 h-3" aria-hidden="true" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              className="h-6 px-2"
              aria-label={`Cancel editing ${label.toLowerCase()}`}
            >
              <X className="w-3 h-3" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors rounded-lg p-3 ${className}`}
      onClick={handleEdit}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Edit ${label.toLowerCase()}, current value: ${formatPrice(value)}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleEdit();
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {formatPrice(value)}
          </div>
        </div>
        {!disabled && (
          <Edit3 className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

// Export memoized component for performance optimization
export const PriceInput = memo(PriceInputComponent);
