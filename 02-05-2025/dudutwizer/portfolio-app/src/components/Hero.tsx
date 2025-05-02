'use client'

import { motion } from 'framer-motion'
import { FiArrowRight, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi'
import Link from 'next/link'

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center pt-16 section">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-4 text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-primary">Creative</span> Developer & Designer
            </h1>
            <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
              I build exceptional digital experiences that inspire and engage users.
              Transforming ideas into elegant, functional solutions.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="#projects" className="btn btn-primary flex items-center gap-2">
                View My Work <FiArrowRight />
              </Link>
              <Link href="#contact" className="btn btn-outline">
                Get In Touch
              </Link>
            </div>
            
            <div className="mt-8 flex items-center gap-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                className="text-2xl hover:text-primary transition-colors" 
                aria-label="GitHub">
                <FiGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                className="text-2xl hover:text-primary transition-colors" 
                aria-label="LinkedIn">
                <FiLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="text-2xl hover:text-primary transition-colors" 
                aria-label="Twitter">
                <FiTwitter />
              </a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-full bg-gradient-to-br from-primary to-blue-400 opacity-20 absolute inset-0 blur-3xl"></div>
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-primary/80 to-blue-500/80 flex items-center justify-center text-white text-9xl font-bold">
                P
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold">Portfolio</h3>
                <p className="text-gray-600 dark:text-gray-400">Web Developer & Designer</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero