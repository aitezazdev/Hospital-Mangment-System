import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/auth";
import {
  Activity,
  Calendar,
  Heart,
  UserCheck,
  Clock,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
  Stethoscope,
  Shield,
  HelpCircle,
  FileText,
} from "lucide-react";

const Landing = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    if (token && user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (!user.hasProfile) {
        dispatch(logoutUser());
        navigate("/auth/signin");
      } else {
        navigate(`/${user.role}/dashboard`);
      }
    } else {
      navigate("/auth/signin");
    }
  };

  const departments = [
    {
      name: "Family Medicine",
      desc: "Comprehensive primary healthcare, routine screenings, and preventative treatment for patients of all ages.",
      icon: Stethoscope,
    },
    {
      name: "Cardiology Unit",
      desc: "Advanced diagnostics, blood pressure monitoring, and specialized treatment for cardiovascular health.",
      icon: Heart,
    },
    {
      name: "Pediatric Care",
      desc: "Caring and compassionate healthcare services dedicated to the physical and emotional growth of children.",
      icon: UserCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-600 selection:text-white">
      {}
      <Navbar />

      {}
      <section className="bg-white border-b border-zinc-200 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-zinc-200 text-xs font-semibold px-3.5 py-1 rounded-full">
            <Shield className="w-3.5 h-3.5 text-emerald-600" /> Fully Accredited Medical Facility
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Compassionate Care. <br />
            <span className="text-emerald-600">Advanced Medicine.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Welcome to HMS Clinical Hospital. We combine certified physicians, modern diagnostic tools, and a seamless scheduling portal to deliver high-quality, patient-centered healthcare services.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-base shadow-sm"
            >
              Book an Appointment <Calendar className="w-4.5 h-4.5" />
            </button>
            <a
              href="#departments"
              className="w-full sm:w-auto text-slate-600 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 font-semibold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center"
            >
              Explore Departments
            </a>
          </div>
        </div>
      </section>

      {}
      <section id="departments" className="py-16 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Our Medical Departments</h2>
            <p className="text-slate-500 text-sm mt-1.5">
              Providing specialized clinical care across a wide range of medical disciplines.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {departments.map((dept, index) => {
              const IconComp = dept.icon;
              return (
                <div key={index} className="bg-slate-50 border border-zinc-200 rounded-2xl p-6 space-y-3.5 shadow-sm">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                    <IconComp className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{dept.name}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {dept.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {}
      <section id="services" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Hospital Portal Login</h2>
            <p className="text-slate-500 text-sm mt-1.5">
              Access your medical records, check schedules, or verify applications by logging in below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between h-72 shadow-sm hover:shadow transition-shadow">
              <div className="space-y-3">
                <span className="text-xs font-bold text-emerald-600 uppercase">Patient Dashboard</span>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Register, browse available slots from verified clinical specialists, view appointment logs, and consult the AI Symptom Checker.
                </p>
              </div>
              <button
                onClick={handleGetStarted}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Access Patient Portal
              </button>
            </div>

            {}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between h-72 shadow-sm hover:shadow transition-shadow">
              <div className="space-y-3">
                <span className="text-xs font-bold text-emerald-600 uppercase">Physician Portal</span>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Log in to set weekly clinical hours, review patient medical histories, manage appointment schedules, and generate AI Summaries.
                </p>
              </div>
              <button
                onClick={handleGetStarted}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Access Physician Terminal
              </button>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-white border-t border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Patient FAQ & Information</h2>
            <p className="text-slate-500 text-sm mt-1.5">Common queries regarding our medical services and patient booking portal.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-5 border border-zinc-200 flex gap-4">
              <HelpCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">How do I book an appointment with a specialist?</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  To reserve a time slot, click "Book Appointment" in the header to register as a patient. Once logged in, select "Find Doctors" to browse verified clinical personnel, view their live availability, and reserve your visit.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-zinc-200 flex gap-4">
              <HelpCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">What is the purpose of the AI Symptom Checker?</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  The built-in AI symptom checker provides immediate, educational suggestions based on the symptoms you describe. It outlines potential reasons and suggests which doctor specialty is best suited for your concern. Note that it is only an educational tool, not a professional medical diagnosis.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-zinc-200 flex gap-4">
              <HelpCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">How are doctor licenses verified?</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  All registering physicians must submit their clinic address, experience details, and specialization for review. They are placed in a pending queue and cannot consult or appear in patient searches until approved manually by our hospital administration team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <footer id="about" className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 border-b border-zinc-800 pb-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="3" width="4" height="8" rx="2" className="fill-teal-400" />
                <rect x="4" y="13" width="4" height="8" rx="2" className="fill-emerald-400" />
                <rect x="6" y="10" width="12" height="4" rx="2" className="fill-teal-300" />
                <rect x="16" y="3" width="4" height="8" rx="2" className="fill-teal-200" />
                <rect x="16" y="13" width="4" height="8" rx="2" className="fill-emerald-300" />
              </svg>
              <span className="text-lg font-bold">HMS</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              HMS Clinical Hospital provides round-the-clock primary care and specialty medical consultations. Our integrated platform enables smooth scheduling and patient management.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Clinical Hours & Contact</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-emerald-500" /> Outpatient Clinics: Mon - Sun (8am - 8pm)</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-500" /> Helpline: +92-3070888643</div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Accreditation Statement</h4>
            <p className="text-xs leading-relaxed text-slate-500">
              Registered clinical platform complying with standard medical administration policies and patient security directives.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} HMS Clinical Hospital. All rights reserved.</p>
          <div className="flex space-x-4">
            <span>HIPAA Guidelines</span>
            <span>Clinical Statement</span>
            <span>Terms & Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
