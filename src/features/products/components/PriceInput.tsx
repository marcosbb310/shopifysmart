"use client";

import { useState, useEffect } from "react";
import { Input, Button } from "@/components/ui";
import { Check, X, Edit3 } from "lucide-react";

interface PriceInputProps {
  value: number;
  label: string;
  onSave: (newValue: number) => void;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function PriceInput({ 
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

  useEffect(() => {
    setEditValue(value.toString());
  }, [value]);

  const handleEdit = () => {
    if (disabled) return;
    setIsEditing(true);
    setEditValue(value.toString());
    setError("");
  };

  const handleSave = () => {
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

    onSave(numValue);
    setIsEditing(false);
    setError("");
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

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
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            min={min}
            max={max}
            step={step}
            className="text-lg font-semibold"
            autoFocus
          />
          {error && (
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          )}
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSave}
              className="h-6 px-2"
            >
              <Check className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="h-6 px-2"
            >
              <X className="w-3 h-3" />
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
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {formatPrice(value)}
          </div>
        </div>
        {!disabled && (
          <Edit3 className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  );
}
