//* src/lib/firebase.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

//*src/lib/api.ts
import { db } from './firebase';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { Store, RolloutTask, HardwareInventory, SoftwareInstallation, RolloutMetrics } from '../types/firebase';

// Stores
export const addStore = async (store: Omit<Store, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'stores'), store);
  return docRef.id;
};

export const getStores = async (): Promise<Store[]> => {
  const querySnapshot = await getDocs(collection(db, 'stores'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Store));
};

export const getStore = async (id: string): Promise<Store | null> => {
  const docRef = doc(db, 'stores', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Store : null;
};

export const updateStore = async (id: string, store: Partial<Store>): Promise<void> => {
  const docRef = doc(db, 'stores', id);
  await updateDoc(docRef, store);
};

export const deleteStore = async (id: string): Promise<void> => {
  const docRef = doc(db, 'stores', id);
  await deleteDoc(docRef);
};

// Rollout Tasks
export const addRolloutTask = async (task: Omit<RolloutTask, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'rolloutTasks'), task);
  return docRef.id;
};

export const getRolloutTasks = async (storeId: string): Promise<RolloutTask[]> => {
  const q = query(collection(db, 'rolloutTasks'), where('storeId', '==', storeId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RolloutTask));
};

// Hardware Inventory
export const addHardwareInventory = async (item: Omit<HardwareInventory, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'hardwareInventory'), item);
  return docRef.id;
};

export const getHardwareInventory = async (storeId: string): Promise<HardwareInventory[]> => {
  const q = query(collection(db, 'hardwareInventory'), where('storeId', '==', storeId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HardwareInventory));
};

// Software Installations
export const addSoftwareInstallation = async (installation: Omit<SoftwareInstallation, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'softwareInstallations'), installation);
  return docRef.id;
};

export const getSoftwareInstallations = async (storeId: string): Promise<SoftwareInstallation[]> => {
  const q = query(collection(db, 'softwareInstallations'), where('storeId', '==', storeId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SoftwareInstallation));
};

// Rollout Metrics
export const addRolloutMetrics = async (metrics: Omit<RolloutMetrics, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'rolloutMetrics'), metrics);
  return docRef.id;
};

export const getRolloutMetrics = async (): Promise<RolloutMetrics[]> => {
  const querySnapshot = await getDocs(collection(db, 'rolloutMetrics'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RolloutMetrics));
};

//*src/types/firebase.ts

import { Timestamp } from 'firebase/firestore';

export interface Store {
  id: string;
  name: string;
  storeNo: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
  };
  rolloutPhase: string;
  status: string;
  manager: string;
  contactEmail: string;
  contactPhone: string;
  size: number;
  annualRevenue: number;
  startDate: Timestamp;
  completionDate: Timestamp | null;
}

export interface RolloutTask {
  id: string;
  storeId: string;
  taskName: string;
  description: string;
  status: string;
  assignedTo: string;
  dueDate: Timestamp;
  completionDate: Timestamp | null;
}

export interface HardwareInventory {
  id: string;
  storeId: string;
  itemName: string;
  itemType: string;
  quantity: number;
  status: string;
  installationDate: Timestamp | null;
}

export interface SoftwareInstallation {
  id: string;
  storeId: string;
  softwareName: string;
  version: string;
  status: string;
  installationDate: Timestamp | null;
}

export interface RolloutMetrics {
  id: string;
  date: Timestamp;
  storesInProgress: number;
  storesCompleted: number;
  hardwareAcquired: number;
  softwareInstalled: number;
  totalValue: number;
}

//* src/compo/layout.ts
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { HomeIcon, PlusCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline'

const menuItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Onboard a Store', href: '/onboard', icon: PlusCircleIcon },
  { name: 'Stats', href: '/stats', icon: ChartBarIcon },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gray-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <span className="text-white text-lg font-semibold">Store Rollout App</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      router.pathname === item.href
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

//* /src/comp/metriccard
import React from 'react'

interface MetricCardProps {
  title: string
  value: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export default function MetricCard({ title, value, icon: Icon }: MetricCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
//* src/pages/index.ts
import { useQuery } from '@tanstack/react-query'
import { getStores, getRolloutMetrics } from '@/lib/api'
import Layout from '@/components/Layout'
import MetricCard from '@/components/MetricCard'
import { CubeIcon, ServerIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Home() {
  const { data: stores } = useQuery(['stores'], getStores)
  const { data: metrics } = useQuery(['rolloutMetrics'], getRolloutMetrics)

  const latestMetrics = metrics?.[0] || { hardwareAcquired: 0, softwareInstalled: 0, storesInProgress: 0, totalValue: 0 }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Hardware Acquired" value={latestMetrics.hardwareAcquired.toString()} icon={CubeIcon} />
        <MetricCard title="Software Installed" value={latestMetrics.softwareInstalled.toString()} icon={ServerIcon} />
        <MetricCard title="Stores In-progress" value={latestMetrics.storesInProgress.toString()} icon={ClockIcon} />
        <MetricCard title="Total Value" value={`$${latestMetrics.totalValue.toLocaleString()}`} icon={CurrencyDollarIcon} />
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-4">Recent Stores</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {stores?.slice(0, 5).map((store) => (
            <li key={store.id}>
              <Link href={`/stores/${store.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">{store.name}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {store.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {store.address.city}, {store.address.state}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Started on {new Date(store.startDate.seconds * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

//*src/pages/onboard.tsx

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addStore } from '@/lib/api'
import Layout from '@/components/Layout'
import { Store } from '@/types/firebase'
import { Timestamp } from 'firebase/firestore'

export default function OnboardStore() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<Partial<Store>>({
    name: '',
    storeNo: '',
    address: {
      street: '',
      city:  '',
      state: '',
      zipcode: '',
      country: '',
    },
    rolloutPhase: 'Phase 1',
    status: 'Pending',
    manager: '',
    contactEmail: '',
    contactPhone: '',
    size: 0,
    annualRevenue: 0,
  })

  const mutation = useMutation(addStore, {
    onSuccess: () => {
      queryClient.invalidateQueries(['stores'])
      setFormData({
        name: '',
        storeNo: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipcode: '',
          country: '',
        },
        rolloutPhase: 'Phase 1',
        status: 'Pending',
        manager: '',
        contactEmail: '',
        contactPhone: '',
        size: 0,
        annualRevenue: 0,
      })
      alert('Store added successfully!')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      ...formData,
      startDate: Timestamp.now(),
      completionDate: null,
    } as Store)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Onboard a New Store</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Store Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="storeNo">
            Store Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="storeNo"
            type="text"
            name="storeNo"
            value={formData.storeNo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address.street">
            Street Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address.street"
            type="text"
            name="address.street"
            value={formData.address?.street}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address.city">
            City
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address.city"
            type="text"
            name="address.city"
            value={formData.address?.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address.state">
            State
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address.state"
            type="text"
            name="address.state"
            value={formData.address?.state}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address.zipcode">
            Zipcode
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address.zipcode"
            type="text"
            name="address.zipcode"
            value={formData.address?.zipcode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address.country">
            Country
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address.country"
            type="text"
            name="address.country"
            value={formData.address?.country}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rolloutPhase">
            Rollout Phase
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="rolloutPhase"
            name="rolloutPhase"
            value={formData.rolloutPhase}
            onChange={handleChange}
            required
          >
            <option value="Phase 1">Phase 1</option>
            <option value="Phase 2">Phase 2</option>
            <option value="Phase 3">Phase 3</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
            Status
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="manager">
            Manager
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="manager"
            type="text"
            name="manager"
            value={formData.manager}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactEmail">
            Contact Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="contactEmail"
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactPhone">
            Contact Phone
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="contactPhone"
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="size">
            Store Size (sq ft)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="size"
            type="number"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="annualRevenue">
            Annual Revenue
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="annualRevenue"
            type="number"
            name="annualRevenue"
            value={formData.annualRevenue}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Onboard Store
          </button>
        </div>
      </form>
    </Layout>
  )
}

//* src/pages/stats.tsx
import { useQuery } from '@tanstack/react-query'
import { getStores, getRolloutMetrics } from '@/lib/api'
import Layout from '@/components/Layout'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Stats() {
  const { data: stores } = useQuery(['stores'], getStores)
  const { data: metrics } = useQuery(['rolloutMetrics'], getRolloutMetrics)

  const latestMetrics = metrics?.[0] || { hardwareAcquired: 0, softwareInstalled: 0, storesInProgress: 0, totalValue: 0 }

  const storesByPhase = stores?.reduce((acc, store) => {
    acc[store.rolloutPhase] = (acc[store.rolloutPhase] || 0) + 1
    return acc
  }, {})

  const storesByStatus = stores?.reduce((acc, store) => {
    acc[store.status] = (acc[store.status] || 0) + 1
    return acc
  }, {})

  const phaseData = Object.entries(storesByPhase || {}).map(([name, value]) => ({ name, value }))
  const statusData = Object.entries(storesByStatus || {}).map(([name, value]) => ({ name, value }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Rollout Statistics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
          <div className="text-4xl font-bold text-blue-600">{latestMetrics.storesInProgress} / {stores?.length}</div>
          <div className="text-gray-600">Stores in progress</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Total Value</h2>
          <div className="text-4xl font-bold text-green-600">${latestMetrics.totalValue.toLocaleString()}</div>
          <div className="text-gray-600">Invested in rollout</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Stores by Rollout Phase</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={phaseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {phaseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Stores by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Hardware and Software Progress</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { name: 'Hardware', value: latestMetrics.hardwareAcquired },
              { name: 'Software', value: latestMetrics.softwareInstalled },
            ]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Rollout Timeline</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={metrics?.slice().reverse() || []}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(value) => new Date(value.seconds * 1000).toLocaleDateString()} />
            <YAxis />
            <Tooltip labelFormatter={(value) => new Date(value * 1000).toLocaleDateString()} />
            <Legend />
            <Bar dataKey="storesInProgress" fill="#8884d8" name="Stores In Progress" />
            <Bar dataKey="storesCompleted" fill="#82ca9d" name="Stores Completed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  )
}
//*src/pages/stores[id].tsx
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { getStore, getRolloutTasks, getHardwareInventory, getSoftwareInstallations } from '@/lib/api'
import Layout from '@/components/Layout'

export default function StoreDetails() {
  const router = useRouter()
  const { id } = router.query

  const { data: store, isLoading: storeLoading } = useQuery(['store', id], () => getStore(id as string), {
    enabled: !!id,
  })
  const { data: tasks } = useQuery(['rolloutTasks', id], () => getRolloutTasks(id as string), {
    enabled: !!id,
  })
  const { data: hardware } = useQuery(['hardwareInventory', id], () => getHardwareInventory(id as string), {
    enabled: !!id,
  })
  const { data: software } = useQuery(['softwareInstallations', id], () => getSoftwareInstallations(id as string), {
    enabled: !!id,
  })

  if (storeLoading) return <Layout><div>Loading...</div></Layout>
  if (!store) return <Layout><div>Store not found</div></Layout>

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">{store.name}</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Store Information</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Store Number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{store.storeNo}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {store.address.street}, {store.address.city}, {store.address.state} {store.address.zipcode}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Rollout Phase</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{store.rolloutPhase}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{store.status}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Manager</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{store.manager}</dd>
            </div>
          </dl>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Rollout Tasks</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {tasks?.map((task) => (
            <li key={task.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">{task.taskName}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {task.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Assigned to: {task.assignedTo}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Due: {new Date(task.dueDate.seconds * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Hardware Inventory</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {hardware?.map((item) => (
            <li key={item.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">{item.itemName}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {item.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Type: {item.itemType}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Software Installations</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {software?.map((installation) => (
            <li key={installation.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">{installation.softwareName}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {installation.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Version: {installation.version}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Installed: {installation.installationDate ? new Date(installation.installationDate.seconds * 1000).toLocaleDateString() : 'Not installed'}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

//*src/pages/_app.tsx

import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}

