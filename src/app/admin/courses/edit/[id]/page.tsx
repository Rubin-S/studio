import { getCourseById } from "@/lib/courses";
import { notFound } from "next/navigation";
import { CourseForm } from "../../CourseForm";

type Props = {
  params: { id: string };
};

export default async function EditCoursePage({ params }: Props) {
  const course = await getCourseById(params.id);

  if (!course) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Edit Course</h1>
        <p className="text-muted-foreground">Update the details for '{course.title.en}'.</p>
      </div>
      <CourseForm course={course} />
    </div>
  );
}
