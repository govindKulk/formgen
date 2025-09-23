'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { ArrowLeft, Eye, MousePointer, Users, TrendingUp, FileText, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts'

interface AnalyticsData {
    overview: {
        totalVisits: number
        totalSubmissions: number
        uniqueVisitors: number
        conversionRate: number
        recentVisits: number
        recentSubmissions: number
    }
    chartData: Array<{
        date: string
        visits: number
        submissions: number
    }>
    pieData: Array<{
        name: string
        value: number
        fill: string
    }>
    responses: Array<{
        id: string
        responderName: string
        responderEmail: string
        submittedAt: string
        content: any
    }>
    form: {
        id: string
        title: string
        published: boolean
        createdAt: string
    }
}

export default function FormAnalyticsPage() {
    const params = useParams()
    const formId = params.id as string
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedResponse, setSelectedResponse] = useState<any>(null)

    useEffect(() => {
        fetchAnalytics()
    }, [formId])

    const fetchAnalytics = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/forms/${formId}/analytics`)

            if (!response.ok) {
                throw new Error('Failed to fetch analytics')
            }

            const data = await response.json()
            setAnalytics(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatContent = (content: any) => {
        if (typeof content === 'object') {
            return Object.entries(content).map(([key, value]) => (
                <div key={key} className="mb-2 ">
                    <span className="font-bold text-gray-600 capitalize">{key.replaceAll("_", " ")}:</span>
                    <div className="text-sm">{String(value)}</div>
                </div>
            ))
        }
        return String(content)
    }

    if (loading) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading analytics...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !analytics) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error || 'Failed to load analytics'}</p>
                        <Button onClick={fetchAnalytics}>Try Again</Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 space-y-6 max-w-screen-xl px-4">
            {/* Header */}
            <div
            className='flex flex-col  md:space-y-0 md:flex-row md:items-center gap-4 mb-4'
            >

                <Button variant="outline" size="icon" asChild>
                    <Link href="/forms">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex items-center justify-between w-full">
           
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold">{analytics.form.title}</h1>
                            <p className="text-gray-600">Form Analytics</p>
                        </div>
         
                    <div className="flex items-center space-x-2">
                        <Badge variant={analytics.form.published ? "default" : "secondary"}>
                            {analytics.form.published ? "Published" : "Draft"}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/forms/${formId}`} target="_blank">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Form
                            </Link>
                        </Button>
                    </div>
                </div>

            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.overview.totalVisits}</div>
                        <p className="text-xs text-muted-foreground">
                            {analytics.overview.recentVisits} in last 7 days
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.overview.totalSubmissions}</div>
                        <p className="text-xs text-muted-foreground">
                            {analytics.overview.recentSubmissions} in last 7 days
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.overview.uniqueVisitors}</div>
                        <p className="text-xs text-muted-foreground">
                            Last 30 days
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.overview.conversionRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            Submissions / Visits
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Visits Overview</CardTitle>
                        <CardDescription>Distribution of visits and submissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                submissions: {
                                    label: "Submissions",
                                    color: "hsl(142, 76%, 36%)",
                                },
                                bounced: {
                                    label: "Bounced Visits",
                                    color: "hsl(0, 84%, 60%)",
                                },
                            }}
                            className="mx-auto aspect-square max-h-[300px]"
                        >
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                <Pie
                                    data={analytics.pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={120}
                                    paddingAngle={2}
                                    cornerRadius={8}
                                >
                                    <LabelList
                                        dataKey="value"
                                        className="fill-background"
                                        stroke="none"
                                        fontSize={12}
                                        formatter={(value: number) => value.toString()}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Line Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>30-Day Trend</CardTitle>
                        <CardDescription>Daily visits and submissions over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                visits: {
                                    label: "Visits",
                                    color: "hsl(var(--primary))",
                                },
                                submissions: {
                                    label: "Submissions",
                                    color: "hsl(142, 76%, 36%)",
                                },
                            }}
                            className="aspect-auto h-[300px] w-full"
                        >
                            <LineChart data={analytics.chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    fontSize={12}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    fontSize={12}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="monotone"
                                    dataKey="visits"
                                    stroke="var(--color-visits)"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="submissions"
                                    stroke="var(--color-submissions)"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Responses Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Form Responses</CardTitle>
                    <CardDescription>
                        All responses submitted to this form ({analytics.responses.length} total)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Responder</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analytics.responses.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            No responses yet
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    analytics.responses.map((response) => (
                                        <TableRow key={response.id}>
                                            <TableCell className="font-medium">
                                                {response.responderName}
                                            </TableCell>
                                            <TableCell>{response.responderEmail}</TableCell>
                                            <TableCell>{formatDate(response.submittedAt)}</TableCell>
                                            <TableCell>
                                                <Sheet>
                                                    <SheetTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setSelectedResponse(response)}
                                                        >
                                                            View Details
                                                        </Button>
                                                    </SheetTrigger>
                                                    <SheetContent className="w-[400px] sm:w-[540px] ">
                                                        <SheetHeader>
                                                            <SheetTitle
                                                                className='text-2xl'
                                                            >Response Details</SheetTitle>
                                                            <SheetDescription>
                                                                Submitted by {response.responderName} on{' '}
                                                                {formatDate(response.submittedAt)}
                                                            </SheetDescription>
                                                        </SheetHeader>
                                                        <div className="mt-6 space-y-4 px-4 pb-4">
                                                            <div>
                                                                <h4 className="font-medium mb-2">Responder Information</h4>
                                                                <div className="space-y-2 text-sm">
                                                                    <div>
                                                                        <span className="font-medium">Name:</span> {response.responderName}
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-medium">Email:</span> {response.responderEmail}
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-medium">Submitted:</span>{' '}
                                                                        {formatDate(response.submittedAt)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium mb-2">Form Data</h4>
                                                                <div className="bg-gray-50 rounded-lg p-4 space-y-2 shadow-md ring-2 ring-primary/30">
                                                                    {formatContent(response.content)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SheetContent>
                                                </Sheet>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}