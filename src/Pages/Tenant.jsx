import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  MessageSquare, 
  Receipt, 
  LayoutDashboard, 
  TicketCheck, 
  ArrowRight, 
  Play, 
  Check, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Globe, 
 
  Zap,
  Menu,
  X
} from 'lucide-react';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black flex items-center justify-center rounded-lg">
            <Building2 className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">Payhaus</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
          <a href="#demo" className="hover:text-black transition-colors">Demo</a>
          <a href="#login" className="hover:text-black transition-colors">Login</a>
          <button className="bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-black/10">
            Get Started Free
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-4 md:hidden shadow-xl"
          >
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-600">Features</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-600">Pricing</a>
            <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-600">Demo</a>
            <a href="#login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-600">Login</a>
            <button className="bg-black text-white w-full py-4 rounded-xl font-semibold">Get Started Free</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section className="pt-32 pb-20 px-6 relative overflow-hidden">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-600 uppercase tracking-wider">
          <ShieldCheck className="w-3 h-3 text-green-600" />
          Trusted by 200+ Nigerian Landlords
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-gray-900 font-display">
          Collect Rent.<br />
          Manage Tenants.<br />
          <span className="text-gray-400">Zero Stress.</span>
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
          TenantFlow helps Nigerian landlords track rent, send reminders, and manage properties from WhatsApp. No Excel. No fights. No lost rent.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3 group">
            Start Free — 5 Tenants
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <Play className="text-white w-4 h-4 fill-current ml-0.5" />
            </div>
            Watch 1-Min Demo
          </button>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <img 
                key={i} 
                src={`https://picsum.photos/seed/user${i}/100/100`} 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                referrerPolicy="no-referrer"
              />
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
              +20
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500">Joined by 20+ new landlords this week</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="p-4 space-y-6">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-10 bg-gray-100 rounded-lg w-full" />
                <div className="h-32 bg-gray-50 rounded-lg w-full" />
              </div>
              <div className="w-1/3 space-y-2">
                <div className="h-20 bg-gray-50 rounded-lg w-full" />
                <div className="h-20 bg-gray-50 rounded-lg w-full" />
              </div>
            </div>
            <div className="h-24 bg-gray-50 rounded-lg w-full" />
          </div>
        </div>
        
        {/* WhatsApp Notification Overlay */}
        <motion.div 
          initial={{ opacity: 0, x: -20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 flex items-center gap-4 border border-gray-100 max-w-xs z-20"
        >
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
            <MessageSquare className="text-white w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-gray-900 leading-tight">WhatsApp Reminder Sent</p>
            <p className="text-xs text-gray-500 truncate">To Tenant: Emeka John</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const PainPoints = () => {
  const points = [
    {
      icon: AlertCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      title: 'Excel Wahala',
      desc: 'Formulas breaking, lost files, and hours spent updating manual spreadsheets that never balance.'
    },
    {
      icon: Clock,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50',
      title: "I'll Pay Tomorrow",
      desc: 'Exhausting back-and-forth calls with tenants who promise to pay but never do. No more chasing.'
    },
    {
      icon: ShieldCheck,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      title: 'No Records',
      desc: 'Disputes over who paid what and when. One-click receipts and digital history end the arguments.'
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
        <h2 className="text-4xl font-bold tracking-tight font-display">Chasing Rent Every Month?</h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Manual management is costing you time, peace of mind, and thousands in lost revenue.
        </p>
      </div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {points.map((p, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className={`w-12 h-12 ${p.bgColor} rounded-xl flex items-center justify-center`}>
              <p.icon className={`w-6 h-6 ${p.iconColor}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{p.title}</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              {p.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Features = () => {
  const featurList = [
    {
      icon: MessageSquare,
      title: 'Auto WhatsApp Reminders',
      desc: 'Friendly reminders sent automatically before rent is due.'
    },
    {
      icon: Receipt,
      title: 'One-Click Receipts',
      desc: 'Generate professional PDF receipts instantly after payment.'
    },
    {
      icon: LayoutDashboard,
      title: 'Tenant Dashboard',
      desc: 'Tenants can track their payment history and upcoming dues.'
    },
    {
      icon: TicketCheck,
      title: 'Complaint Ticketing',
      desc: 'Organized maintenance requests. No more midnight calls.'
    }
  ];

  return (
    <section id="features" className="py-24 px-6 bg-gray-50/50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-white border border-gray-100 px-3 py-1 rounded-md">Powerful Automation</span>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 font-display">
              Payhaus Does The Chasing For You
            </h3>
            <p className="text-lg text-gray-500 leading-relaxed">
              We've built TenantFlow to handle the heavy lifting so you can focus on expanding your real estate portfolio.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {featurList.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-gray-900" />
                </div>
                <h3 className="font-bold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-snug">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
          <img 
            src="https://picsum.photos/seed/office-woman/1200/1600" 
            alt="Woman using app" 
            className="w-full h-[600px] object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-20 h-20 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-black fill-current ml-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      num: '1',
      title: 'Add Property',
      desc: 'Upload your buildings, apartments, or shops with just a few taps.'
    },
    {
      num: '2',
      title: 'Add Tenants',
      desc: 'Import your tenant names and WhatsApp numbers. We\'ll handle the rest.'
    },
    {
      num: '3',
      title: 'Relax',
      desc: 'Monitor collections from your dashboard while we send reminders and receipts.'
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center space-y-4 mb-20">
        <h2 className="text-4xl font-bold tracking-tight font-display">Live in 5 Minutes</h2>
        <p className="text-gray-500 text-lg">Setting up your empire shouldn't take all day.</p>
      </div>
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-100 hidden md:block" />
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {steps.map((s, i) => (
            <div key={i} className="relative space-y-4">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto z-10 relative">
                {s.num}
              </div>
              <h3 className="font-bold text-xl">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed px-4">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const plans = [
    {
      name: 'STARTER',
      price: '0',
      period: 'Up to 5 Tenants',
      features: [
        'WhatsApp Reminders',
        'Basic Rent Tracking',
        'Digital Receipts',
        'Community Support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'LANDLORD',
      price: '3,000',
      period: 'Up to 50 Tenants',
      features: [
        'Everything in Starter',
        'Expense Management',
        'Document Storage',
        'Maintenance Ticketing',
        'Priority WhatsApp Support'
      ],
      cta: 'Start Free',
      popular: true
    },
    {
      name: 'ESTATE',
      price: '10,000',
      period: 'Unlimited Tenants',
      features: [
        'Everything in Landlord',
        'Multi-Admin Access',
        'Custom Branding',
        'API Integrations',
        'Dedicated Account Manager'
      ],
      cta: 'Get Started',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 px-6 bg-gray-50/50">
      <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
        <h2 className="text-4xl font-bold tracking-tight font-display">Free To Start. Pay When You Grow.</h2>
        <p className="text-gray-500 text-lg">Simple, transparent pricing built for landlords of all sizes.</p>
      </div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {plans.map((p, i) => (
          <div 
            key={i} 
            className={`relative p-10 bg-white rounded-3xl border ${p.popular ? 'border-black shadow-2xl scale-105 z-10' : 'border-gray-100 shadow-sm'} space-y-8 flex flex-col`}
          >
            {p.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold py-1 px-4 rounded-full uppercase tracking-widest">
                Most Popular
              </div>
            )}
            <div className="text-center space-y-2">
              <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase">{p.name}</h3>
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl font-bold">₦</span>
                <span className="text-5xl font-bold tracking-tighter">{p.price}</span>
              </div>
              <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase">/ month</p>
              <p className="text-sm font-medium text-gray-400 mt-2">{p.period}</p>
            </div>
            <div className="space-y-4 flex-1">
              {p.features.map((f, fi) => (
                <div key={fi} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-gray-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-gray-900" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{f}</span>
                </div>
              ))}
            </div>
            <button className={`w-full py-4 rounded-xl font-bold transition-all ${p.popular ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      text: "Since I started using TenantFlow for my properties in Port Harcourt, I no longer shout at anyone. The WhatsApp reminders are polite but firm. My rent collection is now 100% on time.",
      avatar: "https://picsum.photos/seed/owner1/100/100",
      name: "Mr. Emeka",
      role: "Landlord, Port Harcourt"
    },
    {
      text: "I manage 12 flats in Aba and used to carry a heavy notebook everywhere. Now everything is on my phone. The tenants even appreciate the professional receipts they get instantly.",
      avatar: "https://picsum.photos/seed/owner2/100/100",
      name: "Mrs. Boma",
      role: "Estate Manager, Aba"
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center space-y-4 mb-20">
        <h2 className="text-4xl font-bold tracking-tight">Built for Nigerian Landlords</h2>
      </div>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {reviews.map((r, i) => (
          <div key={i} className="p-10 bg-gray-50/50 rounded-3xl space-y-8 border border-gray-100 flex flex-col justify-between">
            <div className="space-y-6">
              <MessageSquare className="w-10 h-10 text-gray-200" />
              <p className="text-xl italic text-gray-700 leading-relaxed font-medium">"{r.text}"</p>
            </div>
            <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
              <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
              <div>
                <p className="font-bold text-gray-900">{r.name}</p>
                <p className="text-sm text-gray-500">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const FinalCTA = () => (
  <section className="py-24 px-6">
    <div className="max-w-5xl mx-auto bg-black rounded-[40px] p-12 md:p-24 text-center space-y-10 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 blur-2xl rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="space-y-6 relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight font-display">
          Stop Begging For Your Own Money
        </h2>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Join 200+ landlords using TenantFlow. First 5 tenants free forever. No credit card needed. Setup in 3 minutes.
        </p>
      </div>

      <div className="space-y-4 relative z-10">
        <button className="bg-white text-black px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 active:scale-95 transition-transform">
          Create Free Account
        </button>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          No strings attached. No card required.
        </p>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white pt-24 pb-12 px-6 border-t border-gray-100">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black flex items-center justify-center rounded-lg">
            <Building2 className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">Payhaus</span>
        </div>
        <p className="text-gray-500 text-sm max-w-xs leading-relaxed font-medium">
          Empowering Nigerian landlords with modern tools to manage properties and collect rent effortlessly via WhatsApp.
        </p>
        <div className="flex gap-4">
        
        </div>
      </div>
      
      <div className="space-y-6">
        <h4 className="font-bold text-sm tracking-widest uppercase">Product</h4>
        <ul className="space-y-4 text-sm font-medium text-gray-500">
          <li><a href="#" className="hover:text-black transition-colors">Features</a></li>
          <li><a href="#" className="hover:text-black transition-colors">Pricing</a></li>
          <li><a href="#" className="hover:text-black transition-colors">WhatsApp Bot</a></li>
          <li><a href="#" className="hover:text-black transition-colors">Demo Video</a></li>
        </ul>
      </div>

      <div className="space-y-6">
        <h4 className="font-bold text-sm tracking-widest uppercase">Company</h4>
        <ul className="space-y-4 text-sm font-medium text-gray-500">
          <li><a href="#" className="hover:text-black transition-colors">About Us</a></li>
          <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
          <li><a href="#" className="hover:text-black transition-colors">Careers</a></li>
          <li><a href="#" className="hover:text-black transition-colors">Privacy</a></li>
        </ul>
      </div>

      <div className="space-y-6">
        <h4 className="font-bold text-sm tracking-widest uppercase">Support</h4>
        <ul className="space-y-4 text-sm font-medium text-gray-500">
          <li><a href="#" className="hover:text-black transition-colors">charlesmacanthony797@gmail.com</a></li>
          <li><a href="#" className="hover:text-black transition-colors">+234 800 PAYHAUS</a></li>
          <li className="flex items-center gap-2 text-green-500 font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Systems Operational
          </li>
        </ul>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto pt-10 border-t border-gray-100 flex flex-col md:row items-center justify-between gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
      <p>© 2026 Payhaus. All rights reserved.</p>
      <p>Built with <span className="text-red-500 mx-1">❤️</span> by <span className="text-gray-900">Axell Studio</span></p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-black transition-colors">Terms</a>
        <a href="#" className="hover:text-black transition-colors">Privacy</a>
        <a href="#" className="hover:text-black transition-colors">Cookies</a>
      </div>
    </div>
  </footer>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-black selection:text-white antialiased">
      <Navbar />
      <main>
        <Hero />
        <PainPoints />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
