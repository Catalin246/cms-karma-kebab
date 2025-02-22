<template>
    <div class="manage-trucks">
      <h2 class="text-2xl font-bold text-black">Manage Trucks</h2>
      <div class="flex justify-between mb-4">
        <button
          class="bg-green-500 text-white px-4 py-2 mt-3 rounded hover:bg-green-600"
          @click="openAddTruckModal"
        >
          Add Truck
        </button>
        <input
          v-model="searchTruck"
          type="text"
          placeholder="Search trucks"
          class="p-2 border rounded text-black"
        />
      </div>
      <div v-if="loading.trucks" class="text-center">Loading...</div>
      <div v-else-if="error.trucks" class="text-center text-red-500">{{ error.trucks }}</div>
      <div v-else class="bg-white rounded-lg shadow border overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-black border">Plate Number</th>
              <th class="px-4 py-2 text-left text-black border">Name</th>
              <th class="px-4 py-2 text-left text-black border">Description</th>
              <th class="px-4 py-2 text-left text-black border">Note</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="truck in filteredTrucks"
              :key="truck.plate_number"
              class="border-t"
            >
              <td class="px-4 py-2 text-black border">{{ truck.plate_number }}</td>
              <td class="px-4 py-2 text-black border">{{ truck.name }}</td>
              <td class="px-4 py-2 text-black border">{{ truck.description }}</td>
              <td class="px-4 py-2 text-black border">{{ truck.note }}</td>
              <td class="px-4 py-2 text-black border">
                <button
                  class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                  @click="openEditTruckModal(truck)"
                >
                  Edit
                </button>
                <button
                  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  @click="deleteTruck(truck.plate_number)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Modal for Adding/Editing Truck -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
        <div class="bg-white p-6 rounded-lg w-1/3">
          <h3 class="text-xl text-violet-700 font-bold mb-4">{{ isEdit ? 'Edit Truck' : 'Add Truck' }}</h3>
          <form @submit.prevent="handleTruckSubmit">
            <div class="mb-4">
              <label for="truckPlate" class="block text-gray-700">Truck Plate number</label>
              <input
                id="truckPlate"
                v-model="truckForm.plate_number"
                class="w-full p-2 border rounded bg-white text-gray-900"
                type="text"
                required
              />
            </div>
            <div class="mb-4">
              <label for="truckName" class="block text-gray-700">Truck Name</label>
              <input
                id="truckName"
                v-model="truckForm.name"
                class="w-full p-2 border rounded bg-white text-gray-900"
                type="text"
                required
              />
            </div>
            <div class="mb-4">
              <label for="truckDescription" class="block text-gray-700">Truck Description</label>
              <input
                id="truckDescription"
                v-model="truckForm.description"
                class="w-full p-2 border rounded bg-white text-gray-900"
                type="text"
                required
              />
            </div>
            <div class="mb-4">
              <label for="truckNote" class="block text-gray-700">Truck Note</label>
              <input
                id="truckNote"
                v-model="truckForm.note"
                class="w-full p-2 border rounded bg-white text-gray-900"
                type="text"
                required
              />
            </div>
            <!--
            <div class="mb-4">
              <label for="truckStatus" class="block text-gray-700">Truck Status</label>
              <select
                id="truckStatus"
                v-model="truckForm.status"
                class="w-full p-2 border rounded bg-white text-gray-900"
                required
              >
                <option value="" disabled>Select Status</option>
                <option value="Available">Available</option>
                <option value="In Use">In Use</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="lastMaintenance" class="block text-gray-700">Last Maintenance Date</label>
              <input
                id="lastMaintenance"
                v-model="truckForm.lastMaintenance"
                class="w-full p-2 border rounded bg-white text-gray-900"
                type="date"
                required
              />
            </div>
            -->
            <div class="flex justify-between">
              <button
                type="submit"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {{ isEdit ? 'Update Truck' : 'Add Truck' }}
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
        trucks: [],
        searchTruck: "",
        showModal: false,
        isEdit: false,
        truckForm: {
          plate_number: null,
          name: "",
          description: "",
          note: "",
        },
        loading: {
          trucks: false,
        },
        error: {
          trucks: null,
        },
      };
    },
    computed: {
      filteredTrucks() {
        return this.trucks.filter(truck =>
          truck.name.toLowerCase().includes(this.searchTruck.toLowerCase())
        );
      },
    },
    methods: {
      async fetchTrucks() {
        this.loading.trucks = true;
        this.error.trucks = null;
        try {
          const response = await httpClient.get(`/trucks`);
          this.trucks = response.data;
        } catch (error) {
          this.error.trucks = "Failed to fetch trucks.";
          console.error(error);
        } finally {
          this.loading.trucks = false;
        }
      },
      openAddTruckModal() {
        this.isEdit = false;
        this.truckForm = {
          plate_number: null,
          name: "",
          description: "",
          note: "",
        };
        this.showModal = true;
      },
      openEditTruckModal(truck) {
        this.isEdit = true;
        this.truckForm = { ...truck };
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
      },
      async handleTruckSubmit() {
        if (this.isEdit) {
          await this.editTruck(this.truckForm.plate_number, this.truckForm);
        } else {
          await this.addTruck(this.truckForm);
        }
        this.closeModal();
      },
      async addTruck(truckData) {
        try {
          const response = await httpClient.post(`/trucks`, truckData);
          this.trucks.push(response.data);
          alert("Truck added successfully.");
        } catch (error) {
          alert("Failed to add truck.");
          console.error(error);
        }
      },
      async editTruck(plate_number, truckData) {
        try {
          const response = await httpClient.put(`/trucks/${plate_number}`, truckData);
          const index = this.trucks.findIndex(truck => truck.plate_number === plate_number);
          if (index !== -1) this.trucks.splice(index, 1, response.data);
          alert("Truck updated successfully.");
        } catch (error) {
          alert("Failed to update truck.");
          console.error(error);
        }
      },
      async deleteTruck(plate_number) {
        try {
          await httpClient.delete(`/trucks/${plate_number}`);

          this.trucks = this.trucks.filter(truck => truck.plate_number !== plate_number);
          alert("Truck deleted successfully.");
        } catch (error) {
          alert("Failed to delete truck.");
          console.error(error);
        }
      },
    },
    mounted() {
      this.fetchTrucks();
    },
  };
  </script>
