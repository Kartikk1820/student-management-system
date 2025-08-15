import {
  BookOpenIcon,
  ChartBarIcon,
  CalendarIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

const StatsCard = ({
  icon: Icon,
  title,
  value,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center">
        <div className={`p-2 ${iconBgColor} rounded-lg`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
