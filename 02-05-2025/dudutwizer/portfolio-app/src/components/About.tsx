'use client'

import { motion } from 'framer-motion'
import { FiDownload, FiCalendar, FiMapPin, FiMail } from 'react-icons/fi'

const About = () => {
  return (
    <section id="about" className="section bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">About Me</h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            Get to know more about my background, experience, and what drives me as a developer.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary to-blue-400 opacity-20 absolute inset-0 blur-3xl"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="w-full aspect-square rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                  Profile Image Placeholder
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <FiCalendar className="text-primary" />
                    <span>5+ Years of Experience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMapPin className="text-primary" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMail className="text-primary" />
                    <span>contact@example.com</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <a 
                    href="#" 
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <FiDownload /> Download Resume
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-4">Hi, I'm John Doe</h3>
            <h4 className="text-xl text-primary mb-6">Full Stack Web Developer</h4>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                I'm a passionate web developer with over 5 years of experience creating modern, 
                responsive websites and applications. I specialize in building exceptional digital 
                experiences that combine beautiful design with clean, efficient code.
              </p>
              <p>
                My journey in web development began when I built my first website in college. 
                Since then, I've worked with various technologies and frameworks, always staying 
                up-to-date with the latest industry trends and best practices.
              </p>
              <p>
                I believe in creating solutions that not only look great but also perform well 
                and provide real value to users. Whether it's a simple landing page or a complex 
                web application, I approach each project with the same level of dedication and attention 
                to detail.
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h5 className="font-bold text-4xl text-primary mb-1">50+</h5>
                <p className="text-gray-600 dark:text-gray-400">Projects Completed</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h5 className="font-bold text-4xl text-primary mb-1">30+</h5>
                <p className="text-gray-600 dark:text-gray-400">Happy Clients</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About