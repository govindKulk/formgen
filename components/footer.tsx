import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border rounded-t-4xl shadow-xl mx-2 md:mx-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <Image
                src="/Logo.svg"
                alt="FormGen Logo"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Create sophisticated multi-step forms without code. Export framework-ready code or share instantly with our intuitive drag-and-drop builder.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <Link 
                href="https://github.com/govindKulk/formgen" 
                className="text-muted-foreground hover:text-green-600 transition-colors p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-950/20"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link 
                href="https://x.com/GovindK02338279" 
                className="text-muted-foreground hover:text-green-600 transition-colors p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-950/20"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link 
                href="https://www.linkedin.com/in/govind-kulkarni-44aa71228" 
                className="text-muted-foreground hover:text-green-600 transition-colors p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-950/20"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link 
                href="mailto:kulkarnigovind2003@gmail.com"  
                className="text-muted-foreground hover:text-green-600 transition-colors p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-950/20"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/forms" className="text-muted-foreground hover:text-green-600 text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-green-600 text-sm transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-green-600 text-sm transition-colors">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground hover:text-green-600 text-sm transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="https://github.com/govindKulk/formgen" className="text-muted-foreground hover:text-green-600 text-sm transition-colors">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="https://github.com/govindKulk/formgen" className="text-muted-foreground hover:text-green-600 text-sm transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-green-600 text-sm transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="https://govindkulkarni.me" className="text-muted-foreground hover:text-green-600 text-sm transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-green-600 text-sm transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-green-600 text-sm transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-green-600 text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-green-600 text-sm transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-green-600 text-sm transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-green-600 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-green-600 text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground mb-4 sm:mb-0">
              <span>© 2025 FormGen. Made with</span>
              <Heart className="w-4 h-4 text-red-500 mx-1 fill-current" />
              <span>for developers worldwide.</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link href="#" className="text-muted-foreground hover:text-green-600 transition-colors">
                Status
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-green-600 transition-colors">
                Changelog
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-muted-foreground">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
