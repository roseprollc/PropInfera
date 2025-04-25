"use client";

interface ActionButtonsProps {
  onReset: () => void;
  onSave: () => void;
  saveDisabled?: boolean;
}

export default function ActionButtons({ onReset, onSave, saveDisabled = false }: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
      <button
        type="button"
        onClick={onReset}
        className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg hover:shadow-gray-500/50 w-full sm:w-auto"
      >
        Reset
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saveDisabled}
        className="px-6 py-3 bg-[#2ecc71] text-white rounded-md hover:bg-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg hover:shadow-[#2ecc71]/50 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
      >
        Save Analysis
      </button>
    </div>
  );
} 