"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Code, Share2, BarChart3, Shield, Zap, ArrowRight, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/Logo.svg"
                alt="FormGen Logo"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="#" className="text-gray-600 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link href="#" className="text-gray-600 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">
                  About
                </Link>
                <Link href="#" className="text-gray-600 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                asChild
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105"
              >
                <Link href="/create">
                  Try Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Build Multi-Step Forms
              <br />
              <span className="text-green-600">Without Code</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Create sophisticated forms with conditional logic, export framework-ready code, or share
              instantly. All with our intuitive drag-and-drop builder.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Link href="/create" className="flex items-center gap-2">
                  Start Building Forms
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 rounded-full text-lg font-medium transition-all duration-200"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-green-600 font-semibold text-lg mb-4">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to Build Forms
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From simple contact forms to complex multi-step workflows, FormGen has
              you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Multi-Step Forms */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Multi-Step Forms</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Create complex workflows with conditional logic, branching paths, and dynamic field
                  validation.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Framework Export */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Framework Export</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Export clean, production-ready code for React, Vue, Angular, or vanilla JavaScript.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Instant Sharing */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Instant Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Share forms instantly with custom URLs. No hosting required - we handle everything for you.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Analytics Dashboard */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Track submissions, analyze user drop-off rates, and optimize your forms with detailed insights.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Smart Validation */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-red-50 to-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Smart Validation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Built-in validation rules, custom regex patterns, and real-time error handling.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Drag and Drop Builder */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-teal-50 to-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Drag and Drop Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Intuitive visual builder with 20+ field types, themes, and customization options.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-green-600 font-semibold text-lg mb-4">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              From Idea to Form in 3 Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process gets you from concept to collecting responses
              in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Design Your Form</h3>
              <p className="text-gray-600 leading-relaxed">
                Use our drag-and-drop builder to create your form.
                Add fields, set up logic, and customize the design.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Export or Share</h3>
              <p className="text-gray-600 leading-relaxed">
                Export clean code for your framework of choice, or get a shareable link for immediate use.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Collect & Analyze</h3>
              <p className="text-gray-600 leading-relaxed">
                Start collecting responses and use our analytics dashboard to gain insights from your data.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
