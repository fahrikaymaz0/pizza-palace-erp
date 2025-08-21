'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'Hakkımızda', href: '/about' },
      { name: 'Kariyer', href: '/careers' },
      { name: 'Franchise', href: '/franchise' },
      { name: 'Basın', href: '/press' },
    ],
    support: [
      { name: 'Yardım Merkezi', href: '/help' },
      { name: 'İletişim', href: '/contact' },
      { name: 'Geri Bildirim', href: '/feedback' },
      { name: 'SSS', href: '/faq' },
    ],
    legal: [
      { name: 'Gizlilik Politikası', href: '/privacy' },
      { name: 'Kullanım Şartları', href: '/terms' },
      { name: 'Çerez Politikası', href: '/cookies' },
      { name: 'KVKK', href: '/kvkk' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
  ];

  return (
         <footer className="bg-[#FFFBF5] text-[#333]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-red-500"
            >
              🍕 Pizza Palace
            </motion.div>
                         <p className="text-[#333]/80 leading-relaxed">
               Türkiye'nin en lezzetli pizzalarını sunuyoruz. Taze malzemeler, 
               özel tarifler ve mükemmel hizmet kalitesi.
             </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

                     {/* Company Links */}
           <div className="space-y-4">
             <h3 className="text-lg font-semibold">Şirket</h3>
             <ul className="space-y-2">
               {footerLinks.company.map((link) => (
                 <li key={link.name}>
                   <Link
                     href={link.href}
                     className="text-[#333]/80 hover:text-red-400 transition-colors"
                   >
                     {link.name}
                   </Link>
                 </li>
               ))}
             </ul>
           </div>

                     {/* Support Links */}
           <div className="space-y-4">
             <h3 className="text-lg font-semibold">Destek</h3>
             <ul className="space-y-2">
               {footerLinks.support.map((link) => (
                 <li key={link.name}>
                   <Link
                     href={link.href}
                     className="text-[#333]/80 hover:text-red-400 transition-colors"
                   >
                     {link.name}
                   </Link>
                 </li>
               ))}
             </ul>
           </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">İletişim</h3>
            <div className="space-y-3">
                             <div className="flex items-center space-x-3">
                 <Phone className="w-5 h-5 text-red-400" />
                 <span className="text-[#333]/80">0555 123 45 67</span>
               </div>
               <div className="flex items-center space-x-3">
                 <Mail className="w-5 h-5 text-red-400" />
                 <a href="mailto:pizzapalaceoffical00@gmail.com" className="text-[#333]/80 hover:text-red-400">
                   pizzapalaceoffical00@gmail.com
                 </a>
               </div>
               <div className="flex items-start space-x-3">
                 <MapPin className="w-5 h-5 text-red-400 mt-1" />
                 <span className="text-[#333]/80">
                   İstanbul, Türkiye<br />
                   Merkez Mahallesi, Pizza Caddesi No:1
                 </span>
               </div>
               <div className="flex items-center space-x-3">
                 <Clock className="w-5 h-5 text-red-400" />
                 <span className="text-[#333]/80">Her gün 10:00 - 23:00</span>
               </div>
            </div>
          </div>
        </div>

                 {/* Bottom Section */}
         <div className="border-t border-[#333]/20 mt-12 pt-8">
           <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
             <div className="text-[#333]/60 text-sm">
               © {currentYear} Pizza Palace. Tüm hakları saklıdır.
             </div>
             <div className="flex space-x-6">
               {footerLinks.legal.map((link) => (
                 <Link
                   key={link.name}
                   href={link.href}
                   className="text-[#333]/60 hover:text-red-400 text-sm transition-colors"
                 >
                   {link.name}
                 </Link>
               ))}
             </div>
           </div>
         </div>
      </div>
    </footer>
  );
}


