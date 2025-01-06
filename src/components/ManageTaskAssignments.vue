<template>
    <div class="p-4">
      <!-- Filters Section -->
      <div class="mb-4 flex items-center space-x-4">
        <input
          v-model="searchShiftId"
          type="text"
          placeholder="Search by Shift ID"
          class="border border-gray-300 rounded-md p-2"
          @input="filterAssignments"
        />
        <select
          v-model="statusFilter"
          class="border border-gray-300 rounded-md p-2"
          @change="filterAssignments"
        >
          <option value="">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Incomplete">Incomplete</option>
        </select>
        <label class="flex items-center space-x-2">
          <input
            type="checkbox"
            v-model="filterWithImages"
            @change="filterAssignments"
          />
          <span>With Images Only</span>
        </label>
      </div>
  
      <!-- Task Assignments Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300 bg-white">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 border border-gray-300 text-left">Shift ID</th>
              <th class="px-4 py-2 border border-gray-300 text-left">Task ID</th>
              <th class="px-4 py-2 border border-gray-300 text-left">Employee</th>
              <th class="px-4 py-2 border border-gray-300 text-left">Status</th>
              <th class="px-4 py-2 border border-gray-300 text-left">Image</th>
              <th class="px-4 py-2 border border-gray-300 text-left">Notes</th>
              <th class="px-4 py-2 border border-gray-300 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="assignment in filteredAssignments"
              :key="assignment.RowKey"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-2 border border-gray-300">
                {{ assignment.PartitionKey }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ assignment.RowKey }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ assignment.EmployeeName || 'N/A' }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                <span
                  :class="{
                    'text-green-600 font-bold': assignment.TaskAssignmentStatus === 'Completed',
                    'text-red-600 font-bold': assignment.TaskAssignmentStatus === 'Incomplete',
                  }"
                >
                  {{ assignment.TaskAssignmentStatus }}
                </span>
              </td>
              <td class="px-4 py-2 border border-gray-300">
                <img
                  v-if="assignment.TaskAssignmentImageUrl"
                  :src="assignment.TaskAssignmentImageUrl"
                  alt="Task Assignment Image"
                  class="w-12 h-12 object-cover cursor-pointer"
                  @click="viewImage(assignment.TaskAssignmentImageUrl)"
                />
                <span v-else>No Image</span>
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ assignment.TaskAssignmentNote || 'N/A' }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                <button
                  @click="viewDetails(assignment)"
                  class="text-blue-600 hover:underline"
                >
                  View Details
                </button>
              </td>
            </tr>
            <tr v-if="!filteredAssignments.length">
              <td class="px-4 py-2 border border-gray-300 text-center" colspan="7">
                No Task Assignments Found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Details Modal -->
      <div
        v-if="selectedAssignment"
        class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
        @click.self="closeModal"
      >
        <div class="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
          <h3 class="text-lg font-bold mb-4">Task Assignment Details</h3>
          <p><strong>Shift ID:</strong> {{ selectedAssignment.PartitionKey }}</p>
          <p><strong>Task ID:</strong> {{ selectedAssignment.RowKey }}</p>
          <p><strong>Status:</strong> {{ selectedAssignment.TaskAssignmentStatus }}</p>
          <p>
            <strong>Image:</strong>
            <img
              v-if="selectedAssignment.TaskAssignmentImageUrl"
              :src="selectedAssignment.TaskAssignmentImageUrl"
              alt="Task Assignment Image"
              class="w-full mt-2"
            />
            <span v-else>No Image</span>
          </p>
          <p class="mt-2">
            <strong>Notes:</strong> {{ selectedAssignment.TaskAssignmentNote || 'N/A' }}
          </p>
          <button
            @click="closeModal"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        assignments: [], // Full list of duty assignments
        filteredAssignments: [], // List after applying filters
        searchShiftId: "", // Search term for Shift ID
        statusFilter: "", // Filter by status
        filterWithImages: false, // Whether to filter for assignments with images
        selectedAssignment: null, // Assignment selected for detailed view
      };
    },
    created() {
      this.fetchAssignments();
    },
    methods: {
      async fetchAssignments() {
        const response = await fetch("/api/dutyassignments");
        this.assignments = await response.json();
        this.filteredAssignments = [...this.assignments];
      },
      filterAssignments() {
        this.filteredAssignments = this.assignments.filter((assignment) => {
          const matchesShiftId = this.searchShiftId
            ? assignment.PartitionKey.includes(this.searchShiftId)
            : true;
          const matchesStatus = this.statusFilter
            ? assignment.TaskAssignmentStatus === this.statusFilter
            : true;
          const matchesImage =
            this.filterWithImages && assignment.TaskAssignmentImageUrl
              ? true
              : !this.filterWithImages;
          return matchesShiftId && matchesStatus && matchesImage;
        });
      },
      viewDetails(assignment) {
        this.selectedAssignment = assignment;
      },
      viewImage(url) {
        window.open(url, "_blank");
      },
      closeModal() {
        this.selectedAssignment = null;
      },
    },
  };
  </script>
  