import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Zap, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'contact@esylium.com', href: 'mailto:contact@esylium.com' },
    { icon: Phone, label: 'Phone', value: '+91 94562-24566 ', href: 'tel:+91 94562-24566 ' },
    { icon: MapPin, label: 'Address', value: 'Ghaziabad, UP', href: '#' }
  ];

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  const quickLinks = [
    'About Us', 'Features', 'Pricing', 'Support', 'Privacy Policy', 'Terms of Service'
  ];

  return (
    <footer className="relative bg-gradient-to-br from-dark-navy via-background to-dark-navy border-t border-white/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center animate-glow">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Esylium
                </h3>
                <p className="text-xs text-muted-foreground">Talent Discovery Platform</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Democratizing sports through AI-powered talent discovery. 
              Empowering athletes from rural to urban areas with cutting-edge analytics.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-foreground mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={link}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:underline decoration-primary/50"
                  >
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-foreground mb-6">Contact Us</h4>
            <div className="space-y-4">
              {contactInfo.map((contact, index) => (
                <motion.a
                  key={contact.label}
                  href={contact.href}
                  className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors duration-300 group"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-8 glass rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                    <contact.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{contact.label}</p>
                    <p className="text-xs">{contact.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-foreground mb-6">Stay Updated</h4>
            <p className="text-muted-foreground mb-4 text-sm">
              Get the latest updates on AI-powered sports analytics and talent discovery.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent border border-white/10 focus:border-primary/50 focus:outline-none transition-colors duration-300"
              />
              <Button className="w-full btn-hero text-sm py-3">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground text-sm flex items-center">
            © 2024 Esylium. Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> for athletes worldwide.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-300">
              Privacy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-300">
              Terms
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-300">
              Cookies
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
