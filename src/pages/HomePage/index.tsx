import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Filter, List, PlusCircle, Star, ArrowLeft, ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 h-screen-5/6 flex flex-col justify-center">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to <span className='underline text-primary'>Kernaite's</span> To-Do List</h1>
        <p className="text-xl md:text-3xl text-muted-foreground">Organize, Prioritize, and Accomplish</p>
      </header>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <FeatureCard
          icon={<List className="h-8 w-8 text-primary" />}
          title="Task Management"
          description="Easily add, edit, and delete tasks. Mark them as completed when you're done."
        />
        <FeatureCard
          icon={<Clock className="h-8 w-8 text-primary" />}
          title="Task Deadlines"
          description="Set deadlines for your tasks to stay on top of your schedule."
        />
        <FeatureCard
          icon={<Star className="h-8 w-8 text-primary" />}
          title="Task Prioritization"
          description="Assign priorities to your tasks: low, medium, or high importance."
        />
        <FeatureCard
          icon={<Filter className="h-8 w-8 text-primary" />}
          title="Sorting and Filtering"
          description="Sort tasks by date, deadline, or status. Filter by category or completion."
        />
        <FeatureCard
          icon={<CheckCircle className="h-8 w-8 text-primary" />}
          title="Task Ownership"
          description="Your tasks are private and only visible to you after authentication."
        />
        <FeatureCard
          icon={<PlusCircle className="h-8 w-8 text-primary" />}
          title="Easy Task Creation"
          description="Quickly add new tasks with a title and description."
        />
      </section>

      {/* Arrow for md screens and above */}
      <motion.div 
        className="fixed bottom-4 left-64 z-50 hidden md:flex items-center gap-2"
        animate={{
          x: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ArrowLeft className="h-12 w-12 text-primary" />
        <span className="text-primary font-semibold text-xl">Enter Now!</span>
      </motion.div>

      {/* Mobile arrow pointing to sidebar button */}
      <motion.div 
        className="fixed top-12 left-3 z-50 md:hidden flex items-center"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ArrowUp className="h-8 w-8 text-primary" />
        <span className="text-primary font-semibold text-md">Open Sidebar</span>
      </motion.div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex items-center">
        <CardDescription className="text-lg md:text-xl">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}