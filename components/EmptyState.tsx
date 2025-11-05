import { FaBoxOpen } from 'react-icons/fa';

interface EmptyStateProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

export default function EmptyState({ 
  title = "محتوایی یافت نشد", 
  description = "در حال حاضر هیچ آیتمی در این بخش موجود نیست",
  showBackButton = true 
}: EmptyStateProps) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center p-8">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
          <FaBoxOpen className="text-4xl text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-700 mb-2">
          {title}
        </h1>
        <p className="text-gray-500 mb-6">
          {description}
        </p>
        {showBackButton && (
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            بازگشت
          </button>
        )}
      </div>
    </div>
  );
}