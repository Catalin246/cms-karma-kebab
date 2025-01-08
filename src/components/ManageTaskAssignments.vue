<template>
  <div class="p-4">
    <!-- Search Section -->
    <div class="mb-4 flex items-center space-x-4">
      <input v-model="searchShiftId" type="text" placeholder="Enter Shift ID"
        class="border border-gray-300 rounded-md p-2" />
      <button @click="fetchAssignments" class="px-4 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600">
        Search
      </button>
    </div>

    <!-- No Results Message -->
    <div v-if="!assignments.length && searchPerformed" class="text-black">
      No duty assignments found for Shift ID: {{ searchShiftId }}
    </div>

    <!-- Duty Assignments Table -->
    <div v-else-if="assignments.length" class="overflow-x-auto">
      <table class="min-w-full border border-gray-300 bg-white text-black">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 border border-gray-300 text-left">Shift ID</th>
            <th class="px-4 py-2 border border-gray-300 text-left">Duty ID</th>
            <th class="px-4 py-2 border border-gray-300 text-left">Employee</th>
            <th class="px-4 py-2 border border-gray-300 text-left">Status</th>
            <th class="px-4 py-2 border border-gray-300 text-left">Image</th>
            <th class="px-4 py-2 border border-gray-300 text-left">Notes</th>
            <th class="px-4 py-2 border border-gray-300 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="assignment in filteredAssignments" :key="assignment.RowKey" class="hover:bg-gray-50">
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
              <span :class="{
                'text-green-600 font-bold': assignment.DutyAssignmentStatus === 'Completed',
                'text-red-600 font-bold': assignment.DutyAssignmentStatus === 'Incomplete',
              }">
                {{ assignment.DutyAssignmentStatus }}
              </span>
            </td>
            <td class="px-4 py-2 border border-gray-300">
              <img v-if="assignment.DutyAssignmentImageUrl" :src="assignment.DutyAssignmentImageUrl"
                alt="Duty Assignment Image" class="w-12 h-12 object-cover cursor-pointer"
                @click="viewImage(assignment.DutyAssignmentImageUrl)" />
              <span v-else>No Image</span>
            </td>
            <td class="px-4 py-2 border border-gray-300">
              {{ assignment.DutyAssignmentNote || '-' }}
            </td>
            <td class="px-4 py-2 border border-gray-300">
              <button @click="viewDetails(assignment)"
                class="text-blue-600 hover:underline bg-transparent border-blue-600">
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedAssignment"
      class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 text-violet-600"
      @click.self="closeModal">
      <div class="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <h3 class="text-lg font-bold mb-4">Duty Assignment Details</h3>
        <p><strong>Shift ID:</strong> {{ selectedAssignment.PartitionKey }}</p>
        <p><strong>Duty ID:</strong> {{ selectedAssignment.RowKey }}</p>
        <p><strong>Status:</strong> {{ selectedAssignment.DutyAssignmentStatus }}</p>
        <p>
          <strong>Image:</strong>
          <img v-if="selectedAssignment.DutyAssignmentImageUrl" :src="selectedAssignment.DutyAssignmentImageUrl"
            alt="Duty Assignment Image" class="w-full mt-2" />
          <span v-else>No Image</span>
        </p>

        <p class="mt-2">
          <strong>Notes:</strong> {{ selectedAssignment.DutyAssignmentNote || 'N/A' }}
        </p>
        <button @click="closeModal" class="mt-4 px-4 py-2 bg-blue-600 text-black rounded-md hover:bg-blue-700">
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
      assignments: [], // Duty assignments for the current Shift ID
      filteredAssignments: [], // List after applying filters
      searchShiftId: "", // Input field value for Shift ID search
      searchPerformed: false, // Indicates if the user has searched
      selectedAssignment: null, // Assignment selected for detailed view
    };
  },
  methods: {
    async fetchAssignments() {
      if (!this.searchShiftId.trim()) {
        alert("Please enter a Shift ID to search.");
        return;
      }
      this.searchPerformed = true;
      this.assignments = []; // Clear existing data
      this.filteredAssignments = []; // Clear filtered data

      try {
        // Replace with your actual API endpoint
        const response = await fetch(
          `http://localhost:3007/duties/duty-assignments?shiftId=${this.searchShiftId}`
        );
        if (!response.ok) throw new Error("Failed to fetch assignments.");
        const data = await response.json();
        this.assignments = data;
        this.filteredAssignments = data; // Initialize filtered list
      } catch (error) {
        console.error(error);
        this.assignments = [];
        this.filteredAssignments = [];
      }
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
