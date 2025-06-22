import { CourseForm } from "../CourseForm";

export default function NewCoursePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Add New Course</h1>
        <p className="text-muted-foreground">Fill in the details below to create a new course.</p>
      </div>
      <CourseForm />
    </div>
  );
}
