<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <nav class="bg-blue-600 text-white py-4 px-6 shadow-md">
      <div class="flex justify-between items-center">
        <h1 class="text-xl font-bold"> KK Event & Employee Management CMS</h1>
        <button class="bg-blue-800 px-4 py-2 rounded hover:bg-blue-700">Logout</button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex flex-col md:flex-row">
      <!-- Sidebar -->
      <aside class="bg-gray-800 text-white w-full md:w-1/4 h-full md:h-screen p-4">
        <ul class="space-y-4">
          <li v-for="item in sidebarItems" :key="item.name">
            <button
              class="w-full text-left px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              @click="navigateTo(item.view)"
            >
              {{ item.name }}
            </button>
          </li>
        </ul>
      </aside>

      <!-- Main Section -->
      <main class="flex-1 p-6">
        <div v-if="currentView === 'dashboard'">
          <h2 class="text-2xl font-bold mb-4 text-black">Dashboard</h2>
          <p class="text-black">Welcome to the CMS! Use the sidebar to manage events and employees. still need to add stuff to make it specfic for karma kebab project.but this is a base for this</p>
        </div>

        <div v-if="currentView === 'events'">
          <h2 class="text-2xl font-bold mb-4 text-black">Manage Events</h2>
          <div class="flex justify-between mb-4">
            <button
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              @click="addEvent"
            >
              Add Event
            </button>
            <input
              v-model="searchEvent"
              type="text"
              placeholder="Search events"
              class="p-2 border rounded"
            />
          </div>
          <table class="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr>
                <th class="px-4 text-black py-2 border">ID</th>
                <th class="px-4 text-black py-2 border">Name</th>
                <th class="px-4 text-black py-2 border">Date</th>
                <th class="px-4 text-black py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in filteredEvents" :key="event.id">
                <td class="px-4 text-black py-2 border">{{ event.id }}</td>
                <td class="px-4 text-black py-2 border">{{ event.name }}</td>
                <td class="px-4 text-black py-2 border">{{ event.date }}</td>
                <td class="px-4 text-black py-2 border">
                  <button
                    class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    @click="editEvent(event.id)"
                  >
                    Edit
                  </button>
                  <button
                    class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    @click="deleteEvent(event.id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-between items-center mt-4">
            <button
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              @click="previousPage('events')"
              :disabled="eventPage === 1"
            >
              Previous
            </button>
            <p>Page {{ eventPage }}</p>
            <button
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              @click="nextPage('events')"
              :disabled="!hasMoreEvents"
            >
              Next
            </button>
          </div>
        </div>

        <div v-if="currentView === 'employees'">
          <h2 class="text-2xl font-bold mb-4 text-black">Manage Employees</h2>
          <div class="flex justify-between mb-4">
            <button
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              @click="addEmployee"
            >
              Add Employee
            </button>
            <input
              v-model="searchEmployee"
              type="text"
              placeholder="Search employees"
              class="p-2 border rounded"
            />
          </div>
          <table class="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr>
                <th class="px-4 text-black py-2 border">ID</th>
                <th class="px-4 text-black py-2 border">Name</th>
                <th class="px-4 text-black py-2 border">Role</th>
                <th class="px-4 text-black py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in filteredEmployees" :key="employee.id">
                <td class="px-4 text-black py-2 border">{{ employee.id }}</td>
                <td class="px-4 text-black py-2 border">{{ employee.name }}</td>
                <td class="px-4 text-black py-2 border">{{ employee.role }}</td>
                <td class="px-4 text-black py-2 border">
                  <button
                    class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    @click="editEmployee(employee.id)"
                  >
                    Edit
                  </button>
                  <button
                    class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    @click="deleteEmployee(employee.id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-between items-center mt-4">
            <button
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              @click="previousPage('employees')"
              :disabled="employeePage === 1"
            >
              Previous
            </button>
            <p>Page {{ employeePage }}</p>
            <button
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              @click="nextPage('employees')"
              :disabled="!hasMoreEmployees"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      currentView: 'dashboard',
      sidebarItems: [
        { name: 'Dashboard', view: 'dashboard' },
        { name: 'Manage Events', view: 'events' },
        { name: 'Manage Employees', view: 'employees' },
      ],
      events: [],
      employees: [],
      searchEvent: '',
      searchEmployee: '',
      eventPage: 1,
      employeePage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    filteredEvents() {
      return this.paginatedData(
        this.events.filter((event) =>
          event.name.toLowerCase().includes(this.searchEvent.toLowerCase())
        ),
        this.eventPage
      );
    },
    filteredEmployees() {
      return this.paginatedData(
        this.employees.filter((employee) =>
          employee.name.toLowerCase().includes(this.searchEmployee.toLowerCase())
        ),
        this.employeePage
      );
    },
    hasMoreEvents() {
      return this.eventPage * this.itemsPerPage < this.events.length;
    },
    hasMoreEmployees() {
      return this.employeePage * this.itemsPerPage < this.employees.length;
    },
  },
  methods: {
    navigateTo(view) {
      this.currentView = view;
      if (view === 'events') this.fetchEvents();
      if (view === 'employees') this.fetchEmployees();
    },
    async fetchEvents() {
      try {
        const response = await axios.get('/api/events');
        this.events = response.data;
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    },
    async fetchEmployees() {
      try {
        const response = await axios.get('/api/employees');
        this.employees = response.data;
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    },
    async addEvent() {
      const newEvent = { name: 'New Event', date: '2024-12-31' };
      try {
        const response = await axios.post('/api/events', newEvent);
        this.events.push(response.data);
      } catch (error) {
        console.error('Error adding event:', error);
      }
    },
    async editEvent(id) {
      const updatedEvent = { name: 'Updated Event Name', date: '2025-01-01' };
      try {
        const response = await axios.put(`/api/events/${id}`, updatedEvent);
        const index = this.events.findIndex((event) => event.id === id);
        if (index !== -1) {
          this.events.splice(index, 1, response.data);
        }
      } catch (error) {
        console.error('Error editing event:', error);
      }
    },
    async deleteEvent(id) {
      try {
        await axios.delete(`/api/events/${id}`);
        this.events = this.events.filter((event) => event.id !== id);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    },
    async addEmployee() {
      const newEmployee = { name: 'New Employee', role: 'Staff' };
      try {
        const response = await axios.post('/api/employees', newEmployee);
        this.employees.push(response.data);
      } catch (error) {
        console.error('Error adding employee:', error);
      }
    },
    async editEmployee(id) {
      const updatedEmployee = { name: 'Updated Employee Name', role: 'Manager' };
      try {
        const response = await axios.put(`/api/employees/${id}`, updatedEmployee);
        const index = this.employees.findIndex((employee) => employee.id === id);
        if (index !== -1) {
          this.employees.splice(index, 1, response.data);
        }
      } catch (error) {
        console.error('Error editing employee:', error);
      }
    },
    async deleteEmployee(id) {
      try {
        await axios.delete(`/api/employees/${id}`);
        this.employees = this.employees.filter((employee) => employee.id !== id);
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    },
    paginatedData(data, page) {
      const start = (page - 1) * this.itemsPerPage;
      return data.slice(start, start + this.itemsPerPage);
    },
    nextPage(type) {
      if (type === 'events' && this.hasMoreEvents) {
        this.eventPage++;
      } else if (type === 'employees' && this.hasMoreEmployees) {
        this.employeePage++;
      }
    },
    previousPage(type) {
      if (type === 'events' && this.eventPage > 1) {
        this.eventPage--;
      } else if (type === 'employees' && this.employeePage > 1) {
        this.employeePage--;
      }
    },
  },
  created() {
    this.fetchEvents();
    this.fetchEmployees();
  },
};
</script>


