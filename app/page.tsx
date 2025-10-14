"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Users,
  Calendar,
  Award,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const programs = [
    {
      title: "Academic Excellence",
      description:
        "Comprehensive curriculum designed to foster critical thinking and academic achievement.",
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
    },
    {
      title: "Sports & Athletics",
      description:
        "Promoting physical fitness and teamwork through various sports programs.",
      icon: <Users className="h-8 w-8 text-primary" />,
    },
    {
      title: "Cultural Events",
      description:
        "Celebrating diversity and creativity through annual cultural festivals and events.",
      icon: <Calendar className="h-8 w-8 text-primary" />,
    },
    {
      title: "Student Recognition",
      description:
        "Honoring outstanding achievements and contributions to the school community.",
      icon: <Award className="h-8 w-8 text-primary" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 animate-pulse" />

        <motion.div
          className="container mx-auto px-6 text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="mb-8" variants={itemVariants}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6">
              <GraduationCap className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-poppins text-foreground mb-4">
              EduManage Pro
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-2">
              Excellence in Education
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering educators and students through innovative school
              management solutions
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href="/dashboard">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Go to Portal
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Programs Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-poppins text-foreground mb-4">
              Our Programs
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the comprehensive educational experience we offer
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {programs.map((program, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="group"
              >
                <Card className="h-full p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="text-center">
                    <div className="mb-4 flex justify-center">
                      {program.icon}
                    </div>
                    <h3 className="text-xl font-semibold font-poppins text-foreground mb-3">
                      {program.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {program.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 backdrop-blur-sm border-t border-border/50">
        <div className="container mx-auto px-6 py-12">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* School Info */}
            <div>
              <div className="flex items-center mb-4">
                <GraduationCap className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-2xl font-bold font-poppins text-foreground">
                  EduManage Pro
                </h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Leading the future of education through innovative management
                solutions.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold font-poppins text-foreground mb-4">
                Contact Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-3 text-primary" />
                  <span>123 Education Street, Learning City, LC 12345</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-5 w-5 mr-3 text-primary" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-5 w-5 mr-3 text-primary" />
                  <span>info@edumanagepro.edu</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold font-poppins text-foreground mb-4">
                Quick Links
              </h4>
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Staff Portal
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Student Portal
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Parent Portal
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Help & Support
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="border-t border-border/50 mt-8 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground">
              © 2024 EduManage Pro. All rights reserved. | Privacy Policy |
              Terms of Service
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
