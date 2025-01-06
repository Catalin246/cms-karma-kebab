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

        <!-- Employees View -->
        <div v-if="currentView === 'employees'" class="space-y-6">
          <h2 class="text-2xl font-bold text-black">Manage Employees</h2>
          <div class="flex justify-between mb-4">
            <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Add Employee
            </button>
            <input v-model="searchEmployee" type="text" placeholder="Search employees"
              class="p-2 border rounded text-white" />
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
                    <button class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                      @click="editEmployee(employee.id)">
                      Edit
                    </button>
                    <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      @click="deleteEmployee(employee.id)">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
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
          <h2 class="text-2xl font-bold text-black">Schedule Overview</h2>
          <div class="bg-white rounded-lg shadow border p-6">
            <div class="flex justify-between items-center mb-6">
              <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" @click="previousMonth">
                Previous Month
              </button>
              <h3 class="text-xl font-bold text-black">{{ currentMonthYear }}</h3>
              <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" @click="nextMonth">
                Next Month
              </button>
            </div>
            <div class="grid grid-cols-7 gap-2">
              <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day"
                class="text-center font-bold p-2 text-black">
                {{ day }}
              </div>
              <div v-for="date in calendarDates" :key="date.date" class="border p-2 min-h-24 relative">
                <div class="font-bold text-black">{{ date.dayOfMonth }}</div>
                <div v-for="event in date.events" :key="event.id"
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
    <div v-if="showShiftsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                <button class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                  @click="editShift(shift.id)">
                  Edit
                </button>
                <button class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-2"
                  @click="confirmShift(shift.id)">
                  Confirm
                </button>
                <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" @click="deleteShift(shift.id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="mt-6 flex justify-end">
          <button class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" @click="closeShiftsModal">
            Close
          </button>
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

// API endpoint configurations
const endpoints = {
  events: {
    base: import.meta.env.VUE_APP_EVENT_SERVICE,
    list: (startDate, endDate) =>
      `/events?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
    getById: (partitionKey, rowKey) => `/events/${partitionKey}/${rowKey}`,
    create: '/events',
    update: (partitionKey, rowKey) => `/events/${partitionKey}/${rowKey}`,
    delete: (partitionKey, rowKey) => `/events/${partitionKey}/${rowKey}`,
    getByShiftId: shiftId => `/events/shift/${shiftId}`
  },
  employees: {
    base: import.meta.env.VUE_APP_EMPLOYEE_SERVICE,
    list: '/employees',
    getById: id => `/employees/${id}`,
    getByRole: role => `/employees?role=${encodeURIComponent(role)}`,
    create: '/employees',
    update: id => `/employees/${id}`,
    delete: id => `/employees/${id}`
  },
  trucks: { // THIS ONE STILL HAS TO BE UPDATES TO REFLECT TRUCK MICROSERVICE
    base: import.meta.env.VUE_APP_TRUCK_SERVICE,
    list: '/trucks',
    create: '/trucks',
    update: id => `/trucks/${id}`,
    delete: id => `/trucks/${id}`
  },
  shifts: {
    base: import.meta.env.VUE_APP_SHIFT_SERVICE,
    list: ({ date, employeeId, shiftType, shiftId, eventId } = {}) => {
      let queryParams = [];
      if (date) queryParams.push(`date=${encodeURIComponent(date)}`);
      if (employeeId) queryParams.push(`employeeId=${employeeId}`);
      if (shiftType) queryParams.push(`shiftType=${shiftType}`);
      if (shiftId) queryParams.push(`shiftId=${shiftId}`);
      if (eventId) queryParams.push(`eventId=${eventId}`);
      return `/shifts${queryParams.length ? `?${queryParams.join('&')}` : ''}`;
    },
    getById: shiftId => `/shifts/${shiftId}`,
    create: '/shifts',
    update: shiftId => `/shifts/${shiftId}`,
    delete: shiftId => `/shifts/${shiftId}`,
    clockIn: shiftId => `/shifts/${shiftId}/clockin`,
    getTotalHoursByEmployee: employeeId => `/shifts/${employeeId}/hours`
  },
  duties: {
    base: import.meta.env.VUE_APP_DUTY_SERVICE,
    list: '/duties',
    getById: (partitionKey, rowKey) => `/duties/${partitionKey}/${rowKey}`,
    getByRole: roleId => `/duties?RoleId=${roleId}`,
    create: '/duties',
    update: (partitionKey, rowKey) => `/duties/${partitionKey}/${rowKey}`,
    delete: (partitionKey, rowKey) => `/duties/${partitionKey}/${rowKey}`
  },
  availabilities: {
    base: import.meta.env.VUE_APP_AVAILABILITY_SERVICE,
    list: (startDate, endDate) =>
      `/availability?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
    getByEmployeeId: employeeID => `/availability/${employeeID}`,
    create: '/availability',
    update: (employeeID, id) => `/availability/${employeeID}/${id}`,
    delete: (employeeID, id) => `/availability/${employeeID}/${id}`
  }
};

export default {
  name: 'App',
  components: {
    ManageTasks,
    ManageEvents,
    ManageTrucks,
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
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    },

    activeEmployees() {
      return this.employees
        .filter(employee => employee.status === 'Active')
        .slice(0, 5);
    },

    availableTrucks() {
      return this.trucks
        .filter(truck => truck.status === 'Available')
        .slice(0, 5);
    },

    filteredEvents() {
      return this.events.filter(event =>
        event.name.toLowerCase().includes(this.searchEvent.toLowerCase()) ||
        event.location.toLowerCase().includes(this.searchEvent.toLowerCase())
      );
    },

    filteredEmployees() {
      return this.employees.filter(employee =>
        employee.name.toLowerCase().includes(this.searchEmployee.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.searchEmployee.toLowerCase())
      );
    },

    filteredTrucks() {
      return this.trucks.filter(truck =>
        truck.name.toLowerCase().includes(this.searchTruck.toLowerCase()) ||
        truck.model.toLowerCase().includes(this.searchTruck.toLowerCase())
      );
    },

    currentMonthYear() {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
    }
  },

  methods: {
    // API Methods - Employees
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

    async addEmployee(employeeData) {
      try {
        const response = await api.post(
          `${endpoints.employees.base}${endpoints.employees.create}`,
          employeeData
        );
        this.employees.push(response.data);
        this.addNotification('Employee added successfully', 'success');
        return response.data;
      } catch (error) {
        this.addNotification('Failed to add employee', 'error');
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
        this.addNotification('Employee updated successfully', 'success');
        return response.data;
      } catch (error) {
        this.addNotification('Failed to update employee', 'error');
        console.error('Error updating employee:', error);
        throw error;
      }
    },

    async deleteEmployee(id) {
      try {
        await api.delete(`${endpoints.employees.base}${endpoints.employees.delete(id)}`);
        this.employees = this.employees.filter(employee => employee.id !== id);
        this.addNotification('Employee deleted successfully', 'success');
      } catch (error) {
        this.addNotification('Failed to delete employee', 'error');
        console.error('Error deleting employee:', error);
        throw error;
      }
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
    }
  },

  // Lifecycle hooks
  async created() {
    try {
      await Promise.all([
        this.fetchEvents(),
        this.fetchEmployees(),
        this.fetchTrucks()
      ]);
      this.addNotification('Application initialized successfully', 'success');
    } catch (error) {
      this.addNotification('Error initializing application', 'error');
      console.error('Initialization error:', error);
    }
  }
};
</script>