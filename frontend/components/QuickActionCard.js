import { ArrowRightIcon } from "@heroicons/react/24/outline";

const QuickActionCard = ({
  icon: Icon,
  title,
  description,
  onClick,
  iconColor = "text-blue-600",
  buttonColor = "text-blue-600",
  buttonHoverColor = "hover:text-blue-700",
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center mb-4">
        <Icon className={`h-8 w-8 ${iconColor} mr-3`} />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        onClick={onClick}
        className={`${buttonColor} ${buttonHoverColor} font-medium flex items-center`}
      >
        View Details
        <ArrowRightIcon className="h-4 w-4 ml-1" />
      </button>
    </div>
  );
};

export default QuickActionCard;
