import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Users, BookOpen, Heart, ArrowRight, GraduationCap, MapPin, RefreshCw, Sparkles } from "lucide-react";
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
    icon: Users,
    title: "Find Mentors",
    description: "Connect with experienced alumni who can guide your career and academic journey.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: BookOpen,
    title: "Share Knowledge",
    description: "Post blogs, opportunities, and insights to help fellow students and alumni.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Heart,
    title: "Build Community",
    description: "Join a thriving network of CU students and graduates supporting each other.",
    gradient: "from-rose-500 to-pink-600",
  },
];

const stats = [
  { label: "Active Members", value: "500+" },
  { label: "Mentors Available", value: "50+" },
  { label: "Posts Shared", value: "1K+" },
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-animated py-24 text-white lg:py-32">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary-400/5 blur-3xl" />
        </div>

        <PageWrapper maxWidth="lg">
          <div className="relative flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full glass-dark px-4 py-2 text-sm text-primary-200">
              <Sparkles className="h-4 w-4 text-accent-400" />
              <span>Connecting CU community since 2024</span>
            </div>

            <div className="mb-6 float">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
                <GraduationCap className="h-10 w-10 text-accent-400" />
              </div>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
              <span className="block">CU Platform for</span>
              <span className="block mt-1 bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500 bg-clip-text text-transparent">
                Connection
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-primary-200/90 leading-relaxed">
              Where Chittagong University students and alumni meet, mentor, and grow together.
              Build lasting connections that shape your future.
            </p>

            {/* Stats row */}
            <div className="mt-8 flex items-center gap-8 text-sm">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-primary-300/70">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/mentors">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm"
                >
                  Browse Mentors
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="secondary" size="lg" className="bg-accent-500 hover:bg-accent-400 text-primary-950 font-semibold shadow-lg shadow-accent-500/25">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <PageWrapper maxWidth="lg">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              Why CUPC
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to thrive
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Stay connected, grow together, and unlock opportunities within the CU community.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} hover className="text-center group">
                <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </Card>
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* Mentor Spotlight */}
      <section className="bg-surface py-24">
        <PageWrapper maxWidth="lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                Mentor Spotlight
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                Connect with alumni mentors
              </h2>
              <p className="mt-2 text-gray-500">Ready to guide your career and academic journey.</p>
            </div>
            <Link to="/mentors">
              <Button variant="ghost" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="mt-8 text-center">
              <p className="text-gray-500">Failed to load mentors.</p>
              <Button
                variant="ghost"
                className="mt-2 gap-1"
                onClick={() => fetchMentors()}
              >
                <RefreshCw className="h-4 w-4" /> Try again
              </Button>
            </div>
          ) : mentors.length === 0 ? (
            <p className="mt-8 text-center text-gray-500">No mentors available yet.</p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mentors.map((m) => (
                <Card key={m._id} hover className="flex flex-col">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-semibold text-white shadow-sm">
                      {m.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-900">{m.name}</h3>
                      <p className="text-xs text-gray-500">{m.department}</p>
                    </div>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge variant="primary">{m.alumniProfile.alumniCategory}</Badge>
                    <Badge>Class of {m.graduationYear}</Badge>
                    {m.willingToMentor && <Badge variant="success">Mentor</Badge>}
                  </div>
                  {m.location && (
                    <p className="mb-2 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {m.location.city}, {m.location.country}
                    </p>
                  )}
                  {m.bio && (
                    <p className="mt-auto text-sm text-gray-600 leading-relaxed">{truncate(m.bio, 120)}</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </PageWrapper>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-primary-950 py-20">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />
        </div>
        <PageWrapper maxWidth="lg">
          <div className="relative text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to join the community?
            </h2>
            <p className="mt-4 text-lg text-primary-200/80">
              Create your account and start connecting with CU students and alumni today.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/signup">
                <Button variant="secondary" size="lg" className="bg-accent-500 hover:bg-accent-400 text-primary-950 font-semibold shadow-lg shadow-accent-500/25">
                  Sign Up Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </PageWrapper>
      </section>
    </div>
  );
}
