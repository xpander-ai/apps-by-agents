import React from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from 'recharts'
import { Layout } from '../components/Layout'

const performanceData = [
  { name: 'Q1', revenue: 4000, profit: 2400, growth: 24 },
  { name: 'Q2', revenue: 3000, profit: 1398, growth: 22 },
  { name: 'Q3', revenue: 2000, profit: 9800, growth: 29 },
  { name: 'Q4', revenue: 2780, profit: 3908, growth: 35 },
]

const kpiData = [
  { name: 'Customer Satisfaction', value: 85, fill: '#8884d8' },
  { name: 'Employee Satisfaction', value: 78, fill: '#83a6ed' },
  { name: 'Market Share', value: 65, fill: '#8dd1e1' },
  { name: 'Brand Awareness', value: 72, fill: '#82ca9d' },
]

export const Reports: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <div className="flex space-x-3">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Export PDF
            </button>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Export Excel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-blue-500">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">💼</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Sales
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">$145,672</dd>
                    <dd className="text-sm text-green-600">+12.5% from last month</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-green-500">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <span className="text-green-600 text-sm font-medium">📊</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Conversion Rate
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">3.24%</dd>
                    <dd className="text-sm text-green-600">+0.4% from last month</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-yellow-500">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                    <span className="text-yellow-600 text-sm font-medium">⚠️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Churn Rate
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">2.1%</dd>
                    <dd className="text-sm text-red-600">+0.3% from last month</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-purple-500">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <span className="text-purple-600 text-sm font-medium">💰</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Customer LTV
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">$1,247</dd>
                    <dd className="text-sm text-green-600">+8.2% from last month</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quarterly Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" />
                <Bar yAxisId="left" dataKey="profit" fill="#82ca9d" name="Profit" />
                <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#ff7300" name="Growth %" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Key Performance Indicators</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={kpiData}>
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  dataKey="value"
                />
                <Legend iconSize={18} width={120} height={140} layout="vertical" verticalAlign="middle" />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">📈</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Sales report generated</p>
                <p className="text-sm text-gray-500">Monthly sales report for July 2025 has been generated and is ready for review.</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-medium">✅</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Data backup completed</p>
                <p className="text-sm text-gray-500">Automatic daily backup of all reports and analytics data completed successfully.</p>
                <p className="text-xs text-gray-400 mt-1">6 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm font-medium">⚠️</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Performance alert</p>
                <p className="text-sm text-gray-500">Website response time exceeded threshold of 3 seconds for 15 minutes.</p>
                <p className="text-xs text-gray-400 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}