"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "./ui/button";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">About Me</h2>
            <p className="text-lg text-muted-foreground">
              I'm a passionate full-stack developer with over 5 years of experience
              building web applications and digital experiences that users love.
            </p>
            <p className="text-lg text-muted-foreground">
              My journey in web development started when I built my first website
              at the age of 16. Since then, I've been constantly learning and
              improving my skills to stay at the forefront of web technologies.
            </p>
            <p className="text-lg text-muted-foreground">
              I specialize in creating responsive, accessible, and performant web
              applications using modern frameworks and best practices. My goal is
              to deliver solutions that not only meet but exceed client expectations.
            </p>
            <div>
              <Button asChild>
                <a href="/resume.pdf" download>
                  <Download className="mr-2 h-4 w-4" /> Download Resume
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-muted rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3">Education</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Bachelor of Science in Computer Science</p>
                    <p className="text-muted-foreground">University of Technology, 2018</p>
                  </div>
                  <div>
                    <p className="font-medium">Full-Stack Web Development Bootcamp</p>
                    <p className="text-muted-foreground">Code Academy, 2019</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Experience</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Senior Frontend Developer</p>
                    <p className="text-muted-foreground">Tech Innovations Inc., 2021-Present</p>
                  </div>
                  <div>
                    <p className="font-medium">Full-Stack Developer</p>
                    <p className="text-muted-foreground">Digital Solutions Agency, 2019-2021</p>
                  </div>
                  <div>
                    <p className="font-medium">Web Developer Intern</p>
                    <p className="text-muted-foreground">StartUp Hub, 2018-2019</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;