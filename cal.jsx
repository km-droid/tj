//*pages/index.tsx
import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Search, ChevronUp, ChevronDown, Edit, ArrowUpDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Header from '@/components/Header'
import MetricCard from '@/components/MetricCard'

const metrics = [
  { title: 'Hardware Acquired', value: 250, trend: 'up' },
  { title: 'Software Installed', value: 200, trend: 'up' },
  { title: 'In-progress', value: 50, trend: 'down' },
  { title: 'Live', value: 150, trend: 'up' },
]

const inProgressData = [
  { storeNo: '001', rolloutPhase: 'Phase 1', status: 'In Progress', zipcode: '12345' },
  { storeNo: '002', rolloutPhase: 'Phase 2', status: 'Pending', zipcode: '23456' },
  { storeNo: '003', rolloutPhase: 'Phase 1', status: 'In Progress', zipcode: '34567' },
  { storeNo: '004', rolloutPhase: 'Phase 3', status: 'Delayed', zipcode: '45678' },
  { storeNo: '005', rolloutPhase: 'Phase 2', status: 'In Progress', zipcode: '56789' },
]

const completedData = [
  { storeNo: '006', rolloutPhase: 'Phase 3', zipcode: '67890' },
  { storeNo: '007', rolloutPhase: 'Phase 3', zipcode: '78901' },
  { storeNo: '008', rolloutPhase: 'Phase 3', zipcode: '89012' },
  { storeNo: '009', rolloutPhase: 'Phase 3', zipcode: '90123' },
  { storeNo: '010', rolloutPhase: 'Phase 3', zipcode: '01234' },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState('in-progress')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const router = useRouter()

  const itemsPerPage = 5
  const maxPages = 5

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortData = (data: any[]) => {
    if (!sortColumn) return data

    return [...data].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }

  const filterData = (data: any[]) => {
    return data.filter(
      (store) =>
        store.storeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.rolloutPhase.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (store.status && store.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
        store.zipcode.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const paginateData = (data: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return data.slice(startIndex, startIndex + itemsPerPage)
  }

  const filteredInProgressData = filterData(inProgressData)
  const filteredCompletedData = filterData(completedData)

  const sortedInProgressData = sortData(filteredInProgressData)
  const sortedCompletedData = sortData(filteredCompletedData)

  const paginatedInProgressData = paginateData(sortedInProgressData)
  const paginatedCompletedData = paginateData(sortedCompletedData)

  const totalPages = Math.ceil((activeTab === 'in-progress' ? filteredInProgressData.length : filteredCompletedData.length) / itemsPerPage)

  const handleRowClick = (storeNo: string) => {
    router.push(`/store/${storeNo}`)
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Head>
        <title>Retail Store Rollout Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        <div className="mb-4">
          <div className="flex space-x-4 border-b overflow-x-auto">
            <Button
              variant="ghost"
              className={`py-2 px-4 ${
                activeTab === 'in-progress'
                  ? 'border-b-2 border-primary font-semibold'
                  : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab('in-progress')}
            >
              In-Progress
            </Button>
            <Button
              variant="ghost"
              className={`py-2 px-4 ${
                activeTab === 'completed'
                  ? 'border-b-2 border-primary font-semibold'
                  : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </Button>
          </div>
        </div>

        <div className="mb-4 flex items-center">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search stores..."
            className="max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <Table className="table-auto border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort('storeNo')}>
                  <div className="flex items-center">
                    Store No
                    <SortIcon column="storeNo" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('rolloutPhase')}>
                  <div className="flex items-center">
                    Rollout Phase
                    <SortIcon column="rolloutPhase" />
                  </div>
                </TableHead>
                {activeTab === 'in-progress' && <TableHead>Status</TableHead>}
                <TableHead className="cursor-pointer" onClick={() => handleSort('zipcode')}>
                  <div className="flex items-center">
                    Zipcode
                    <SortIcon column="zipcode" />
                  </div>
                </TableHead>
                {activeTab === 'in-progress' && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(activeTab === 'in-progress' ? paginatedInProgressData : paginatedCompletedData).map((store) => (
                <TableRow 
                  key={store.storeNo} 
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(store.storeNo)}
                >
                  <TableCell className="font-medium">{store.storeNo}</TableCell>
                  <TableCell>{store.rolloutPhase}</TableCell>
                  {activeTab === 'in-progress' && <TableCell>{store.status}</TableCell>}
                  <TableCell>{store.zipcode}</TableCell>
                  {activeTab === 'in-progress' && (
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); console.log('Edit clicked') }}>
                        <Edit size={16} />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-center space-x-2">
          {Array.from({ length: Math.min(maxPages, totalPages) }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          {totalPages > maxPages && (
            <>
              <span className="self-center">...</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

//*pages/storedetails.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const testData = {
  '001': {
    name: 'Store 001',
    address: '123 Main St, Anytown, USA',
    phases: [
      { name: 'Hardware Requested', status: 'complete' },
      { name: 'Hardware Delivered', status: 'complete' },
      { name: 'Software Install', status: 'in-progress' },
      { name: 'Live', status: 'yet-to-start' },
    ],
  },
  '002': {
    name: 'Store 002',
    address: '456 Elm St, Othertown, USA',
    phases: [
      { name: 'Hardware Requested', status: 'complete' },
      { name: 'Hardware Delivered', status: 'complete' },
      { name: 'Software Install', status: 'complete' },
      { name: 'Live', status: 'in-progress' },
    ],
  },
}

export default function StorePage() {
  const router = useRouter()
  const { storeNo } = router.query
  const [storeData, setStoreData] = useState(null)

  useEffect(() => {
    if (storeNo && typeof storeNo === 'string') {
      // Simulating data fetch
      setTimeout(() => {
        setStoreData(testData[storeNo] || {
          name: `Store ${storeNo}`,
          address: 'Address not found',
          phases: [
            { name: 'Hardware Requested', status: 'yet-to-start' },
            { name: 'Hardware Delivered', status: 'yet-to-start' },
            { name: 'Software Install', status: 'yet-to-start' },
            { name: 'Live', status: 'yet-to-start' },
          ],
        })
      }, 500) // Simulating a 500ms delay
    }
  }, [storeNo])

  if (!storeData) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div>Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Head>
        <title>Store {storeNo} Rollout Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{storeData.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{storeData.address}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rollout Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              {storeData.phases.map((phase, index) => (
                <TooltipProvider key={phase.name}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex flex-col items-center">
                        <div 
                          className={`w-8 h-8 rounded-full mb-2 ${
                            phase.status === 'complete' ? 'bg-green-500' :
                            phase.status === 'in-progress' ? 'bg-yellow-500' :
                            'bg-gray-300'
                          }`}
                        />
                        <div className="text-xs text-center max-w-[80px]">{phase.name}</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{phase.status === 'complete' ? 'Complete' : 
                          phase.status === 'in-progress' ? 'In Progress' : 
                          'Yet to Start'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            <div className="mt-4 h-2 bg-gray-200  rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(storeData.phases.filter(p => p.status === 'complete').length / storeData.phases.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

//*/components/header.tsx
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, User } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Store Rollout</h1>
        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/onboard" className="hover:text-primary transition-colors">Onboard</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <div className="flex items-center space-x-2">
            <span className="hidden md:inline">John Doe</span>
            <User size={24} className="text-primary" />
          </div>
        </div>
      </div>
    </header>
  )
}

//* /components/MetricCard.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: number
  trend: 'up' | 'down'
}

export default function MetricCard({ title, value, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className={`h-4 w-4 ${
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          <path d={trend === 'up' ? 'M7 17l5-5 5 5' : 'M7 7l5 5 5-5'} />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {trend === 'up' ? '+' : '-'}{Math.floor(Math.random() * 10) + 1}% from last month
        </p>
      </CardContent>
    </Card>
  )
}
