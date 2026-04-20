import { useState, useEffect } from 'react';
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded-lg">
            <Building2 className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-blue-900">Payhaus</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          <a href="#demo" className="hover:text-blue-600 transition-colors">Demo</a>
          <a href="auth" className="hover:text-blue-600 transition-colors">Login</a>
          <a href="auth">
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Get Started Free
          </button>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-blue-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu - Simple CSS Transition */}
      <div className={`absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-4 md:hidden shadow-xl transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-600">Features</a>
        <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-600">Pricing</a>
        <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-600">Demo</a>
        <a href="#login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-600">Login</a>
        <button className="bg-blue-600 text-white w-full py-4 rounded-xl font-semibold">Get Started Free</button>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section className="pt-32 pb-20 px-6 relative overflow-hidden bg-blue-50/30">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-8 transition-all duration-700 transform translate-x-0 opacity-100">
        {/* <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full text-xs font-semibold text-blue-700 uppercase tracking-wider">
          <ShieldCheck className="w-3 h-3" />
          Trusted by 200+ Nigerian Landlords
        </div> */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-blue-950 font-display">
          Collect Rent.<br />
          Manage Tenants.<br />
          <span className="text-blue-400">Zero Stress.</span>
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
          TenantFlow helps Nigerian landlords track rent, send reminders, and manage properties from WhatsApp. No Excel. No fights. No lost rent.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group shadow-xl shadow-blue-200">
            Start Free — 5 Tenants
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto bg-white border border-blue-100 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Play className="text-white w-4 h-4 fill-current ml-0.5" />
            </div>
            Watch 1-Min Demo
          </button>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-blue-100">
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
            <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
              +20
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500">Joined by 20+ new landlords this week</p>
        </div>
      </div>

      <div className="relative group">
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-50">
          <div className="h-8 bg-blue-50/50 border-b border-blue-50 flex items-center px-4 gap-1.5">
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
        <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 flex items-center gap-4 border border-blue-50 max-w-xs z-20 animate-bounce-slow">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
            <MessageSquare className="text-white w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-gray-900 leading-tight">WhatsApp Reminder Sent</p>
            <p className="text-xs text-gray-500 truncate">To Tenant: Emeka John</p>
          </div>
        </div>
      </div>
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
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      title: "I'll Pay Tomorrow",
      desc: 'Exhausting back-and-forth calls with tenants who promise to pay but never do. No more chasing.'
    },
    {
      icon: ShieldCheck,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      title: 'No Records',
      desc: 'Disputes over who paid what and when. One-click receipts and digital history end the arguments.'
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
        <h2 className="text-4xl font-bold tracking-tight text-blue-950 font-display">Chasing Rent Every Month?</h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Manual management is costing you time, peace of mind, and thousands in lost revenue.
        </p>
      </div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {points.map((p, i) => (
          <div 
            key={i}
            className="p-8 bg-white border border-blue-50 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-4"
          >
            <div className={`w-12 h-12 ${p.bgColor} rounded-xl flex items-center justify-center`}>
              <p.icon className={`w-6 h-6 ${p.iconColor}`} />
            </div>
            <h3 className="text-xl font-bold text-blue-900">{p.title}</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              {p.desc}
            </p>
          </div>
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
    <section id="features" className="py-24 px-6 bg-blue-50/20">
      <div className="max-w-7xl mx-auto  gap-16 items-center">
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest bg-white border border-blue-100 px-3 py-1 rounded-md">Powerful Automation</span>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-blue-950 font-display">
              Payhaus Does The Chasing For You
            </h3>
            <p className="text-lg text-gray-500 leading-relaxed">
              We've built TenantFlow to handle the heavy lifting so you can focus on expanding your real estate portfolio.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {featurList.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm space-y-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-blue-900">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-snug">{f.desc}</p>
              </div>
            ))}
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
      title: 'Share unit code',
      desc: 'Send the unit code to your tenants, they log in, and we handle the rest - reminders, tracking, and receipts.'
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
        <h2 className="text-4xl font-bold tracking-tight text-blue-950 font-display">Live in 5 Minutes</h2>
        <p className="text-gray-500 text-lg">Setting up your empire shouldn't take all day.</p>
      </div>
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-blue-50 hidden md:block" />
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {steps.map((s, i) => (
            <div key={i} className="relative space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto z-10 relative">
                {s.num}
              </div>
              <h3 className="font-bold text-xl text-blue-900">{s.title}</h3>
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
      price: '1,000',
      yearlyPrice: '10,000',
      description: 'For first-time landlords',
      period: 'Up to 3 Houses',
      features: [
        'Auto WhatsApp Reminders',
        'Digital Receipts',
        'Basic Rent Tracking',
        'Community Support'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'LANDLORD',
      price: '3,500',
      yearlyPrice: '35,000',
      description: 'For serious landlords',
      period: 'Up to 15 Houses',
      features: [
        'Everything in Starter',
        'Expense Tracking',
        'Document Storage (Lease, ID)',
        'Maintenance Ticketing',
        'Priority WhatsApp Support'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'ESTATE',
      price: '15,000',
      yearlyPrice: '150,000',
      description: 'For estate managers & developers',
      period: 'Up to 100 Houses',
      features: [
        'Everything in Landlord',
        'Multi-Admin Access',
        'Custom Branding',
        'API Integrations',
        'Dedicated Account Manager'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'CUSTOM',
      price: 'Custom',
      description: 'For 100+ Houses',
      period: 'Tailored Solutions',
      features: [
        'Everything in Estate',
        'Custom pricing per house',
        'On-site training',
        'SLAs'
      ],
      cta: 'Talk to Sales',
      popular: false,
      isContact: true
    }
  ];

  return (
    <section id="pricing" className="py-24 px-6 bg-blue-50/30">
      <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
        <h2 className="text-4xl font-bold tracking-tight text-blue-950 font-display">
          14-Day Free Trial. No Card Needed.
        </h2>
        <p className="text-gray-500 text-lg">Simple, transparent pricing built for landlords of all sizes.</p>
      </div>

      <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p, i) => (
          <div 
            key={i} 
            className={`relative p-8 bg-white rounded-3xl border transition-all duration-300 ${
              p.popular ? 'border-blue-600 shadow-2xl scale-105 z-10' : 'border-blue-50 shadow-sm hover:shadow-md'
            } flex flex-col`}
          >
            {p.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold py-1 px-4 rounded-full uppercase tracking-widest">
                Most Popular
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-sm font-bold text-blue-400 tracking-widest uppercase">{p.name}</h3>
              
              <div className="mt-4 mb-2">
                {p.isContact ? (
                  <span className="text-3xl font-bold text-blue-900">Contact Us</span>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-blue-900">₦</span>
                      <span className="text-4xl font-bold tracking-tighter text-blue-900">{p.price}</span>
                      <span className="text-sm font-medium text-gray-400">/mo</span>
                    </div>
                    <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-tighter">
                      or ₦{p.yearlyPrice} / year
                    </p>
                  </div>
                )}
              </div>
              
              <p className="text-sm font-bold text-gray-800">{p.period}</p>
              <p className="text-xs font-medium text-gray-500 mt-1 italic">{p.description}</p>
            </div>

            <div className="space-y-4 flex-1 mb-8">
              {p.features.map((f, fi) => (
                <div key={fi} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium leading-tight">{f}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-4 rounded-xl font-bold transition-all ${
              p.popular 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100' 
                : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
            }`}>
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};


const FinalCTA = () => (
  <section className="py-24 px-6">
    <div className="max-w-5xl mx-auto bg-blue-600 rounded-[40px] p-12 md:p-24 text-center space-y-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 blur-2xl rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="space-y-6 relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight font-display">
          Stop Begging For Your Own Money
        </h2>
        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Join 200+ landlords using TenantFlow. First 5 tenants free forever. No credit card needed. Setup in 3 minutes.
        </p>
      </div>

      <div className="space-y-4 relative z-10">
        <button className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 active:scale-95 transition-transform shadow-2xl">
          Create Free Account
        </button>
        <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">
          No strings attached. No card required.
        </p>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white pt-24 pb-12 px-6 border-t border-blue-50">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded-lg">
            <Building2 className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-blue-900">Payhaus</span>
        </div>
        <p className="text-gray-500 text-sm max-w-xs leading-relaxed font-medium">
          Empowering Nigerian landlords with modern tools to manage properties and collect rent effortlessly via WhatsApp.
        </p>
      </div>
      
      <div className="space-y-6">
        <h4 className="font-bold text-sm tracking-widest uppercase text-blue-900">Product</h4>
        <ul className="space-y-4 text-sm font-medium text-gray-500">
          <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
          <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
          <li><a href="#" className="hover:text-blue-600 transition-colors">WhatsApp Bot</a></li>
        </ul>
      </div>

      <div className="space-y-6">
        <h4 className="font-bold text-sm tracking-widest uppercase text-blue-900">Company</h4>
        <ul className="space-y-4 text-sm font-medium text-gray-500">
          <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
          <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy</a></li>
        </ul>
      </div>

      <div className="space-y-6">
        <h4 className="font-bold text-sm tracking-widest uppercase text-blue-900">Support</h4>
        <ul className="space-y-4 text-sm font-medium text-gray-500">
          <li><a href="#" className="hover:text-blue-600 transition-colors">charlesmacanthony797@gmail.com</a></li>
          <li className="flex items-center gap-2 text-green-500 font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Systems Operational
          </li>
        </ul>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto pt-10 border-t border-blue-50 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
      <p>© 2026 Payhaus. All rights reserved.</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
        <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
      </div>
    </div>
  </footer>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-600 selection:text-white antialiased">
      <Navbar />
      <main>
        <Hero />
        <PainPoints />
        <Features />
        <HowItWorks />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
