"use client";

import { useState } from "react";
import { Analysis } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface EditAnalysisFormProps {
  analysis: Analysis;
  onSave: (updatedAnalysis: Analysis) => Promise<void>;
}

export function EditAnalysisForm({ analysis, onSave }: EditAnalysisFormProps) {
  const [title, setTitle] = useState(analysis.title);
  const [notes, setNotes] = useState(analysis.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave({
        ...analysis,
        title,
        notes,
      });
      router.push("/dashboard/saved");
    } catch (error) {
      console.error("Error saving analysis:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="Enter analysis title"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
          placeholder="Add any notes about this analysis"
          rows={4}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/saved")}
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