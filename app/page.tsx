"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Code, Share2, BarChart3, Shield, Zap, ArrowRight, Play } from "lucide-react";
import Footer from "@/components/footer";
import ParallaxBackground from "@/components/parallax-background";
import ParallaxSection from "@/components/parallax-section";
import ScrollIndicator from "@/components/scroll-indicator";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Global parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  return (



    <div ref={containerRef} className="min-h-[calc(100vh-64px)]">
      {/* Scroll Progress Indicator */}
      <ScrollIndicator />
      
      {/* Global parallax background */}
      <motion.div 
        className="fixed h-screen inset-0 bg-gradient-to-br from-green-50/80 via-background to-green-100/80 dark:from-green-950/10 dark:via-background dark:to-green-950/10"
        style={{ y: backgroundY }}
      />

      {/* Global floating elements that persist throughout scroll */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-1/4 left-[10%] w-6 h-6 bg-green-400/30 dark:bg-green-300/20 rounded-full animate-parallax-float animation-delay-1000"
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, -300]),
            x: useTransform(scrollYProgress, [0, 1], [0, 100])
          }}
        />
        <motion.div
          className="absolute top-1/2 right-[15%] w-4 h-4 bg-blue-400/40 dark:bg-blue-300/30 rounded-full animate-gentle-sway animation-delay-3000"
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, -500]),
            x: useTransform(scrollYProgress, [0, 1], [0, -150])
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-[20%] w-8 h-8 bg-purple-400/25 dark:bg-purple-300/20 rounded-full animate-morph animation-delay-5000"
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, -400]),
            rotate: useTransform(scrollYProgress, [0, 1], [0, 720])
          }}
        />
        <motion.div
          className="absolute top-3/4 right-[25%] w-5 h-5 bg-pink-400/35 dark:bg-pink-300/25 rounded-full animate-parallax-drift animation-delay-2000"
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, -600]),
            x: useTransform(scrollYProgress, [0, 1], [0, 200])
          }}
        />
      </div>

      {/* Hero Section with Enhanced Parallax */}
      <ParallaxSection variant="hero" className="relative  h-[calc(100vh-64px)] flex flex-col items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-fit my-auto ">
          <motion.div 
            className="text-center"
            style={{ scale: heroScale }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              Build Multi-Step Forms
              <br />
              <span className="text-primary">Without Code</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed "
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            >
              Create sophisticated forms with conditional logic, export framework-ready code, or share
              instantly. All with our intuitive drag-and-drop builder.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            >
              <Button 
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Link href="/forms" className="flex items-center gap-2">
                  Start Building Forms
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary/10 px-8 py-4 rounded-full text-lg cursor-pointer font-medium transition-all duration-200"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Enhanced hero background with more elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {/* Large floating blobs with staggered animation delays */}
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-green-200 dark:bg-green-400/50 rounded-full mix-blend-multiply filter blur-sm opacity-20 animate-blob"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          <motion.div 
            className="absolute top-40 right-10 w-72 h-72 bg-blue-200 dark:bg-blue-400/50 rounded-full mix-blend-multiply filter blur-sm opacity-20 animate-blob animation-delay-2000"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 2, delay: 1 }}
          />
          <motion.div 
            className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 dark:bg-purple-400/50 rounded-full mix-blend-multiply filter blur-sm opacity-20 animate-blob animation-delay-4000"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 2, delay: 1.5 }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-72 h-72 bg-pink-200 dark:bg-pink-400/50 rounded-full mix-blend-multiply filter blur-sm opacity-20 animate-blob animation-delay-6000"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 2, delay: 2 }}
          />
          
        
        </div>
      </ParallaxSection>

      {/* Features Section with Parallax */}
      <ParallaxSection variant="features" className="py-24 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-semibold text-lg mb-4">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything You Need to Build Forms
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From simple contact forms to complex multi-step workflows, FormGen has
              you covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 grid-rows-2">
            {/* Multi-Step Forms */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className=""
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-green-50 to-card dark:from-green-950/20 dark:to-card backdrop-blur-sm h-full">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-card-foreground">Multi-Step Forms</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    Create complex workflows with conditional logic, branching paths, and dynamic field
                    validation.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            {/* Framework Export */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-card dark:from-blue-950/20 dark:to-card backdrop-blur-sm h-full">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-card-foreground">Framework Export</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    Export clean, production-ready code for React, Vue, Angular, or vanilla JavaScript.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            {/* Instant Sharing */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-card dark:from-purple-950/20 dark:to-card backdrop-blur-sm h-full">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
                    <Share2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-card-foreground">Instant Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    Share forms instantly with custom URLs. No hosting required - we handle everything for you.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            {/* Analytics Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-card dark:from-orange-950/20 dark:to-card backdrop-blur-sm h-full">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-card-foreground">Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    Track submissions, analyze user drop-off rates, and optimize your forms with detailed insights.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            {/* Smart Validation */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-red-50 to-card dark:from-red-950/20 dark:to-card backdrop-blur-sm h-full">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-card-foreground">Smart Validation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    Built-in validation rules, custom regex patterns, and real-time error handling.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            {/* Drag and Drop Builder */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-teal-50 to-card dark:from-teal-950/20 dark:to-card backdrop-blur-sm h-full">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-card-foreground">Drag and Drop Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    Intuitive visual builder with 20+ field types, themes, and customization options.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </ParallaxSection>

      {/* How It Works Section with Parallax */}
      <ParallaxSection variant="steps" className="py-24 bg-muted/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-semibold text-lg mb-4">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              From Idea to Form in 3 Steps
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our streamlined process gets you from concept to collecting responses
              in minutes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-3xl font-bold text-primary-foreground">1</span>
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Design Your Form</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use our drag-and-drop builder to create your form.
                Add fields, set up logic, and customize the design.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-3xl font-bold text-primary-foreground">2</span>
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Export or Share</h3>
              <p className="text-muted-foreground leading-relaxed">
                Export clean code for your framework of choice, or get a shareable link for immediate use.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-3xl font-bold text-primary-foreground">3</span>
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Collect & Analyze</h3>
              <p className="text-muted-foreground leading-relaxed">
                Start collecting responses and use our analytics dashboard to gain insights from your data.
              </p>
            </motion.div>
          </div>
        </div>
      </ParallaxSection>

      {/* Footer with smooth entrance */}
     <ParallaxSection variant="footer" className="">
        <Footer />
      </ParallaxSection>
    </div>
  );
}
