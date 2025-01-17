<template>
  <router-view v-if="$route.path === '/cms'"></router-view>
  <div class="h-screen w-full bg-gray-100">
    <!-- Navbar -->
    <nav class="h-16 bg-blue-600 text-white px-6 flex items-center justify-between shadow-md">
      <h1 class="text-xl font-bold">KK Event & Employee Management CMS</h1>
      <button 
        class="bg-blue-800 px-4 py-2 rounded hover:bg-blue-700"
        @click="handleLogout"
      >
        Logout
      </button>    </nav>

    <!-- Content Container -->
    <div class="h-[calc(100vh-4rem)] w-full flex">
      <!-- Sidebar -->
      <div class="w-64 bg-gray-800 text-white">
        <ul class="p-4 space-y-2">
          <li v-for="item in sidebarItems" :key="item.name">
            <button class="w-full text-left px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              @click="navigateTo(item.view)">
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
            <div>
              <div class="bg-white p-6 rounded-lg shadow border">
                <h3 class="text-lg font-semibold text-black mb-4">Upcoming Events</h3>
              </div>
              
              <div class="py-3">
                <div v-for="event in upcomingEvents" :key="event.id" class="p-3 bg-green-700 rounded-lg shadow border text-white">
                  {{ event.description }} - {{ formatDate(event.startTime) }}
                </div>
              </div>
            </div>

            <div>
              <div class="bg-white p-6 rounded-lg shadow border">
                <h3 class="text-lg font-semibold text-black mb-4">Active Employees</h3>
              </div>
              
              <div class="py-3">
                <div v-for="employee in activeEmployees" :key="employee.id"
                  class="p-3 bg-gray-50 rounded-md text-black">
                  {{ employee.name }} - {{ employee.role }}
                </div>
              </div>
            </div>
            <div>
              <div class="bg-white p-6 rounded-lg shadow border">
                <h3 class="text-lg font-semibold text-black mb-4">Truck Status</h3>
              </div>
              
              <div class="py-3">
                <div v-for="truck in trucks" :key="truck.id" class="p-3 bg-gray-50 rounded-md text-black">
                  {{ truck.name }} - {{ truck.status }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Employee View -->
        <div v-if="currentView === 'employees'" class="space-y-6">
          <div class="">
            <ManageEmployees />
          </div>
        </div>

        <!-- Tasks View -->
        <div v-if="currentView === 'tasks'" class="space-y-6">
          <div class="">
            <ManageTasks />
          </div>
        </div>

        <!-- Truck View --> 
        <div v-if="currentView === 'trucks'" class="space-y-6">
          <div class="">
            <ManageTrucks /> 
          </div>
        </div>

        <!-- Events View -->
        <div v-if="currentView === 'events'" class="space-y-6">
          <div class="">
            <ManageEvents />
          </div>
        </div>

        <!-- Calendar View -->
        <div v-if="currentView === 'calendar'" class="space-y-6">
          <div class="">
            <CalendarView />
          </div>
        </div>


      </div>
    </div>
    </div>
</template>


<!-- THE FOLLOWING IS THE SCRIPT WITH API IMPLEMENTATION -->
<script>
import axios from 'axios';
import ManageTasks from './components/ManageTasks.vue';
import ManageEvents from './components/ManageEvents.vue';
import ManageTrucks from './components/ManageTrucks.vue';
import ManageEmployees from './components/ManageEmployees.vue';
import CalendarView from './components/CalendarView.vue';
import keycloakService from './keycloak.js';
import httpClient from './httpClient';





// Configure axios defaults and interceptors
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Enable cookies if needed
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default {
  name: 'App',
  components: {
    ManageTasks,
    ManageEvents,
    ManageTrucks,
    ManageEmployees,
    CalendarView,
  },
  data() {
    return {
      currentView: 'dashboard',
      sidebarItems: [
        { name: 'Dashboard', view: 'dashboard', icon: 'home' },
        { name: 'Manage Events', view: 'events', icon: 'calendar' },
        { name: 'Manage Employees', view: 'employees', icon: 'users' },
        { name: 'Manage Trucks', view: 'trucks', icon: 'truck' },
        { name: 'Manage Tasks', view: 'tasks' },
        { name: 'Calendar', view: 'calendar', icon: 'calendar-days' }
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
      },
      notifications: [],
      formData: {
        event: {
          name: '',
          date: '',
          location: '',
          description: ''
        },
        employee: {
          name: '',
          email: '',
          phone: '',
          status: 'Active'
        },
        truck: {
          name: '',
          model: '',
          capacity: '',
          status: 'Available'
        }
      }
    };
  },

  computed: {
    upcomingEvents() {
      return this.events
        .filter(event => new Date(event.startTime) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    },

    activeEmployees() {
      return this.employees
        .filter(employee => employee.status === 'Active')
        .slice(0, 5);
    },

    currentMonthYear() {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
    }
  },

  methods: {
    handleLogout() {
      keycloakService.logout();  // Call the Keycloak logout function
      window.location.href = '/logged-out';  // Redirect to the login page after logout
    },
    formatDate(dateString) {
      const date = new Date(dateString); // Parse the ISO string into a Date object
      return date.toLocaleString('en-US', { // Format the date
        weekday: 'short', // Short weekday (e.g., Mon, Tue)
        year: 'numeric', // Full year (e.g., 2025)
        month: 'short', // Abbreviated month (e.g., Jan, Feb)
        day: 'numeric', // Day of the month (e.g., 31)
        hour: 'numeric', // Hour
        minute: 'numeric', // Minute
        second: 'numeric', // Second
        hour12: true // 12-hour format (e.g., 2:00 PM)
      });
    },

    // UI Methods
    navigateTo(view) {
      this.currentView = view;
      this.resetFormData();
    },

    resetFormData() {
      this.formData = {
        event: {
          name: '',
          date: '',
          location: '',
          description: ''
        },
        employee: {
          name: '',
          email: '',
          phone: '',
          status: 'Active'
        },
        truck: {
          name: '',
          model: '',
          capacity: '',
          status: 'Available'
        }
      };
    },

    addNotification(message, type = 'info') {
      const notification = {
        id: Date.now(),
        message,
        type,
        timestamp: new Date()
      };
      this.notifications.push(notification);
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
      }, 5000);
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
    },

    async fetchEvents() {
        try {
          const response = await httpClient.get("/events");
            // Check if response has the expected structure
            if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
                throw new Error("Unexpected response structure");
            }

            // Transform response to fit the app's data structure
            this.events = response.data.data.map(event => ({
                id: event.rowKey || "",
                startTime: event.startTime || "",
                endTime: event.endTime || "",
                address: event.address || "",
                venue: event.venue || "",
                description: event.description || "",
                money: event.money || 0,
                status: event.status || "PENDING",
                person: {
                    firstName: event.person.firstName || "",
                    lastName: event.person.lastName || "",
                    email: event.person.email || ""
                },
                note: event.note || "",
                shiftIds: event.shiftIds || [],
                roleIds: event.roleIds || null
            }));

            console.log('Processed events:', this.events);
        } catch (error) {
            console.error("Error fetching events:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            }
            this.events = [];
            throw new Error("Failed to load events: " + (error.message || "Unknown error"));
        }
    },
  },

  // Lifecycle hooks
  async created() {
    try {
      this.addNotification('Application initialized successfully', 'success');
      this.fetchEvents();
    } catch (error) {
      this.addNotification('Error initializing application', 'error');
      console.error('Initialization error:', error);
    }
  }
};
</script>