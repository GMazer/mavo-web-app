import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium uppercase">Tổng doanh thu</h3>
                <p className="text-3xl font-bold mt-2">12,500,000₫</p>
                <span className="text-green-500 text-sm font-medium mt-1 inline-block">+12% so với tuần trước</span>
            </div>
        </div>
    );
};

export default Dashboard;
