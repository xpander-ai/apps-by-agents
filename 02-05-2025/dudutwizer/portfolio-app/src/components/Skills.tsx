'use client'

import { motion } from 'framer-motion'
import { 
  FiCode, 
  FiLayout, 
  FiDatabase, 
  FiServer, 
  FiTool, 
  FiGitBranch 
} from 'react-icons/fi'

const skillCategories = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    icon: <FiLayout className="text-3xl" />,
    skills: [
      { name: 'HTML5/CSS3', level: 90 },
      { name: 'JavaScript (ES6+)', level: 85 },
      { name: 'React.js', level: 80 },
      { name: 'Next.js', level: 75 },
      { name: 'TypeScript', level: 70 },
      { name: 'Tailwind CSS', level: 85 },
    ]
  },
  {
    id: 'backend',
    title: 'Backend Development',
    icon: <FiServer className="text-3xl" />,
    skills: [
      { name: 'Node.js', level: 75 },
      { name: 'Express.js', level: 70 },
      { name: 'Python', level: 65 },
      { name: 'RESTful APIs', level: 80 },
      { name: 'GraphQL', level: 60 },
    ]
  },
  {
    id: 'database',
    title: 'Database',
    icon: <FiDatabase className="text-3xl" />,
    skills: [
      { name: 'MongoDB', level: 75 },
      { name: 'PostgreSQL', level: 65 },
      { name: 'Firebase', level: 70 },
      { name: 'Redis', level: 50 },
    ]
  },
  {
    id: 'tools',
    title: 'Tools & Deployment',
    icon: <FiTool className="text-3xl" />,
    skills: [
      { name: 'Git/GitHub', level: 85 },
      { name: 'Docker', level: 60 },
      { name: 'AWS', level: 55 },
      { name: 'Vercel', level: 75 },
      { name: 'CI/CD', level: 65 },
    ]
  },
]

const Skills = () => {
  return (
    <section id="skills" className="section">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">Skills & Expertise</h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            My technical skills and areas of expertise in web development and design.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.id}
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 text-primary rounded-lg">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold">{category.title}</h3>
              </div>
              
              <div className="space-y-4">
                {category.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <motion.div 
                        className="bg-primary h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 p-8 bg-primary/5 rounded-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-bold mb-4 text-center">Additional Skills</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['Responsive Design', 'UI/UX Design', 'Agile Methodology', 'Testing', 'SEO', 'Performance Optimization', 'Accessibility', 'Cross-Browser Compatibility'].map((skill) => (
              <span key={skill} className="badge bg-white dark:bg-gray-800 shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills