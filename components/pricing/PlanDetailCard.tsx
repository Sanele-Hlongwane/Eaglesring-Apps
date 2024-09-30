const PlanDetailCard = ({ title, value, price }) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md transition-shadow duration-300">
      <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {title}: <span className="font-bold">{value}</span>
      </div>
      {price && <div className="text-lg text-gray-600 dark:text-gray-400">{price}</div>}
    </div>
  );
  