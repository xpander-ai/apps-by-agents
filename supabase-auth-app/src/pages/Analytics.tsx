import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { Layout } from '../components/Layout'

const trafficData = [
  { name: 'Organic', value: 400, color: '#0088FE' },
  { name: 'Paid', value: 300, color: '#00C49F' },
  { name: 'Social', value: 200, color: '#FFBB28' },
  { name: 'Direct', value: 100, color: '#FF8042' },
]

const sessionData = [
  { name: 'Mon', sessions: 2400, pageViews: 4000 },
  { name: 'Tue', sessions: 1398, pageViews: 3000 },
  { name: 'Wed', sessions: 9800, pageViews: 2000 },
  { name: 'Thu', sessions: 3908, pageViews: 2780 },
  { name: 'Fri', sessions: 4800, pageViews: 1890 },
  { name: 'Sat', sessions: 3800, pageViews: 2390 },
  { name: 'Sun', sessions: 4300, pageViews: 3490 },
]

export const Analytics: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">👁️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Page Views
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">18,560</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">⏱️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Avg Session Duration
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">4:32</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">↩️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Bounce Rate
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">34.2%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Traffic Sources</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Weekly Sessions & Page Views</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sessionData}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="sessions" stroke="#8884d8" fillOpacity={1} fill="url(#colorSessions)" />
                <Area type="monotone" dataKey="pageViews" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPageViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Top Pages</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unique Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bounce Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/dashboard</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4,532</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3,421</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">23.4%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/analytics</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2,341</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1,876</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">31.2%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/reports</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1,234</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">987</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">45.6%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}