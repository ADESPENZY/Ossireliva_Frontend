import { Leaf, Youtube, Twitter, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export const Footer = () => {
  const socialLinks = [
    { icon: Youtube, label: "YouTube", href: "https://youtube.com/@Ossireliva" },
    { icon: Twitter, label: "X (Twitter)", href: "https://twitter.com/ossireliva" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com/ossireliva" },
    { icon: Facebook, label: "Facebook", href: "https://facebook.com/ossireliva" },
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-black border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center shadow-lg">
                <Leaf className="w-5 h-5 text-brand-foreground" />
              </div>
              <span className="font-heading text-2xl tracking-wide text-foreground">
                Ossireliva
              </span>
            </div>

            <p className="text-sm text-muted-foreground font-body">
              Nature&apos;s embrace, crafted for your well-being. Experience the
              harmony of premium aromatherapy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-foreground mb-4">
              Quick Links
            </h3>
            <nav className="space-y-2 text-sm font-body">
              <Link
                to="/"
                className="block text-muted-foreground hover:text-brand transition-colors"
              >
                Home
              </Link>
              <Link
                to="/product"
                className="block text-muted-foreground hover:text-brand transition-colors"
              >
                Product
              </Link>
              <Link
                to="/admin"
                className="block text-muted-foreground hover:text-brand transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-foreground mb-4">
              Contact
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground font-body">
              <p>Email: info@ossireliva.com</p>
              <p>Mon – Fri: 9AM – 6PM EST</p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-heading text-foreground mb-4">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center
                             bg-foreground/10 text-foreground/60
                             hover:bg-brand/20 hover:text-brand
                             transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-body">
          <p>&copy; 2024 Ossireliva. All rights reserved.</p>

          <div className="flex gap-6">
            <button className="hover:text-brand transition-colors">
              Privacy Policy
            </button>
            <button className="hover:text-brand transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
