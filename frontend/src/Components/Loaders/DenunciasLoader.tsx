
export const DenunciasLoader = () => {
    const skeletonRows = Array.from({ length: 6 }, (_, index) => (
        <tr key={index} className="animate-pulse">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-24 bg-gray-100 rounded"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </td>
            <td className="px-6 capitalize py-4 whitespace-nowrap">
                <div className="h-4 w-28 bg-gray-200 rounded"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex space-x-2 justify-center items-center">
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
            </td>
        </tr>
    ));
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-(--primary-color) bg-opacity-10">
                    <tr>
                        <th className="px-6 py-3 text-left">
                            <div className="h-4 w-16 bg-gray-300 rounded"></div>
                        </th>
                        <th className="px-6 py-3 text-left">
                            <div className="h-4 w-16 bg-gray-300 rounded"></div>
                        </th>
                        <th className="px-6 py-3 text-left">
                            <div className="h-4 w-16 bg-gray-300 rounded"></div>
                        </th>
                        <th className="px-6 py-3 text-left">
                            <div className="h-4 w-16 bg-gray-300 rounded"></div>
                        </th>
                        <th className="px-6 py-3 text-left">
                            <div className="h-4 w-16 bg-gray-300 rounded"></div>
                        </th>
                        <th className="px-6 py-3 text-center">
                            <div className="h-4 w-16 mx-auto bg-gray-300 rounded"></div>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {skeletonRows}
                </tbody>
            </table>
            <div className="flex justify-between items-center p-4 border-t">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="flex space-x-2">
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    <div className="hidden sm:flex space-x-1">
                        {Array.from({ length: 3 }, (_, i) => (
                            <div key={i} className="h-8 w-8 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    )
}