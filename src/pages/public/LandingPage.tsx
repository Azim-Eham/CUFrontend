import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Users, BookOpen, Heart, ArrowRight, GraduationCap, MapPin, RefreshCw } from "lucide-react";
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
  },
  {
    icon: BookOpen,
    title: "Share Knowledge",
    description: "Post blogs, opportunities, and insights to help fellow students and alumni.",
  },
  {
    icon: Heart,
    title: "Build Community",
    description: "Join a thriving network of CU students and graduates supporting each other.",
  },
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
      <section className="bg-gradient-to-br from-primary-950 to-primary-800 py-20 text-white">
        <PageWrapper maxWidth="lg">
          <div className="flex flex-col items-center text-center">
            <GraduationCap className="mb-6 h-16 w-16 text-accent-500" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              CUPC
            </h1>
            <p className="mt-4 max-w-xl text-lg text-primary-200">
              Where CU Students &amp; Alumni Meet
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/mentors">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Browse Mentors
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="secondary" size="lg" className="bg-accent-500 hover:bg-accent-600">
                  Sign Up
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Features */}
      <section className="py-20">
        <PageWrapper maxWidth="lg">
          <h2 className="text-center text-3xl font-bold text-gray-900">Why CUPC?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-500">
            Everything you need to stay connected and grow together.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-950">
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{f.description}</p>
              </Card>
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* Mentor Spotlight */}
      <section className="bg-gray-50 py-20">
        <PageWrapper maxWidth="lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Mentor Spotlight</h2>
              <p className="mt-2 text-gray-500">Connect with alumni ready to mentor you.</p>
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
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mentors.map((m) => (
                <Card key={m._id} className="flex flex-col">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
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
                    <p className="mt-auto text-sm text-gray-600">{truncate(m.bio, 120)}</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </PageWrapper>
      </section>
    </div>
  );
}
