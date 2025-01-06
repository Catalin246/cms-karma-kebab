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
            <div class="bg-white p-6 rounded-lg shadow border">
              <h3 class="text-lg font-semibold text-black mb-4">Upcoming Events</h3>
              <div class="space-y-2">
                <div v-for="event in upcomingEvents" :key="event.id" class="p-3 bg-gray-50 rounded-md text-black">
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

        <!-- Task Assignments View -->
        <div v-if="currentView === 'tasks-assignments'" class="space-y-6">
          <div class="">
            <ManageTaskAssignments />
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
import ManageTaskAssignments from './components/ManageTaskAssignments.vue';
import ManageEvents from './components/ManageEvents.vue';
import ManageTrucks from './components/ManageTrucks.vue';
import ManageEmployees from './components/ManageEmployees.vue';
import CalendarView from './components/CalendarView.vue';




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
    ManageTaskAssignments,
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
        { name: 'Manage Task Assignments', view: 'tasks-assignments' },
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
        .filter(event => new Date(event.date) >= new Date())
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
    }
  },

  // Lifecycle hooks
  async created() {
    try {
      this.addNotification('Application initialized successfully', 'success');
    } catch (error) {
      this.addNotification('Error initializing application', 'error');
      console.error('Initialization error:', error);
    }
  }
};
</script>