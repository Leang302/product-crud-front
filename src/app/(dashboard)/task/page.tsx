import { getAllTasksAction } from "@/action/taskActions";
import TaskManagementClient from "./_components/TaskManagementClient";

export default async function TaskManagementPage() {
  const tasks = await getAllTasksAction();

  return <TaskManagementClient initialTasks={tasks} />;
}
