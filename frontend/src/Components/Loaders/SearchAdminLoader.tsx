export const SearchAdminLoader = () => {
	return (
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden animate-pulse">
            <div className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="bg-blue-200 h-24 w-24 rounded-full"></div>

                    <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div className="flex flex-wrap gap-3">
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                    <div className="flex flex-wrap gap-3">
                        <div className="h-10 bg-blue-200 rounded w-32"></div>
                        <div className="h-10 bg-red-200 rounded w-32"></div>
                        <div className="h-10 bg-purple-200 rounded w-32"></div>
                    </div>
                </div>
            </div>
        </div>
	);
};
