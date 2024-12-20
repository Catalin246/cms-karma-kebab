<template>
   <router-view v-if="$route.path === '/cms'"></router-view>
  <div class="h-screen w-full bg-gray-100">
    <!-- Navbar -->
    <nav class="h-16 bg-blue-600 text-white px-6 flex items-center justify-between shadow-md">
      <h1 class="text-xl font-bold">KK Event & Employee Management CMS</h1>
      <button class="bg-blue-800 px-4 py-2 rounded hover:bg-blue-700">Logout</button>
    </nav>

    <!-- Content Container -->
    <div class="h-[calc(100vh-4rem)] w-full flex">
      <!-- Sidebar -->
      <div class="w-64 bg-gray-800 text-white">
        <ul class="p-4 space-y-2">
          <li v-for="item in sidebarItems" :key="item.name">
            <button
              class="w-full text-left px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              @click="navigateTo(item.view)"
            >
              {{ item.name }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Main Content Area -->
      <div class="w-[calc(100%-16rem)] h-full bg-white p-6 overflow-auto">
        <!-- Dashboard View -->
        <div v-if="currentView === 'dashboard'" class="space-y-6">
          <h2 class="text-2xl font-bold text-black">Dashboard</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-lg shadow border">
              <h3 class="text-lg font-semibold text-black mb-4">Upcoming Events</h3>
              <div class="space-y-2">
                <div v-for="event in upcomingEvents" :key="event.id" 
                     class="p-3 bg-gray-50 rounded-md text-black">
                  {{ event.name }} - {{ event.date }}
                </div>
              </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow border">
              <h3 class="text-lg font-semibold text-black mb-4">Active Employees</h3>
              <div class="space-y-2">
                <div v-for="employee in activeEmployees" :key="employee.id" 
                     class="p-3 bg-gray-50 rounded-md text-black">
                  {{ employee.name }} - {{ employee.role }}
                </div>
              </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow border">
              <h3 class="text-lg font-semibold text-black mb-4">Truck Status</h3>
              <div class="space-y-2">
                <div v-for="truck in trucks" :key="truck.id" 
                     class="p-3 bg-gray-50 rounded-md text-black">
                  {{ truck.name }} - {{ truck.status }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Events View -->
        <div v-if="currentView === 'events'" class="space-y-6">
          <h2 class="text-2xl font-bold text-black">Manage Events</h2>
          <div class="flex justify-between mb-4">
            <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Add Event
            </button>
            <input
              v-model="searchEvent"
              type="text"
              placeholder="Search events"
              class="p-2 border rounded text-white"
            />
          </div>
          <div class="bg-white rounded-lg shadow border overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-black border">ID</th>
                  <th class="px-4 py-2 text-left text-black border">Name</th>
                  <th class="px-4 py-2 text-left text-black border">Date</th>
                  <th class="px-4 py-2 text-left text-black border">Shifts</th>
                  <th class="px-4 py-2 text-left text-black border">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in filteredEvents" :key="event.id" class="border-t">
                  <td class="px-4 py-2 text-black border">{{ event.id }}</td>
                  <td class="px-4 py-2 text-black border">{{ event.name }}</td>
                  <td class="px-4 py-2 text-black border">{{ event.date }}</td>
                  <td class="px-4 py-2 text-black border">
                    <button
                      class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      @click="manageShifts(event.id)"
                    >
                      Manage Shifts
                    </button>
                  </td>
                  <td class="px-4 py-2 text-black border">
                    <button
                      class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                      @click="editEvent(event.id)"
                    >
                      Edit
                    </button>
                    <button
                      class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      @click="deleteEvent(event.id)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Employees View -->
        <div v-if="currentView === 'employees'" class="space-y-6">
          <h2 class="text-2xl font-bold text-black">Manage Employees</h2>
          <div class="flex justify-between mb-4">
            <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Add Employee
            </button>
            <input
              v-model="searchEmployee"
              type="text"
              placeholder="Search employees"
              class="p-2 border rounded text-white"
            />
          </div>
          <div class="bg-white rounded-lg shadow border overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-black border">ID</th>
                  <th class="px-4 py-2 text-left text-black border">Name</th>
                  <th class="px-4 py-2 text-left text-black border">Role</th>
                  <th class="px-4 py-2 text-left text-black border">Contact</th>
                  <th class="px-4 py-2 text-left text-black border">Status</th>
                  <th class="px-4 py-2 text-left text-black border">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="employee in filteredEmployees" :key="employee.id" class="border-t">
                  <td class="px-4 py-2 text-black border">{{ employee.id }}</td>
                  <td class="px-4 py-2 text-black border">{{ employee.name }}</td>
                  <td class="px-4 py-2 text-black border">{{ employee.role }}</td>
                  <td class="px-4 py-2 text-black border">{{ employee.contact }}</td>
                  <td class="px-4 py-2 text-black border">{{ employee.status }}</td>
                  <td class="px-4 py-2 text-black border">
                    <button
                      class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                      @click="editEmployee(employee.id)"
                    >
                      Edit
                    </button>
                    <button
                      class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      @click="deleteEmployee(employee.id)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Trucks View -->
        <div v-if="currentView === 'trucks'" class="space-y-6">
          <h2 class="text-2xl font-bold text-black">Manage Trucks</h2>
          <div class="flex justify-between mb-4">
            <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Add Truck
            </button>
            <input
              v-model="searchTruck"
              type="text"
              placeholder="Search trucks"
              class="p-2 border rounded text-white"
            />
          </div>
          <div class="bg-white rounded-lg shadow border overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-black border">ID</th>
                  <th class="px-4 py-2 text-left text-black border">Name</th>
                  <th class="px-4 py-2 text-left text-black border">Status</th>
                  <th class="px-4 py-2 text-left text-black border">Last Maintenance</th>
                  <th class="px-4 py-2 text-left text-black border">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="truck in filteredTrucks" :key="truck.id" class="border-t">
                  <td class="px-4 py-2 text-black border">{{ truck.id }}</td>
                  <td class="px-4 py-2 text-black border">{{ truck.name }}</td>
                  <td class="px-4 py-2 text-black border">{{ truck.status }}</td>
                  <td class="px-4 py-2 text-black border">{{ truck.lastMaintenance }}</td>
                  <td class="px-4 py-2 text-black border">
                    <button
                      class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                      @click="editTruck(truck.id)"
                    >
                      Edit
                    </button>
                    <button
                      class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      @click="deleteTruck(truck.id)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Calendar View -->
        <div v-if="currentView === 'calendar'" class="space-y-6">
          <h2 class="text-2xl font-bold text-black">Schedule Overview</h2>
          <div class="bg-white rounded-lg shadow border p-6">
            <div class="flex justify-between items-center mb-6">
              <button
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                @click="previousMonth"
              >
                Previous Month
              </button>
              <h3 class="text-xl font-bold text-black">{{ currentMonthYear }}</h3>
              <button
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                @click="nextMonth"
              >
                Next Month
              </button>
            </div>
            <div class="grid grid-cols-7 gap-2">
              <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" 
                   :key="day"
                   class="text-center font-bold p-2 text-black">
                {{ day }}
              </div>
              <div v-for="date in calendarDates" 
                   :key="date.date"
                   class="border p-2 min-h-24 relative">
                <div class="font-bold text-black">{{ date.dayOfMonth }}</div>
                <div v-for="event in date.events" 
                     :key="event.id"
                     class="bg-blue-100 p-1 mb-1 rounded text-sm text-black">
                  {{ event.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Shifts Modal -->
    <div v-if="showShiftsModal" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-auto">
        <h3 class="text-xl font-bold mb-4 text-black">
          Manage Shifts - {{ currentEvent?.name }}
        </h3>
        <button
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
          @click="addShift"
        >
          Add Shift
        </button>
        <table class="w-full">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left text-black border">Employee</th>
              <th class="px-4 py-2 text-left text-black border">Start Time</th>
              <th class="px-4 py-2 text-left text-black border">End Time</th>
              <th class="px-4 py-2 text-left text-black border">Role</th>
              <th class="px-4 py-2 text-left text-black border">Status</th>
              <th class="px-4 py-2 text-left text-black border">Actions</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="shift in currentEventShifts" :key="shift.id">
              <td class="px-4 py-2 text-black border">{{ shift.employee }}</td>
              <td class="px-4 py-2 text-black border">{{ shift.startTime }}</td>
              <td class="px-4 py-2 text-black border">{{ shift.endTime }}</td>
              <td class="px-4 py-2 text-black border">{{ shift.role }}</td>
              <td class="px-4 py-2 text-black border">{{ shift.status }}</td>
              <td class="px-4 py-2 text-black border">
                  <button
                    class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                    @click="editShift(shift.id)"
                  >
                    Edit
                  </button>
                  <button
                    class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-2"
                    @click="confirmShift(shift.id)"
                  >
                    Confirm
                  </button>
                  <button
                    class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    @click="deleteShift(shift.id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="mt-6 flex justify-end">
            <button
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              @click="closeShiftsModal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      currentView: 'dashboard',
      sidebarItems: [
        { name: 'Dashboard', view: 'dashboard' },
        { name: 'Manage Events', view: 'events' },
        { name: 'Manage Employees', view: 'employees' },
        { name: 'Manage Trucks', view: 'trucks' },
        { name: 'Calendar', view: 'calendar' }
      ],
      events: [
        // Sample data for testing
        { id: 1, name: 'Summer Festival', date: '2024-07-15' },
        { id: 2, name: 'Food Fair', date: '2024-08-20' }
      ],
      employees: [
        // Sample data for testing
        { id: 1, name: 'John Doe', role: 'Manager', contact: '123-456-7890', status: 'Active' },
        { id: 2, name: 'Jane Smith', role: 'Staff', contact: '098-765-4321', status: 'Active' }
      ],
      trucks: [
        // Sample data for testing
        { id: 1, name: 'Truck A', status: 'Available', lastMaintenance: '2024-06-01' },
        { id: 2, name: 'Truck B', status: 'In Service', lastMaintenance: '2024-05-15' }
      ],
      currentEvent: null,
      currentEventShifts: [],
      showShiftsModal: false,
      searchEvent: '',
      searchEmployee: '',
      searchTruck: '',
      currentMonth: new Date(),
    };
  },
  computed: {
    upcomingEvents() {
      return this.events
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    },
    activeEmployees() {
      return this.employees
        .filter(employee => employee.status === 'Active')
        .slice(0, 5);
    },
    filteredEvents() {
      return this.events.filter(event =>
        event.name.toLowerCase().includes(this.searchEvent.toLowerCase())
      );
    },
    filteredEmployees() {
      return this.employees.filter(employee =>
        employee.name.toLowerCase().includes(this.searchEmployee.toLowerCase())
      );
    },
    filteredTrucks() {
      return this.trucks.filter(truck =>
        truck.name.toLowerCase().includes(this.searchTruck.toLowerCase())
      );
    },
    currentMonthYear() {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
    },
    calendarDates() {
      const year = this.currentMonth.getFullYear();
      const month = this.currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      
      // Get first day of month
      const firstDayOfWeek = firstDay.getDay();
      
      const dates = [];
      
      // Previous month's days
      const prevMonthDays = new Date(year, month, 0).getDate();
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        dates.push({
          date: new Date(year, month - 1, prevMonthDays - i),
          dayOfMonth: prevMonthDays - i,
          isCurrentMonth: false,
          events: []
        });
      }
      
      // Current month's days
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const dateStr = currentDate.toISOString().split('T')[0];
        dates.push({
          date: currentDate,
          dayOfMonth: day,
          isCurrentMonth: true,
          events: this.events.filter(event => event.date === dateStr)
        });
      }
      
      // Next month's days
      const remainingDays = 42 - dates.length;
      for (let day = 1; day <= remainingDays; day++) {
        dates.push({
          date: new Date(year, month + 1, day),
          dayOfMonth: day,
          isCurrentMonth: false,
          events: []
        });
      }
      
      return dates;
    }
  },
  methods: {
    navigateTo(view) {
      this.currentView = view;
    },
    previousMonth() {
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
    },
    nextMonth() {
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
    },
    addEvent() {
      const newEvent = {
        id: this.events.length + 1,
        name: 'New Event',
        date: new Date().toISOString().split('T')[0]
      };
      this.events.push(newEvent);
    },
    editEvent(id) {
      const event = this.events.find(e => e.id === id);
      if (event) {
        event.name = 'Updated Event Name';
      }
    },
    deleteEvent(id) {
      this.events = this.events.filter(event => event.id !== id);
    },
    addEmployee() {
      const newEmployee = {
        id: this.employees.length + 1,
        name: 'New Employee',
        role: 'Staff',
        contact: '',
        status: 'Active'
      };
      this.employees.push(newEmployee);
    },
    editEmployee(id) {
      const employee = this.employees.find(e => e.id === id);
      if (employee) {
        employee.name = 'Updated Employee Name';
      }
    },
    deleteEmployee(id) {
      this.employees = this.employees.filter(employee => employee.id !== id);
    },
    addTruck() {
      const newTruck = {
        id: this.trucks.length + 1,
        name: 'New Truck',
        status: 'Available',
        lastMaintenance: new Date().toISOString().split('T')[0]
      };
      this.trucks.push(newTruck);
    },
    editTruck(id) {
      const truck = this.trucks.find(t => t.id === id);
      if (truck) {
        truck.name = 'Updated Truck Name';
      }
    },
    deleteTruck(id) {
      this.trucks = this.trucks.filter(truck => truck.id !== id);
    },
    manageShifts(eventId) {
      const event = this.events.find(e => e.id === eventId);
      if (event) {
        this.currentEvent = event;
        // Sample shifts data for testing
        this.currentEventShifts = [
          { id: 1, employee: "John Doe", startTime: '09:00', endTime: '17:00', role: 'Staff', status: 'Pending' },
          { id: 2,  employee: "John Doe", startTime: '10:00', endTime: '18:00', role: 'Manager', status: 'Confirmed' }
        ];
        this.showShiftsModal = true;
      }
    },
    closeShiftsModal() {
      this.showShiftsModal = false;
      this.currentEvent = null;
      this.currentEventShifts = [];
    },
    addShift() {
      if (!this.currentEvent) return;
      const newShift = {
        id: this.currentEventShifts.length + 1,
        startTime: '09:00',
        endTime: '17:00',
        role: 'Staff',
        status: 'Pending'
      };
      this.currentEventShifts.push(newShift);
    },
    editShift(id) {
      const shift = this.currentEventShifts.find(s => s.id === id);
      if (shift) {
        shift.startTime = '10:00';
        shift.endTime = '18:00';
      }
    },
    confirmShift(id) {
      const shift = this.currentEventShifts.find(s => s.id === id);
      if (shift) {
        shift.status = 'Confirmed';
      }
    },
    deleteShift(id) {
      this.currentEventShifts = this.currentEventShifts.filter(shift => shift.id !== id);
    }
  }
};
</script>

THE FOLLOWING IS THE SCRIPT WITH API IMPLEMENTATION
<!-- 
import axios from 'axios';

// Configure axios defaults and interceptors
const api = axios.create({
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API endpoint configurations
const endpoints = {
  events: {
    base: process.env.VUE_APP_EVENTS_SERVICE_URL,
    list: '/api/events',
    create: '/api/events',
    update: id => `/api/events/${id}`,
    delete: id => `/api/events/${id}`,
    shifts: id => `/api/events/${id}/shifts`
  },
  employees: {
    base: process.env.VUE_APP_EMPLOYEES_SERVICE_URL,
    list: '/api/employees',
    create: '/api/employees',
    update: id => `/api/employees/${id}`,
    delete: id => `/api/employees/${id}`
  },
  trucks: {
    base: process.env.VUE_APP_TRUCKS_SERVICE_URL,
    list: '/api/trucks',
    create: '/api/trucks',
    update: id => `/api/trucks/${id}`,
    delete: id => `/api/trucks/${id}`
  }
};

export default {
  data() {
    return {
      currentView: 'dashboard',
      sidebarItems: [
        { name: 'Dashboard', view: 'dashboard' },
        { name: 'Manage Events', view: 'events' },
        { name: 'Manage Employees', view: 'employees' },
        { name: 'Manage Trucks', view: 'trucks' },
        { name: 'Calendar', view: 'calendar' }
      ],
      events: [],
      employees: [],
      trucks: [],
      currentEvent: null,
      currentEventShifts: [],
      showShiftsModal: false,
      searchEvent: '',
      searchEmployee: '',
      searchTruck: '',
      currentMonth: new Date(),
      loading: {
        events: false,
        employees: false,
        trucks: false,
        shifts: false
      },
      error: {
        events: null,
        employees: null,
        trucks: null,
        shifts: null
      }
    };
  },
  computed: {
    upcomingEvents() {
      return this.events
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    },
    activeEmployees() {
      return this.employees
        .filter(employee => employee.status === 'Active')
        .slice(0, 5);
    },
    filteredEvents() {
      return this.events.filter(event =>
        event.name.toLowerCase().includes(this.searchEvent.toLowerCase())
      );
    },
    filteredEmployees() {
      return this.employees.filter(employee =>
        employee.name.toLowerCase().includes(this.searchEmployee.toLowerCase())
      );
    },
    filteredTrucks() {
      return this.trucks.filter(truck =>
        truck.name.toLowerCase().includes(this.searchTruck.toLowerCase())
      );
    },
    currentMonthYear() {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
    },
    calendarDates() {
      // ... (keep existing calendar computation logic)
    }
  },
  methods: {
    // API Methods
    async fetchEvents() {
      this.loading.events = true;
      this.error.events = null;
      try {
        const response = await api.get(`${endpoints.events.base}${endpoints.events.list}`);
        this.events = response.data;
      } catch (error) {
        this.error.events = 'Failed to fetch events';
        console.error('Error fetching events:', error);
      } finally {
        this.loading.events = false;
      }
    },

    async fetchEmployees() {
      this.loading.employees = true;
      this.error.employees = null;
      try {
        const response = await api.get(`${endpoints.employees.base}${endpoints.employees.list}`);
        this.employees = response.data;
      } catch (error) {
        this.error.employees = 'Failed to fetch employees';
        console.error('Error fetching employees:', error);
      } finally {
        this.loading.employees = false;
      }
    },

    async fetchTrucks() {
      this.loading.trucks = true;
      this.error.trucks = null;
      try {
        const response = await api.get(`${endpoints.trucks.base}${endpoints.trucks.list}`);
        this.trucks = response.data;
      } catch (error) {
        this.error.trucks = 'Failed to fetch trucks';
        console.error('Error fetching trucks:', error);
      } finally {
        this.loading.trucks = false;
      }
    },

    async addEvent(eventData) {
      try {
        const response = await api.post(`${endpoints.events.base}${endpoints.events.create}`, eventData);
        this.events.push(response.data);
        return response.data;
      } catch (error) {
        console.error('Error adding event:', error);
        throw error;
      }
    },

    async editEvent(id, eventData) {
      try {
        const response = await api.put(
          `${endpoints.events.base}${endpoints.events.update(id)}`, 
          eventData
        );
        const index = this.events.findIndex(e => e.id === id);
        if (index !== -1) {
          this.events[index] = response.data;
        }
        return response.data;
      } catch (error) {
        console.error('Error updating event:', error);
        throw error;
      }
    },

    async deleteEvent(id) {
      try {
        await api.delete(`${endpoints.events.base}${endpoints.events.delete(id)}`);
        this.events = this.events.filter(event => event.id !== id);
      } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
      }
    },

    async addEmployee(employeeData) {
      try {
        const response = await api.post(
          `${endpoints.employees.base}${endpoints.employees.create}`, 
          employeeData
        );
        this.employees.push(response.data);
        return response.data;
      } catch (error) {
        console.error('Error adding employee:', error);
        throw error;
      }
    },

    async editEmployee(id, employeeData) {
      try {
        const response = await api.put(
          `${endpoints.employees.base}${endpoints.employees.update(id)}`, 
          employeeData
        );
        const index = this.employees.findIndex(e => e.id === id);
        if (index !== -1) {
          this.employees[index] = response.data;
        }
        return response.data;
      } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
      }
    },

    async deleteEmployee(id) {
      try {
        await api.delete(`${endpoints.employees.base}${endpoints.employees.delete(id)}`);
        this.employees = this.employees.filter(employee => employee.id !== id);
      } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
      }
    },

    async addTruck(truckData) {
      try {
        const response = await api.post(
          `${endpoints.trucks.base}${endpoints.trucks.create}`, 
          truckData
        );
        this.trucks.push(response.data);
        return response.data;
      } catch (error) {
        console.error('Error adding truck:', error);
        throw error;
      }
    },

    async editTruck(id, truckData) {
      try {
        const response = await api.put(
          `${endpoints.trucks.base}${endpoints.trucks.update(id)}`, 
          truckData
        );
        const index = this.trucks.findIndex(t => t.id === id);
        if (index !== -1) {
          this.trucks[index] = response.data;
        }
        return response.data;
      } catch (error) {
        console.error('Error updating truck:', error);
        throw error;
      }
    },

    async deleteTruck(id) {
      try {
        await api.delete(`${endpoints.trucks.base}${endpoints.trucks.delete(id)}`);
        this.trucks = this.trucks.filter(truck => truck.id !== id);
      } catch (error) {
        console.error('Error deleting truck:', error);
        throw error;
      }
    },

    async manageShifts(eventId) {
      this.loading.shifts = true;
      this.error.shifts = null;
      try {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
          this.currentEvent = event;
          const response = await api.get(
            `${endpoints.events.base}${endpoints.events.shifts(eventId)}`
          );
          this.currentEventShifts = response.data;
          this.showShiftsModal = true;
        }
      } catch (error) {
        this.error.shifts = 'Failed to fetch shifts';
        console.error('Error fetching shifts:', error);
      } finally {
        this.loading.shifts = false;
      }
    },

    // Navigation and UI Methods
    navigateTo(view) {
      this.currentView = view;
    },

    previousMonth() {
      this.currentMonth = new Date(
        this.currentMonth.getFullYear(), 
        this.currentMonth.getMonth() - 1
      );
    },

    nextMonth() {
      this.currentMonth = new Date(
        this.currentMonth.getFullYear(), 
        this.currentMonth.getMonth() + 1
      );
    },

    closeShiftsModal() {
      this.showShiftsModal = false;
      this.currentEvent = null;
      this.currentEventShifts = [];
    }
  },
  
  // Lifecycle hooks
  async created() {
    // Fetch initial data
    await Promise.all([
      this.fetchEvents(),
      this.fetchEmployees(),
      this.fetchTrucks()
    ]);
  }
}; -->