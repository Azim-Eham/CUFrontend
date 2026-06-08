import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pencil, GraduationCap, Briefcase, Award, Globe, BookOpen } from "lucide-react";
import { alumniApi } from "@/api/alumni.api";
import type { Alumni } from "@/types/alumni.types";
import PageWrapper from "@/components/layout/PageWrapper";
import ProfileHeader from "@/components/profiles/ProfileHeader";
import InfoSection from "@/components/profiles/InfoSection";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";

const CAREER_LABELS: Record<string, string> = {
  corporate: "Corporate",
  research: "Research",
  academia: "Academia",
  administration: "Administration",
  business: "Business",
  other: "Other",
};

export default function AlumniProfile() {
  const [alumni, setAlumni] = useState<Alumni | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const toggleMentorshipStatus = async () => {
    if (!alumni) return;
    setToggling(true);
    const newStatus = !alumni.willingToMentor;
    try {
      await alumniApi.updateMe({ willingToMentor: newStatus });
      setAlumni({ ...alumni, willingToMentor: newStatus });
      toast.success(newStatus ? "You are now willing to mentor students!" : "Mentorship status disabled.");
    } catch {
      toast.error("Failed to update mentorship status.");
    } finally {
      setToggling(false);
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await alumniApi.getMe();
        setAlumni(res.data.data);
      } catch {
        setAlumni(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </PageWrapper>
    );
  }

  if (!alumni) {
    return (
      <PageWrapper>
        <LoadingSpinner />
      </PageWrapper>
    );
  }

  const location =
    alumni.location?.country && alumni.location?.city
      ? `${alumni.location.city}, ${alumni.location.country}`
      : undefined;

  const careerInfo = alumni.alumniProfile;

  const hasCareerInfo =
    (careerInfo.corporateInfo?.length ?? 0) > 0 ||
    (careerInfo.researchInfo?.length ?? 0) > 0 ||
    (careerInfo.academiaInfo?.length ?? 0) > 0 ||
    (careerInfo.administrationInfo?.length ?? 0) > 0 ||
    (careerInfo.businessInfo?.length ?? 0) > 0 ||
    (careerInfo.otherInfo?.length ?? 0) > 0;

  return (
    <PageWrapper>
      <div className="space-y-6">
        <ProfileHeader
          name={alumni.name}
          role="alumni"
          subtitle={`${alumni.department} · ${alumni.session} · Class of ${alumni.graduationYear}`}
          bio={alumni.bio}
          location={location}
          email={
            typeof alumni.userId === "object" ? alumni.userId.email : undefined
          }
          session={alumni.session}
          actions={
            <Link to="/alumni/profile/edit">
              <Button variant="outline">
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
          }
        />

        {/* Mentorship Status Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between transition-all duration-300">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Mentorship Availability</h3>
            <p className="text-xs text-gray-500 mt-1">
              {alumni.willingToMentor
                ? "Students can see you in the mentors list and send mentorship request messages."
                : "You are currently hidden from the mentors directory."}
            </p>
          </div>
          <button
            onClick={toggleMentorshipStatus}
            disabled={toggling}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              alumni.willingToMentor ? "bg-green-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                alumni.willingToMentor ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <InfoSection title="Academic Info">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Session</p>
              <p className="text-sm font-medium text-gray-900">{alumni.session}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="text-sm font-medium text-gray-900">{alumni.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Faculty</p>
              <p className="text-sm font-medium text-gray-900">{alumni.faculty}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Graduation Year</p>
              <p className="text-sm font-medium text-gray-900">{alumni.graduationYear}</p>
            </div>
          </div>
        </InfoSection>

        {hasCareerInfo && (
          <InfoSection title="Career">
            <div className="space-y-6">
              {careerInfo.corporateInfo?.length ? (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Briefcase className="h-4 w-4" /> {CAREER_LABELS.corporate}
                  </h3>
                  <div className="space-y-3">
                    {careerInfo.corporateInfo.map((entry, i) => (
                      <div key={i} className="rounded-lg border border-gray-100 p-3">
                        <p className="text-sm font-medium text-gray-900">
                          {entry.designation} at {entry.company}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {entry.startDate} – {entry.currentlyWorking ? "Present" : entry.endDate || "N/A"}
                        </p>
                        {entry.description && (
                          <p className="mt-1 text-sm text-gray-600">{entry.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {careerInfo.researchInfo?.length ? (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <GraduationCap className="h-4 w-4" /> {CAREER_LABELS.research}
                  </h3>
                  <div className="space-y-3">
                    {careerInfo.researchInfo.map((entry, i) => (
                      <div key={i} className="rounded-lg border border-gray-100 p-3">
                        <p className="text-sm font-medium text-gray-900">
                          {entry.designation} at {entry.institution}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {entry.startDate} – {entry.currentlyWorking ? "Present" : entry.endDate || "N/A"}
                        </p>
                        {entry.researchArea?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {entry.researchArea.map((area) => (
                              <Badge key={area} variant="info">{area}</Badge>
                            ))}
                          </div>
                        )}
                        {entry.description && (
                          <p className="mt-1 text-sm text-gray-600">{entry.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {careerInfo.academiaInfo?.length ? (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <BookOpen className="h-4 w-4" /> {CAREER_LABELS.academia}
                  </h3>
                  <div className="space-y-3">
                    {careerInfo.academiaInfo.map((entry, i) => (
                      <div key={i} className="rounded-lg border border-gray-100 p-3">
                        <p className="text-sm font-medium text-gray-900">
                          {entry.designation} — {entry.department}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {entry.institution} · {entry.startDate} – {entry.currentlyWorking ? "Present" : entry.endDate || "N/A"}
                        </p>
                        {entry.description && (
                          <p className="mt-1 text-sm text-gray-600">{entry.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {careerInfo.administrationInfo?.length ? (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Briefcase className="h-4 w-4" /> {CAREER_LABELS.administration}
                  </h3>
                  <div className="space-y-3">
                    {careerInfo.administrationInfo.map((entry, i) => (
                      <div key={i} className="rounded-lg border border-gray-100 p-3">
                        <p className="text-sm font-medium text-gray-900">
                          {entry.designation} at {entry.organization}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {entry.startDate} – {entry.currentlyWorking ? "Present" : entry.endDate || "N/A"}
                        </p>
                        {entry.description && (
                          <p className="mt-1 text-sm text-gray-600">{entry.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {careerInfo.businessInfo?.length ? (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Briefcase className="h-4 w-4" /> {CAREER_LABELS.business}
                  </h3>
                  <div className="space-y-3">
                    {careerInfo.businessInfo.map((entry, i) => (
                      <div key={i} className="rounded-lg border border-gray-100 p-3">
                        <p className="text-sm font-medium text-gray-900">
                          {entry.designation} — {entry.businessName}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {entry.startDate} – {entry.currentlyWorking ? "Present" : entry.endDate || "N/A"}
                          {entry.location && ` · ${entry.location}`}
                        </p>
                        {entry.description && (
                          <p className="mt-1 text-sm text-gray-600">{entry.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {careerInfo.otherInfo?.length ? (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Briefcase className="h-4 w-4" /> {CAREER_LABELS.other}
                  </h3>
                  <div className="space-y-3">
                    {careerInfo.otherInfo.map((entry, i) => (
                      <div key={i} className="rounded-lg border border-gray-100 p-3">
                        <p className="text-sm font-medium text-gray-900">
                          {entry.title}
                          {entry.designation && ` — ${entry.designation}`}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {entry.startDate} – {entry.currentlyWorking ? "Present" : entry.endDate || "N/A"}
                          {entry.location && ` · ${entry.location}`}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">{entry.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </InfoSection>
        )}

        {alumni.achievements?.length ? (
          <InfoSection title="Skills & Achievements">
            <div className="space-y-3">
              {alumni.achievements.map((achievement, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Award className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {achievement.title} ({achievement.year})
                    </p>
                    {achievement.description && (
                      <p className="mt-0.5 text-sm text-gray-600">{achievement.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </InfoSection>
        ) : null}

        {alumni.onlinePresence?.length ? (
          <InfoSection title="Social Media">
            <div className="space-y-2">
              {alumni.onlinePresence.map((link, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 capitalize">{link.platform}</span>
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700 truncate"
                  >
                    {link.link}
                  </a>
                </div>
              ))}
            </div>
          </InfoSection>
        ) : null}

        <InfoSection title="Mentorship">
          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                alumni.willingToMentor ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <p className="text-sm text-gray-700">
              {alumni.willingToMentor
                ? "Available for mentorship"
                : "Not currently available for mentorship"}
            </p>
          </div>
        </InfoSection>
      </div>
    </PageWrapper>
  );
}
