import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pencil, ExternalLink } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { studentApi } from "@/api/student.api";
import type { Student } from "@/types/student.types";
import PageWrapper from "@/components/layout/PageWrapper";
import ProfileHeader from "@/components/profiles/ProfileHeader";
import InfoSection from "@/components/profiles/InfoSection";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

export default function StudentProfile() {
  const { user } = useAuthStore();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    studentApi
      .getById(user.id)
      .then((res) => setStudent(res.data.data))
      .catch(() => setStudent(null))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="space-y-6">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </PageWrapper>
    );
  }

  if (!student) {
    return (
      <PageWrapper>
        <p className="text-center text-gray-500 py-16">Profile not found.</p>
      </PageWrapper>
    );
  }

  const subtitle = [student.department, student.session].filter(Boolean).join(" · ");

  return (
    <PageWrapper>
      <div className="space-y-6">
        <ProfileHeader
          name={student.name}
          role="student"
          subtitle={subtitle}
          bio={student.bio}
          email={user?.email}
          session={student.session}
          avatarUrl={student.profileImage}
          actions={
            <Link to="/student/profile/edit">
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
          }
        />

        <InfoSection title="Academic Info">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500">Program</p>
              <p className="text-sm font-medium text-gray-900">{student.studyInfo.currentProgram}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Current Year</p>
              <p className="text-sm font-medium text-gray-900">{student.studyInfo.currentYear}</p>
            </div>
            {student.studyInfo.semester != null && (
              <div>
                <p className="text-xs text-gray-500">Semester</p>
                <p className="text-sm font-medium text-gray-900">{student.studyInfo.semester}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Department</p>
              <p className="text-sm font-medium text-gray-900">{student.department}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Faculty</p>
              <p className="text-sm font-medium text-gray-900">{student.faculty}</p>
            </div>
          </div>
        </InfoSection>

        {student.skills.length > 0 && (
          <InfoSection title="Skills">
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </InfoSection>
        )}

        {student.interests.length > 0 && (
          <InfoSection title="Interests">
            <div className="flex flex-wrap gap-2">
              {student.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700"
                >
                  {interest}
                </span>
              ))}
            </div>
          </InfoSection>
        )}

        {student.achievements.length > 0 && (
          <InfoSection title="Achievements">
            <div className="space-y-3">
              {student.achievements.map((achievement, i) => (
                <div key={i} className="border-l-2 border-primary-300 pl-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                    <span className="shrink-0 text-xs text-gray-400">{achievement.year}</span>
                  </div>
                  {achievement.description && (
                    <p className="mt-0.5 text-sm text-gray-500">{achievement.description}</p>
                  )}
                </div>
              ))}
            </div>
          </InfoSection>
        )}

        {student.socialMedia.length > 0 && (
          <InfoSection title="Social Media">
            <div className="space-y-2">
              {student.socialMedia.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="capitalize">{item.platform}</span>
                </a>
              ))}
            </div>
          </InfoSection>
        )}
      </div>
    </PageWrapper>
  );
}
