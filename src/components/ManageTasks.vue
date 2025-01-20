<template>
    <div class="manage-tasks">
        <h2 class="text-2xl font-bold text-black">Manage Tasks</h2>
        <div class="flex justify-between mb-4">
            <button @click="openModal('add')" class="bg-green-500 text-white px-4 py-2 mt-3 rounded hover:bg-green-600">
                Add Task
            </button>
            <input v-model="searchEvent" type="text" placeholder="Search shifts"
                class="p-2 border rounded text-black" />
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
                        <td class="px-4 py-2 text-black border">{{ task.name }}</td>
                        <td class="px-4 py-2 text-black border">{{ task.description }}</td>
                        <td class="px-4 py-2 text-black border">{{ task.roleId }}</td>
                        <td class="px-4 py-2 text-black border">
                            <button @click="openModal('edit', task)"
                                class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2">
                                Edit
                            </button>
                            <button @click="deleteTask(task)"
                                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal for Adding/Editing Task -->
        <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
            <div class="bg-white p-6 rounded-lg w-1/3">
                <h3 class="text-xl text-violet-700 font-bold mb-4">{{ isEdit ? 'Edit Task' : 'Add Task' }}</h3>
                <form @submit.prevent="handleSubmit">
                    <div class="mb-4">
                        <label for="taskName" class="block text-gray-700">Task Name</label>
                        <input id="taskName" v-model="taskForm.name"
                            class="w-full p-2 border rounded bg-white text-gray-900 dark:bg-white dark:text-gray-900"
                            type="text" required />
                    </div>
                    <div class="mb-4">
                        <label for="taskDescription" class="block text-gray-700">Task Description</label>
                        <input id="taskDescription" v-model="taskForm.description"
                            class="w-full p-2 border rounded bg-white text-gray-900 dark:bg-white dark:text-gray-900"
                            type="text" required />
                    </div>
                    <div class="mb-4">
                        <label for="roleId" class="block text-gray-700">Role ID</label>
                        <input id="roleId" v-model.number="taskForm.roleId"
                            class="w-full p-2 border rounded bg-white text-gray-900 dark:bg-white dark:text-gray-900"
                            type="number" required />
                    </div>
                    <div class="flex justify-between">
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            {{ isEdit ? 'Update Task' : 'Add Task' }}
                        </button>
                        <button @click="closeModal" type="button"
                            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import httpClient from '/src/httpClient.js';


export default {
    name: "ManageTasks",
    data() {
        return {
            tasks: [],
            showModal: false,
            isEdit: false,
            taskForm: {
                id: "",
                name: "",
                description: "",
                roleId: 1,
            },
        };
    },
    methods: {
        async fetchTasks() {
            try {
                const response = await httpClient.get(`/duties`);
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
        async addTask() {
            try {
                const newTask = {
                    RoleId: this.taskForm.roleId,
                    DutyName: this.taskForm.name,
                    DutyDescription: this.taskForm.description,
                };
                await httpClient.post(`/duties`, newTask);

                this.fetchTasks();
                this.closeModal();
                alert("Task added successfully!");
            } catch (error) {
                console.error("Error adding task:", error);
                alert("Failed to add the task.");
            }
        },
        async updateTask() {
            try {
                const updatedTask = {
                    PartitionKey: "Duty",
                    RowKey: this.taskForm.id,
                    RoleId: this.taskForm.roleId,
                    DutyName: this.taskForm.name,
                    DutyDescription: this.taskForm.description,
                };

                await httpClient.put(`/duties/Duty/${this.taskForm.id}`, updatedTask);

                this.fetchTasks();
                this.closeModal();
                alert("Task updated successfully!");
            } catch (error) {
                console.error("Error updating task:", error);
                alert("Failed to update the task.");
            }
        },
        async deleteTask(task) {
            try {
                await httpClient.delete(`/duties/Duty/${task.id}`);
                this.fetchTasks();
                alert("Task deleted successfully!");
            } catch (error) {
                console.error("Error deleting task:", error);
                alert("Failed to delete the task.");
            }
        },
        openModal(action, task = null) {
            this.isEdit = action === "edit";
            if (task) {
                this.taskForm = { ...task };
            } else {
                this.taskForm = { id: "", name: "", description: "", roleId: 1 };
            }
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        handleSubmit() {
            if (this.isEdit) {
                this.updateTask();
            } else {
                this.addTask();
            }
        },
    },
    mounted() {
        this.fetchTasks();
    },
};
</script>
