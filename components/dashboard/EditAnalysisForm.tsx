"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Analysis, CalculatorType } from "@/types/analysis";

interface EditAnalysisFormProps<T extends CalculatorType> {
  initialData: Analysis<T>;
  onSave: (updatedData: Partial<Analysis<T>>) => Promise<void>;
}

export function EditAnalysisForm<T extends CalculatorType>({
  initialData,
  onSave,
}: EditAnalysisFormProps<T>) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData.title);
  const [notes, setNotes] = useState(initialData.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        title,
        notes,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving analysis:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1"
            rows={4}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

EditAnalysisForm.displayName = "EditAnalysisForm"; 