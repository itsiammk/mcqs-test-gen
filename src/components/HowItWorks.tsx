"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, Play, BarChart3, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Define Your Quiz",
    description: "Enter your subject, number of questions, difficulty, and any specific notes to generate a custom test.",
    icon: FileText,
  },
  {
    number: "02", 
    title: "Take the Test",
    description: "Engage with the AI-generated questions in a clean, timed test environment.",
    icon: Play,
  },
  {
    number: "03",
    title: "Analyze & Improve", 
    description: "Review your results with detailed explanations and AI-driven analysis to guide your future studies.",
    icon: BarChart3,
  }
];

const HowItWorks = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={containerRef} className="min-h-screen py-20 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(156 163 175 / 0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      <motion.div 
        className="container mx-auto px-4 relative z-10"
        style={{ y }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="px-4 py-2 bg-primary/10 dark:bg-primary/20 border border-primary/20 rounded-full text-primary font-medium text-sm">
              How it works
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-4 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Get Started in 3
            <br />
            <span className="text-primary">Simple Steps</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From setup to success in just a few clicks.
          </motion.p>
        </motion.div>

        {/* Flow Timeline */}
        <div className="max-w-5xl mx-auto relative">
          {/* Progressive connection line */}
          <div className="hidden lg:block absolute top-32 left-0 w-full h-0.5 bg-border" />
          
          {/* Animated progress line */}
          <motion.div
            className="hidden lg:block absolute top-32 left-0 h-0.5 bg-primary"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Steps Grid */}
          <div className="grid lg:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.2,
                  }}
                  className="relative group"
                >
                  {/* Step number indicator */}
                  <motion.div
                    className="relative z-20 w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="text-primary-foreground font-bold text-lg">
                      {step.number}
                    </span>
                    
                    {/* Completion indicator for previous steps */}
                    <motion.div
                      className="absolute inset-0 bg-green-500 rounded-full flex items-center justify-center opacity-0"
                      animate={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckCircle className="w-6 h-6 text-white" />
                    </motion.div>
                  </motion.div>

                  {/* Card */}
                  <motion.div 
                    className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-primary/50"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Icon */}
                    <motion.div
                      className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg mb-4"
                      whileHover={{ rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className="w-6 h-6 text-primary" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Progress indicator */}
                    <motion.div
                      className="w-full h-1 bg-muted rounded-full overflow-hidden"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.3 + 0.5 }}
                    >
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        transition={{ 
                          duration: 1, 
                          delay: index * 0.3 + 0.7,
                          ease: "easeOut"
                        }}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Arrow connector */}
                  {index < steps.length - 1 && (
                    <motion.div
                      className="hidden lg:flex absolute top-32 -right-4 w-8 h-8 items-center justify-center z-30"
                      initial={{ scale: 0, rotate: -90 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.2 + 0.3,
                        type: "spring"
                      }}
                    >
                      <div className="w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center shadow-sm">
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link href="/quiz/new">
          <motion.button
            className="group px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center">
              Start Creating Your Quiz
              <motion.div
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </span>
          </motion.button>
            </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;
