<template>
    <div class="manage-tasks">
      <h2 class="text-2xl font-bold text-black">Manage Tasks</h2>
      <div class="flex justify-between mb-4">
        <button
          class="bg-green-500 text-white px-4 py-2 mt-3 rounded hover:bg-green-600"
        >
          Add Task
        </button>
      </div>
      <div class="bg-white rounded-lg shadow border overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-black border">ID</th>
              <th class="px-4 py-2 text-left text-black border">Task Name</th>
              <th class="px-4 py-2 text-left text-black border">Task Description</th>
              <th class="px-4 py-2 text-left text-black border">Role ID</th>
              <th class="px-4 py-2 text-left text-black border">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id" class="border-t">
              <td class="px-4 py-2 text-black border">{{ task.id }}</td>
              <td class="px-4 py-2 text-black border">
                <input
                  v-model="task.name"
                  class="border rounded px-2 py-1"
                  type="text"
                />
              </td>
              <td class="px-4 py-2 text-black border">
                <input
                  v-model="task.description"
                  class="border rounded px-2 py-1"
                  type="text"
                />
              </td>
              <td class="px-4 py-2 text-black border">
                <input
                  v-model.number="task.roleId"
                  class="border rounded px-2 py-1"
                  type="number"
                />
              </td>
              <td class="px-4 py-2 text-black border">
                <button
                  @click="updateTask(task)"
                  class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Save
                </button>
                <button
                  @click="deleteTask(task)"
                  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "ManageTasks",
    data() {
      return {
        tasks: [], // Dynamically loaded tasks
      };
    },
    methods: {
      async fetchTasks() {
        try {
          const response = await axios.get("http://localhost:3007/duties");
          this.tasks = response.data
            .filter(task => task.PartitionKey === "Duty")
            .map(task => ({
              id: task.RowKey,
              name: task.DutyName,
              description: task.DutyDescription,
              roleId: task.RoleId,
            }));
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      },
      async updateTask(task) {
        try {
          const updateUrl = `http://localhost:3007/duties/Duty/${task.id}`;
          const updatedTask = {
            PartitionKey: "Duty",
            RowKey: task.id,
            RoleId: task.roleId,
            DutyName: task.name,
            DutyDescription: task.description,
          };
          await axios.put(updateUrl, updatedTask);
          alert("Task updated successfully!");
        } catch (error) {
          console.error("Error updating task:", error);
          alert("Failed to update the task.");
        }
      },
      async deleteTask(task) {
        try {
          const deleteUrl = `http://localhost:3007/duties/Duty/${task.id}`;
          await axios.delete(deleteUrl);
          // Remove the task from the local array
          this.tasks = this.tasks.filter(t => t.id !== task.id);
          alert("Task deleted successfully!");
        } catch (error) {
          console.error("Error deleting task:", error);
          alert("Failed to delete the task.");
        }
      },
    },
    mounted() {
      this.fetchTasks();
    },
  };
  </script>
  