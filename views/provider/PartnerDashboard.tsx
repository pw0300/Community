
import React from 'react';

interface PartnerDashboardProps {
    navigateTo: (view: string, data?: any) => void;
}

const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ navigateTo }) => {
    
    const StatCard: React.FC<{ title: string; value: string; change: string }> = ({ title, value, change }) => (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-gray-500">{title}</h4>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <p className="text-sm text-green-600 mt-1">{change}</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold">Partner Dashboard</h1>
                <p className="text-gray-600">Welcome, GrowthQuest University.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Enrollments" value="1,284" change="+12% this month" />
                <StatCard title="Completion Rate" value="89%" change="+2% this quarter" />
                <StatCard title="Active Courses" value="12" change="+2 new courses" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="text-xl font-bold">Student Management</h3>
                       <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm">
                           Upload Roster
                       </button>
                    </div>
                    <p className="text-gray-600">View and manage student enrollment lists for your active courses.</p>
                 </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="text-xl font-bold">Course Publisher</h3>
                       <button className="bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600 text-sm">
                           + Create New Course
                       </button>
                    </div>
                     <p className="text-gray-600">Publish new courses and manage existing offerings for your organization.</p>
                 </div>
            </div>
        </div>
    );
};

export default PartnerDashboard;
