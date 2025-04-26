"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Analysis, CalculatorType } from "@/types/analysis";

interface EditAnalysisFormProps<T extends CalculatorType> {
  analysis: Analysis<T>;
  onSave: (data: { title: string; notes: string }) => Promise<void>;
}

export function EditAnalysisForm<T extends CalculatorType>({
  analysis,
  onSave,
}: EditAnalysisFormProps<T>) {
  const router = useRouter();
  const [title, setTitle] = React.useState(analysis.title);
  const [notes, setNotes] = React.useState(analysis.notes || "");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({ title, notes });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save analysis:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter analysis title"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter analysis notes"
          rows={4}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

EditAnalysisForm.displayName = "EditAnalysisForm"; 