interface StatProps {
  label: string;
  value: string;
  isPositive?: boolean;
}

export function Stat({ label, value, isPositive }: StatProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className={`mt-1 text-2xl font-semibold ${isPositive === undefined ? '' : isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {value}
      </dd>
    </div>
  );
} 