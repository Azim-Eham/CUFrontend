import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  Users, BookOpen, Heart, ArrowRight, GraduationCap, MapPin, 
  RefreshCw, Sparkles, Atom, Network, Lightbulb, Orbit, 
  ChevronRight, Calendar, Quote, Award 
} from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { alumniApi } from "@/api/alumni.api";
import { truncate } from "@/utils/formatters";
import type { Alumni } from "@/types/alumni.types";

const features = [
  {
    icon: Network,
    title: "Vast Alumni Network",
    description: "Connect with physics graduates thriving in academia, research, and industry worldwide.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Lightbulb,
    title: "Mentorship & Guidance",
    description: "Receive personalized career and academic advice from experienced professionals and seniors.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Atom,
    title: "Research Collaboration",
    description: "Collaborate on cutting-edge research, share ideas, and access academic resources.",
    gradient: "from-rose-500 to-pink-600",
  },
];

const stats = [
  { label: "Active Members", value: "500+" },
  { label: "Alumni Mentors", value: "50+" },
  { label: "Research Papers", value: "100+" },
  { label: "Events Hosted", value: "25+" },
];

const events = [
  {
    title: "Annual Physics Symposium",
    date: "November 15, 2026",
    type: "Conference",
    description: "Join leading physicists for a day of lectures and paper presentations.",
  },
  {
    title: "Career in Quantum Tech",
    date: "October 10, 2026",
    type: "Webinar",
    description: "Alumni panel discussing opportunities in quantum computing.",
  },
  {
    title: "Observatory Night",
    date: "September 28, 2026",
    type: "Meetup",
    description: "Stargazing and informal networking at the campus observatory.",
  }
];

const successStories = [
  {
    name: "Dr. Anika Rahman",
    role: "Postdoctoral Researcher at CERN",
    quote: "CUPC gave me the mentorship and resources I needed to pursue high-energy physics. The alumni network is incredibly supportive.",
  },
  {
    name: "Hasan Mahmud",
    role: "Data Scientist at Google",
    quote: "The analytical skills I honed through CUPC study groups directly translated into my career in tech.",
  }
];

export default function LandingPage() {
  const [mentors, setMentors] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchMentors = useCallback(async (retries = 2) => {
    setLoading(true);
    setError(false);
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await alumniApi.getMentors({ page: 1, limit: 6 });
        setMentors(res.data.data.result);
        setLoading(false);
        return;
      } catch {
        if (attempt === retries) {
          setError(true);
          setLoading(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  return (
    <div className="min-h-screen font-sans selection:bg-primary-500/20 selection:text-primary-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-animated py-24 text-white lg:py-36">
        {/* Subtle Physics Background / Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          {/* Abstract Nodes/Orbits */}
          <svg className="absolute w-[800px] h-[800px] -top-[400px] -right-[200px] animate-[spin_120s_linear_infinite]" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="400" r="399.5" stroke="currentColor" strokeOpacity="0.3" strokeDasharray="4 12"/>
            <circle cx="400" cy="400" r="299.5" stroke="currentColor" strokeOpacity="0.3"/>
            <circle cx="400" cy="400" r="199.5" stroke="currentColor" strokeOpacity="0.3" strokeDasharray="8 8"/>
          </svg>
          <svg className="absolute w-[600px] h-[600px] -bottom-[300px] -left-[100px] animate-[spin_90s_linear_infinite_reverse]" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="300" cy="300" r="299.5" stroke="currentColor" strokeOpacity="0.3" strokeDasharray="4 12"/>
            <circle cx="300" cy="300" r="199.5" stroke="currentColor" strokeOpacity="0.3"/>
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-primary-400/5 blur-[100px]" />
        </div>

        <PageWrapper maxWidth="lg">
          <div className="relative flex flex-col items-center text-center z-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full glass-dark px-5 py-2 text-sm font-medium text-primary-200">
              <Orbit className="h-4 w-4 text-accent-400 animate-[spin_10s_linear_infinite]" />
              <span>Department of Physics, University of Chittagong</span>
            </div>

            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-tight leading-tight max-w-4xl">
              <span className="block text-white">Chittagong University</span>
              <span className="block mt-2 bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500 bg-clip-text text-transparent">
                Physics Club
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-[clamp(1rem,2vw,1.125rem)] text-primary-100/90 leading-relaxed font-light">
              A lifelong community connecting students, alumni, and faculty. Fostering mentorship, research collaboration, and professional growth in the world of physics.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-accent-500 hover:bg-accent-400 text-primary-950 font-semibold shadow-lg shadow-accent-500/25 px-8 h-14 text-base rounded-xl transition-transform hover:scale-105 active:scale-95">
                  Join the Community
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/mentors" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm px-8 h-14 text-base rounded-xl transition-all">
                  Explore Mentors
                </Button>
              </Link>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Community Impact (Stats) */}
      <section className="border-b border-gray-200 bg-white relative z-10">
        <PageWrapper maxWidth="lg">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 py-12 md:grid-cols-4 md:py-16">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary-600 tracking-tight">{s.value}</div>
                <div className="mt-2 text-sm sm:text-base font-medium text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* About CUPC */}
      <section className="py-20 md:py-32 bg-surface">
        <PageWrapper maxWidth="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-primary-900 to-primary-800 shadow-2xl shadow-primary-900/20 group">
                {/* Abstract physics graphic as placeholder for an image */}
                <div className="absolute inset-0 opacity-30 flex items-center justify-center">
                  <Atom className="w-64 h-64 text-accent-400 group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 text-white">
                    <div className="h-12 w-12 rounded-full bg-accent-500 flex items-center justify-center shrink-0">
                      <GraduationCap className="h-6 w-6 text-primary-950" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg leading-tight">Established 2024</p>
                      <p className="text-primary-200 text-sm">University of Chittagong</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-800 uppercase tracking-wider mb-6">
                About Us
              </span>
              <h2 className="text-[clamp(2rem,3vw,2.5rem)] font-bold text-gray-900 leading-tight mb-6">
                Uniting the brilliant minds of CU Physics
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                The Chittagong University Physics Club (CUPC) is the premier platform dedicated to bridging the gap between current physics students, esteemed faculty, and our accomplished alumni network spread across the globe.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We believe in the power of shared knowledge. Whether you are seeking career guidance, looking for research collaborators, or simply wanting to connect with fellow physics enthusiasts, CUPC is your home.
              </p>
              <ul className="space-y-4">
                {[
                  "Global network of alumni",
                  "Exclusive mentorship programs",
                  "Access to research opportunities",
                  "Academic and career resources"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Why We Exist (Features) */}
      <section className="py-20 md:py-32 bg-white relative">
        <PageWrapper maxWidth="lg">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <h2 className="text-[clamp(2rem,3vw,2.5rem)] font-bold text-gray-900 leading-tight">
              Empowering your physics journey
            </h2>
            <p className="mt-6 text-lg text-gray-500 leading-relaxed">
              We provide the tools, network, and resources you need to excel in your academic pursuits and professional career.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} hover className="text-center group border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 p-8 rounded-2xl h-full flex flex-col items-center">
                <div className={`mx-auto mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}>
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed mt-auto">{f.description}</p>
              </Card>
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* Mentor Spotlight */}
      <section className="bg-surface py-20 md:py-32 border-y border-gray-200/60">
        <PageWrapper maxWidth="lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 uppercase tracking-wider mb-4">
                Mentorship
              </span>
              <h2 className="text-[clamp(2rem,3vw,2.5rem)] font-bold text-gray-900 leading-tight">
                Learn from those who paved the way
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Connect with distinguished alumni who are ready to offer their expertise and guidance.
              </p>
            </div>
            <Link to="/mentors" className="hidden md:block shrink-0">
              <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl h-12 px-6">
                View All Mentors <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><LoadingSpinner /></div>
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
              <p className="text-red-600 mb-4 font-medium">Failed to load mentors.</p>
              <Button variant="outline" className="gap-2 border-red-200 text-red-700 hover:bg-red-100" onClick={() => fetchMentors()}>
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
            </div>
          ) : mentors.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <p className="text-gray-500 text-lg">New mentors are joining soon. Stay tuned!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mentors.map((m) => (
                <Card key={m._id} hover className="flex flex-col border border-gray-100 shadow-lg shadow-gray-200/40 rounded-2xl p-6 group">
                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center shrink-0 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-lg font-bold text-white shadow-md group-hover:scale-105 transition-transform">
                      {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{m.name}</h3>
                      <p className="truncate text-sm font-medium text-gray-500">{m.department}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge variant="primary" className="bg-primary-50 text-primary-700 border-primary-100">{m.alumniProfile.alumniCategory}</Badge>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">Class of {m.graduationYear}</Badge>
                    {m.willingToMentor && <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100">Mentor</Badge>}
                  </div>

                  {m.location && (
                    <p className="mb-4 flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate">{m.location.city}, {m.location.country}</span>
                    </p>
                  )}

                  {m.bio && (
                    <p className="mt-auto text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {truncate(m.bio, 110)}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
          
          <div className="mt-8 md:hidden flex justify-center">
             <Link to="/mentors" className="w-full">
              <Button variant="outline" className="w-full justify-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl h-12">
                View All Mentors <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </PageWrapper>
      </section>

      {/* Events & Activities */}
      <section className="py-20 md:py-32 bg-white">
        <PageWrapper maxWidth="lg">
           <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800 uppercase tracking-wider mb-4">
              Happenings
            </span>
            <h2 className="text-[clamp(2rem,3vw,2.5rem)] font-bold text-gray-900 leading-tight">
              Upcoming Events
            </h2>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              Participate in seminars, workshops, and meetups organized by CUPC.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, idx) => (
               <Card key={idx} className="border border-gray-200 shadow-sm hover:shadow-xl hover:border-violet-200 transition-all duration-300 p-6 flex flex-col rounded-2xl h-full">
                  <div className="flex justify-between items-start mb-4">
                     <div className="p-3 bg-violet-50 text-violet-600 rounded-xl shrink-0">
                        <Calendar className="w-6 h-6" />
                     </div>
                     <Badge className="bg-gray-100 text-gray-700 shrink-0 ml-2">{event.type}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm font-semibold text-violet-600 mb-4">{event.date}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mt-auto">{event.description}</p>
               </Card>
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* Success Stories & Faculty Message */}
      <section className="py-20 md:py-32 bg-primary-950 text-white relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-600/10 rounded-full blur-[120px] pointer-events-none" />

        <PageWrapper maxWidth="lg">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 relative z-10">
            {/* Success Stories */}
            <div>
               <h2 className="text-[clamp(1.75rem,2.5vw,2.25rem)] font-bold mb-10 flex items-center gap-3">
                  <Award className="w-8 h-8 text-accent-400 shrink-0" />
                  Alumni Success
               </h2>
               <div className="space-y-6">
                  {successStories.map((story, idx) => (
                     <div key={idx} className="glass-dark rounded-2xl p-6 md:p-8 border border-white/10 relative">
                        <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5 pointer-events-none" />
                        <p className="text-primary-100 text-base leading-relaxed italic mb-6">
                          "{story.quote}"
                        </p>
                        <div>
                           <p className="font-bold text-white">{story.name}</p>
                           <p className="text-accent-300 text-sm font-medium">{story.role}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Faculty Message */}
            <div className="flex flex-col justify-center">
               <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md relative">
                  <div className="flex items-center gap-5 md:gap-6 mb-8">
                     <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary-800 border-2 border-accent-400 flex items-center justify-center overflow-hidden shrink-0">
                        <Users className="w-8 h-8 md:w-10 md:h-10 text-primary-300" />
                     </div>
                     <div>
                        <h3 className="text-lg md:text-xl font-bold text-white leading-tight">Prof. Name Surname</h3>
                        <p className="text-primary-300 font-medium text-sm md:text-base mt-1">Chairman, Dept. of Physics</p>
                     </div>
                  </div>
                  <Quote className="w-8 h-8 md:w-10 md:h-10 text-accent-400/50 mb-4" />
                  <p className="text-base md:text-lg text-primary-50 leading-relaxed font-light">
                    "The Physics Club serves as a vital bridge between our rigorous academic curriculum and the real-world applications of physics. I encourage all students to actively participate, connect with our brilliant alumni, and leverage this platform for their holistic development."
                  </p>
               </div>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden bg-primary-600 py-24">
        {/* Dynamic Abstract background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 Q25,25 50,50 T100,50 L100,100 L0,100 Z" fill="currentColor" className="text-primary-900" />
              <path d="M0,70 Q25,50 50,70 T100,70 L100,100 L0,100 Z" fill="currentColor" className="text-primary-800" />
           </svg>
        </div>

        <PageWrapper maxWidth="md">
          <div className="relative text-center z-10 glass-dark rounded-3xl p-8 md:p-16 border border-white/20 shadow-2xl mx-4 md:mx-0">
            <h2 className="text-[clamp(1.75rem,3vw,3rem)] font-bold text-white mb-6 leading-tight">
              Ready to accelerate your physics career?
            </h2>
            <p className="text-base md:text-lg text-primary-100 mb-10 leading-relaxed max-w-xl mx-auto">
              Join hundreds of students and alumni. Access exclusive mentorship, share opportunities, and build lifelong connections today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-accent-500 hover:bg-accent-400 text-primary-950 font-bold shadow-lg shadow-accent-500/25 h-14 px-8 rounded-xl text-base transition-transform hover:scale-105">
                  Create an Account
                </Button>
              </Link>
            </div>
          </div>
        </PageWrapper>
      </section>
    </div>
  );
}
