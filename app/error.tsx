'use client';

export default function GlobalError({ error }: { error: Error }) {
  return (
    <div className="text-center text-red-500 p-10">
      An unexpected error occurred: {error.message}
    </div>
  );
} 