"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Analysis, AnalysisResults } from "@/types/analysis";

interface EditAnalysisFormProps {
  analysis: Analysis<AnalysisResults>;
  onSave: (updatedData: Partial<Analysis<AnalysisResults>>) => Promise<void>;
}

export function EditAnalysisForm({ analysis, onSave }: EditAnalysisFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(analysis.title);
  const [notes, setNotes] = useState(analysis.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        title,
        notes,
        type: analysis.type
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving analysis:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
            required
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
        <Button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

EditAnalysisForm.displayName = "EditAnalysisForm"; 