<template>
    <div class="manage-employees">
      <h2 class="text-2xl font-bold text-black">Manage Employees</h2>
      <div class="flex justify-between mb-4">
        <button
          class="bg-green-500 text-white px-4 py-2 mt-3 rounded hover:bg-green-600"
          @click="openAddEmployeeModal"
        >
          Add Employee
        </button>
        <input
          v-model="searchEmployee"
          type="text"
          placeholder="Search employees"
          class="p-2 border rounded text-black"
        />
      </div>
      <div v-if="loading.employees" class="text-center">Loading...</div>
      <div v-else-if="error.employees" class="text-center text-red-500">{{ error.employees }}</div>
      <div v-else class="bg-white rounded-lg shadow border overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-black border">ID</th>
              <th class="px-4 py-2 text-left text-black border">Name</th>
              <th class="px-4 py-2 text-left text-black border">Email</th>
              <th class="px-4 py-2 text-left text-black border">Date of Birth</th>
              <th class="px-4 py-2 text-left text-black border">Address</th>
              <th class="px-4 py-2 text-left text-black border">Pay Rate</th>
              <th class="px-4 py-2 text-left text-black border">Roles</th>
              <th class="px-4 py-2 text-left text-black border">Skills</th>
              <th class="px-4 py-2 text-left text-black border">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="employee in filteredEmployees"
              :key="employee.employeeId"
              class="border-t"
            >
              <td class="px-4 py-2 text-black border">{{ employee.employeeId }}</td>
              <td class="px-4 py-2 text-black border">{{ employee.firstName }} {{ employee.lastName }}</td>
              <td class="px-4 py-2 text-black border">{{ employee.email }}</td>
              <td class="px-4 py-2 text-black border">{{ employee.dateOfBirth }}</td>
              <td class="px-4 py-2 text-black border">{{ employee.address }}</td>
              <td class="px-4 py-2 text-black border">{{ employee.payrate }}</td>
              <td class="px-4 py-2 text-black border">{{ employee.roles.map(r => r.roleName).join(', ') }}</td>
              <td class="px-4 py-2 text-black border">{{ employee.skills.map(s => s.skillName).join(', ') }}</td>
              <td class="px-4 py-2 text-black border">
                <button
                  class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                  @click="openEditEmployeeModal(employee)"
                >
                  Edit
                </button>
                <button
                  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  @click="deleteEmployee(employee.employeeId)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Modal for Adding/Editing Employee -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
        <div class="bg-white p-6 rounded-lg w-1/3">
          <h3 class="text-xl text-violet-700 font-bold mb-4">{{ isEdit ? 'Edit Employee' : 'Add Employee' }}</h3>
          <form @submit.prevent="handleEmployeeSubmit">
            <div class="mb-4">
              <label for="firstName" class="block text-gray-700">First Name</label>
              <input
                id="firstName"
                v-model="employeeForm.firstName"
                class="w-full p-2 border rounded bg-white text-gray-900"
                type="text"
                required
              />
            </div>
            <div class="mb-4">
              <label for="lastName" class="block text-gray-700">Last Name</label>
              <input
                id="lastName"
                v-model="employeeForm.lastName"
                class="w-full p-2 border rounded bg-white text-gray-900"
                type="text"
                required
              />
            </div>
            <div class="mb-4">
              <label for="email" class="block text-gray-700">Email</label>
              <input
                id="email"
                v-model="employeeForm.email"
                class="w-full p-2 border rounded bg-white text-gray-900"
                type="email"
                required
              />
            </div>
            <div class="mb-4">
              <label for="dateOfBirth" class="block text-gray-700">Date of Birth</label>
              <input
                id="dateOfBirth"
                v-model="employeeForm.dateOfBirth"
                class="w-full p-2 border rounded bg-white text-gray-900"
                type="date"
                required
              />
            </div>
            <div class="mb-4">
              <label for="address" class="block text-gray-700">Address</label>
              <input
                id="address"
                v-model="employeeForm.address"
                class="w-full p-2 border rounded bg-white text-gray-900"
                type="text"
              />
            </div>
            <div class="mb-4">
              <label for="payrate" class="block text-gray-700">Pay Rate</label>
              <input
                id="payrate"
                v-model="employeeForm.payrate"
                class="w-full p-2 border rounded bg-white text-gray-900"
                type="number"
                step="0.01"
              />
            </div>
            <div class="mb-4">
              <label for="roles" class="block text-gray-700">Roles</label>
              <input
                id="roles"
                v-model="employeeForm.roles"
                class="w-full p-2 border rounded bg-white text-gray-900"
                type="text"
                placeholder="Comma-separated roles"
              />
            </div>
            <div class="mb-4">
              <label for="skills" class="block text-gray-700">Skills</label>
              <input
                id="skills"
                v-model="employeeForm.skills"
                class="w-full p-2 border rounded bg-white text-gray-900"
                type="text"
                placeholder="Comma-separated skills"
              />
            </div>
            <div class="flex justify-between">
              <button
                type="submit"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {{ isEdit ? 'Update Employee' : 'Add Employee' }}
              </button>
              <button
                @click="closeModal"
                type="button"
                class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
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
    data() {
      return {
        employees: [],
        searchEmployee: "",
        showModal: false,
        isEdit: false,
        employeeForm: {
          employeeId: null,
          dateOfBirth: "",
          firstName: "",
          lastName: "",
          address: "",
          payrate: null,
          roles: "",
          email: "",
          skills: "",
        },
        loading: {
          employees: false,
        },
        error: {
          employees: null,
        },
      };
    },
    computed: {
      filteredEmployees() {
        return this.employees.filter(employee =>
          `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(this.searchEmployee.toLowerCase())
        );
      },
    },
    methods: {
      async fetchEmployees() {
        this.loading.employees = true;
        this.error.employees = null;
        try {
          const response = await httpClient.get("/employees");
          this.employees = response.data;
        } catch (error) {
          this.error.employees = "Failed to fetch employees.";
          console.error(error);
        } finally {
          this.loading.employees = false;
        }
      },
      openAddEmployeeModal() {
        this.isEdit = false;
        this.employeeForm = {
          employeeId: null,
          dateOfBirth: "",
          firstName: "",
          lastName: "",
          address: "",
          payrate: null,
          roles: "",
          email: "",
          skills: "",
        };
        this.showModal = true;
      },
      openEditEmployeeModal(employee) {
        this.isEdit = true;
        this.employeeForm = {
          ...employee,
          roles: employee.roles.map(r => r.roleName).join(", "),
          skills: employee.skills.map(s => s.skillName).join(", "),
        };
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
      },
      async handleEmployeeSubmit() {
        if (this.isEdit) {
          await this.editEmployee(this.employeeForm.employeeId, this.employeeForm);
        } else {
          await this.addEmployee(this.employeeForm);
        }
        this.closeModal();
      },
      async addEmployee(employeeData) {
        try {
          const response = await httpClient.post("/events", employeeData);
          this.employees.push(response.data);
          alert("Employee added successfully.");
        } catch (error) {
          alert("Failed to add employee.");
          console.error(error);
        }
      },
      async editEmployee(id, employeeData) {
        try {
          const response = await httpClient.put(`/employees/${id}`, employeeData);
          const index = this.employees.findIndex(employee => employee.employeeId === id);
          if (index !== -1) this.employees.splice(index, 1, response.data);
          alert("Employee updated successfully.");
        } catch (error) {
          alert("Failed to update employee.");
          console.error(error);
        }
      },
      async deleteEmployee(id) {
        try {
          await httpClient.delete(`/employees/${id}`);
          this.employees = this.employees.filter(employee => employee.employeeId !== id);
          alert("Employee deleted successfully.");
        } catch (error) {
          alert("Failed to delete employee.");
          console.error(error);
        }
      },
    },
    mounted() {
      this.fetchEmployees();
    },
  };
  </script>