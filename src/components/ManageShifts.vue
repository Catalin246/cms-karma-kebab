<template>
    <div class="manage-shifts">
        <h2 class="text-2xl font-bold text-black">Manage Shifts</h2>
        <div class="bg-white rounded-lg shadow border overflow-hidden">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-2 text-left text-black border">Start Time</th>
                        <th class="px-4 py-2 text-left text-black border">End Time</th>
                        <th class="px-4 py-2 text-left text-black border">Employee</th>
                        <th class="px-4 py-2 text-left text-black border">Type</th>
                        <th class="px-4 py-2 text-left text-black border">Status</th>
                        <th class="px-4 py-2 text-left text-black border">Hours</th>
                        <th class="px-4 py-2 text-left text-black border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="shift in shifts" :key="shift.id" class="border-t">
                        <td class="px-4 py-2 text-black border">{{ formatDateTime(shift.startTime) }}</td>
                        <td class="px-4 py-2 text-black border">{{ formatDateTime(shift.endTime) }}</td>
                        <td class="px-4 py-2 text-black border">{{ shift.employeeName }}</td>
                        <td class="px-4 py-2 text-black border">{{ shift.shiftType }}</td>
                        <td class="px-4 py-2 text-black border">
                            <span :class="getStatusClass(shift.status)">
                                {{ shift.status }}
                            </span>
                        </td>
                        <td class="px-4 py-2 text-black border">{{ calculateHours(shift.startTime, shift.endTime) }}</td>
                        <td class="px-4 py-2 text-black border">
                            <button @click="openModal(shift)"
                                class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2">
                                Edit
                            </button>
                            <button @click="deleteShift(shift)"
                                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Edit Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
            <div class="bg-white p-6 rounded-lg w-1/2">
                <h3 class="text-xl text-violet-700 font-bold mb-4">Edit Shift</h3>
                <form @submit.prevent="updateShift">
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-gray-700">Start Time</label>
                            <input v-model="shiftForm.startTime" type="datetime-local"
                                class="w-full p-2 border rounded bg-white text-gray-900" required />
                        </div>
                        <div>
                            <label class="block text-gray-700">End Time</label>
                            <input v-model="shiftForm.endTime" type="datetime-local"
                                class="w-full p-2 border rounded bg-white text-gray-900" required />
                        </div>
                        <div>
                            <label class="block text-gray-700">Employee</label>
                            <select v-model="shiftForm.employeeId"
                                class="w-full p-2 border rounded bg-white text-gray-900" required>
                                <option v-for="employee in employees" :key="employee.employeeId" :value="employee.employeeId">
                                    {{ employee.fullName || ''}}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700">Shift Type</label>
                            <select v-model="shiftForm.shiftType"
                                class="w-full p-2 border rounded bg-white text-gray-900" required>
                                <option value="NORMAL">Normal</option>
                                <option value="STANDBY">Standby</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700">Status</label>
                            <select v-model="shiftForm.status"
                                class="w-full p-2 border rounded bg-white text-gray-900" required>
                                <option value="UNCONFIRMED">Unconfirmed</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button type="button" @click="closeModal"
                            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                        <button type="submit"
                            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Update Shift
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import httpClient from '/src/httpClient.js';

export default {
    name: "ManageShifts",
    data() {
        return {
            shifts: [],
            employees: [],
            showModal: false,
            isEdit: false,
            shiftForm: {
                id: null,
                startTime: '',
                endTime: '',
                employeeId: '',
                shiftType: 'NORMAL',
                status: 'UNCONFIRMED',
            },
        };
    },
    methods: { 
        async fetchShifts() {
            try {
                const [shiftsResponse, employeesResponse] = await Promise.all([
                    httpClient.get('/shifts'),
                    httpClient.get('/employees')
                ]);

                // Debug logs to confirm structure
                console.log('Shifts Response:', shiftsResponse.data);
                console.log('Employees Response:', employeesResponse.data);
                this.employees = employeesResponse.data.map(employee => ({
                    ...employee,
                    fullName: `${employee.firstName || ''} ${employee.lastName || ''}`.trim(),
                }));

                this.shifts = shiftsResponse.data.data.map(shift => {
                    const employee = this.employees.find(e => e.id === shift.employeeId);
                    return {
                        id: shift.shiftId,
                        startTime: shift.startTime,
                        endTime: shift.endTime,
                        employeeId: shift.employeeId,
                        employeeName: employee ? employee.fullName : 'Unknown Employee',
                        shiftType: this.getShiftTypeLabel(shift.shiftType),
                        status: this.getStatusLabel(shift.status),
                        clockInTime: shift.clockInTime,
                        clockOutTime: shift.clockOutTime,
                        shiftHours: shift.shiftHours,
                    };
                });
            } catch (error) {
                console.error("Error fetching shifts:", error);
            }
        },

        // Mapping shift type based on numeric values (0 for Normal, 1 for Standby)
        getShiftTypeLabel(shiftType) {
            const labels = {
                0: 'Normal',
                1: 'Standby',
            };
            return labels[shiftType] || 'Unknown';
        },

        // Mapping shift status based on numeric values (0 for Unconfirmed, 1 for Confirmed, 2 for Cancelled)
        getStatusLabel(status) {
            const labels = {
                0: 'Unconfirmed',
                1: 'Confirmed',
                2: 'Cancelled',
            };
            return labels[status] || 'Unknown';
        },

        formatDateTime(datetime) {
            return new Date(datetime).toLocaleString();
        },

        calculateHours(startTime, endTime) {
            const start = new Date(startTime);
            const end = new Date(endTime);
            const hours = (end - start) / (1000 * 60 * 60);
            return hours.toFixed(2);
        },

        getStatusClass(status) {
            const classes = {
                'Unconfirmed': 'text-yellow-600',
                'Confirmed': 'text-green-600',
                'Cancelled': 'text-red-600',
            };
            return classes[status] || '';
        },

        openModal(shift) {
            this.isEdit = true;
            const startDate = new Date(shift.startTime);
            const endDate = new Date(shift.endTime);
            this.shiftForm = {
                ...shift,
                startTime: startDate.toISOString().slice(0, 16),
                endTime: endDate.toISOString().slice(0, 16),
            };
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.resetShiftForm();
        },
        
        resetShiftForm() {
            this.shiftForm = {
                id: null,
                startTime: '',
                endTime: '',
                employeeId: '',
                shiftType: 0, // Default to 0 (Normal)
                status: 0, // Default to 0 (Unconfirmed)
            };
        },

        async addShift() {
            try {
                const newShift = {
                    ...this.shiftForm,
                    startTime: new Date(this.shiftForm.startTime).toISOString(),
                    endTime: new Date(this.shiftForm.endTime).toISOString(),
                    shiftType: this.shiftForm.shiftType,
                    status: this.shiftForm.status,
                };
                await httpClient.post('/shifts', newShift);
                this.fetchShifts();
                this.closeModal();
            } catch (error) {
                console.error("Error adding shift:", error);
            }
        },

        async updateShift() {
            try {
                const updatedShift = {
                    ...this.shiftForm,
                    startTime: new Date(this.shiftForm.startTime).toISOString(),
                    endTime: new Date(this.shiftForm.endTime).toISOString(),
                };
                await httpClient.put(`/shifts/${this.shiftForm.id}`, updatedShift);
                this.fetchShifts();
                this.closeModal();
            } catch (error) {
                console.error("Error updating shift:", error);
            }
        },

        async deleteShift(shift) {
            if (confirm("Are you sure you want to delete this shift?")) {
                try {
                    await httpClient.delete(`/shifts/${shift.id}`);
                    this.fetchShifts();
                } catch (error) {
                    console.error("Error deleting shift:", error);
                }
            }
        },

        handleSubmit() {
            if (this.isEdit) {
                this.updateShift();
            } else {
                this.addShift();
            }
        },
    },
    mounted() {
        this.fetchShifts();
    },
}
</script>
