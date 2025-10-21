import { getAllDepartmentsAction } from "@/action/departmentActions";
import DepartmentScreen from "./_screens/DepartmentScreen";

export default async function DepartmentManagement() {
  const departments = await getAllDepartmentsAction();
  return <DepartmentScreen initialDepartments={departments} />;
}
