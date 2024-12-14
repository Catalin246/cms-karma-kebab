<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <nav class="bg-blue-600 text-white py-4 px-6 shadow-md">
      <div class="flex justify-between items-center">
        <h1 class="text-xl font-bold">Event & Employee Management CMS</h1>
        <button class="bg-blue-800 px-4 py-2 rounded hover:bg-blue-700">Logout</button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex flex-col md:flex-row">
      <!-- Sidebar -->
      <aside class="bg-gray-800 text-white w-full md:w-1/4 h-full md:h-screen p-4">
        <ul class="space-y-4">
          <li>
            <button class="w-full text-left px-4 py-2 bg-gray-700 rounded hover:bg-gray-600" @click="navigateTo('dashboard')">Dashboard</button>
          </li>
          <li>
            <button class="w-full text-left px-4 py-2 bg-gray-700 rounded hover:bg-gray-600" @click="navigateTo('events')">Manage Events</button>
          </li>
          <li>
            <button class="w-full text-left px-4 py-2 bg-gray-700 rounded hover:bg-gray-600" @click="navigateTo('employees')">Manage Employees</button>
          </li>
        </ul>
      </aside>

      <!-- Main Section -->
      <main class="flex-1 p-6">
        <div v-if="currentView === 'dashboard'">
          <h2 class="text-2xl font-bold mb-4 text-black">Dashboard</h2>
          <p class="text-black">Welcome to the CMS! Use the sidebar to manage events and employees. still need to add all specific stuffs for the Karma kebab proj</p>
        </div>

        <div v-if="currentView === 'events'">
          <h2 class="text-2xl font-bold mb-4 text-black">Manage Events</h2>
          <div class="mb-4">
            <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" @click="addEvent">Add Event</button>
          </div>
          <table class="min-w-full shadow-md rounded">
            <thead>
              <tr>
                <th class="px-4 text-black py-2 border">ID</th>
                <th class="px-4 text-black py-2 border">Name</th>
                <th class="px-4 text-black py-2 border">Date</th>
                <th class="px-4 text-black py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in events" :key="event.id">
                <td class="px-4 text-black py-2 border">{{ event.id }}</td>
                <td class="px-4 text-black py-2 border">{{ event.name }}</td>
                <td class="px-4 text-black py-2 border">{{ event.date }}</td>
                <td class="px-4 text-black py-2 border">
                  <button class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600" @click="editEvent(event.id)">Edit</button>
                  <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" @click="deleteEvent(event.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="currentView === 'employees'">
          <h2 class="text-2xl font-bold mb-4 text-black">Manage Employees</h2>
          <div class="mb-4">
            <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" @click="addEmployee">Add Employee</button>
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
              <tr v-for="employee in employees" :key="employee.id">
                <td class="px-4 text-black py-2 border">{{ employee.id }}</td>
                <td class="px-4 text-black py-2 border">{{ employee.name }}</td>
                <td class="px-4 text-black py-2 border">{{ employee.role }}</td>
                <td class="px-4 text-black py-2 border">
                  <button class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600" @click="editEmployee(employee.id)">Edit</button>
                  <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" @click="deleteEmployee(employee.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentView: 'dashboard',
      events: [
        { id: 1, name: 'Music Festival', date: '2024-12-25' },
        { id: 2, name: 'Food Expo', date: '2024-11-20' },
      ],
      employees: [
        { id: 1, name: 'John Doe', role: 'Manager' },
        { id: 2, name: 'Jane Smith', role: 'Coordinator' },
      ],
    };
  },
  methods: {
    navigateTo(view) {
      this.currentView = view;
    },
    addEvent() {
      alert('Add Event functionality here');
    },
    editEvent(id) {
      alert(`Edit Event ${id} functionality here`);
    },
    deleteEvent(id) {
      this.events = this.events.filter(event => event.id !== id);
    },
    addEmployee() {
      alert('Add Employee functionality here');
    },
    editEmployee(id) {
      alert(`Edit Employee ${id} functionality here`);
    },
    deleteEmployee(id) {
      this.employees = this.employees.filter(employee => employee.id !== id);
    },
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
}
</style>
