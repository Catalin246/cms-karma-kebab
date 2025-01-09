<template>
    <div class="manage-events">
        <h2 class="text-2xl font-bold text-black">Manage Events</h2>
        <div class="flex justify-between mb-4">
            <button @click="openModal('add')" class="bg-green-500 text-white px-4 py-2 mt-3 rounded hover:bg-green-600">
                Add Event
            </button>
            <input v-model="searchEvent" type="text" placeholder="Search events"
                class="p-2 border rounded text-black" />
        </div>
        <div class="bg-white rounded-lg shadow border overflow-hidden">
            <!-- Main Events Table -->
            <table class="w-full">
                <!-- Table Header -->
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-2 text-left text-black border">Description</th>
                        <th class="px-4 py-2 text-left text-black border">Date & Time</th>
                        <th class="px-4 py-2 text-left text-black border">Venue</th>
                        <th class="px-4 py-2 text-left text-black border">Status</th>
                        <th class="px-4 py-2 text-left text-black border">Contact</th>
                        <th class="px-4 py-2 text-left text-black border">Cost</th>
                        <th class="px-4 py-2 text-left text-black border">People Working</th>
                        <th class="px-4 py-2 text-left text-black border">Actions</th>
                    </tr>
                </thead>
                <!-- Table Body -->
                <tbody>
                    <tr v-for="event in filteredEvents" :key="event.id" class="border-t">
                        <td class="px-4 py-2 text-black border">
                            <div>{{ event.description }}</div>
                            <!-- <div class="text-sm text-gray-500">{{ event.description }}</div> -->
                        </td>
                        <td class="px-4 py-2 text-black border">
                            <div>{{ formatDateTime(event.startTime) }}</div>
                            <div class="text-sm text-gray-500">to {{ formatDateTime(event.endTime) }}</div>
                        </td>
                        <td class="px-4 py-2 text-black border">
                            <div>{{ event.venue }}</div>
                            <div class="text-sm text-gray-500">{{ event.address }}</div>
                        </td>
                        <td class="px-4 py-2 text-black border">
                            <span :class="getStatusClass(event.status)">
                                {{ event.status }}
                            </span>
                        </td>
                        <td class="px-4 py-2 text-black border">
                            <div>{{ event.person.name }}</div>
                            <div class="text-sm text-gray-500">{{ event.person.email }}</div>
                        </td>
                        <td class="px-4 py-2 text-black border">${{ event.money.toFixed(2) }}</td>
                        <td class="px-4 py-2 text-black border">
                            <!-- Display number of people working on the event -->
                            <div>{{ event.shiftIDs ? event.shiftIDs.length : 0 }} people</div>
                        </td>
                        <td class="px-4 py-2 text-black border">
                            <!-- Edit shift button -->
                            <button @click="openShiftsModal(event)"
                                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2">
                                Edit Shifts
                            </button>
                            <button @click="openModal('edit', event)"
                                class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2">
                                Edit Event
                            </button>
                            <button @click="deleteEvent(event)"
                                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Event Modal Form -->
        <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
            <div class="bg-white p-6 rounded-lg w-2/3 max-h-[80vh] overflow-auto"> <!-- Add max-height and overflow -->
                <h3 class="text-xl text-violet-700 font-bold mb-4">{{ isEdit ? 'Edit Event' : 'Add Event' }}</h3>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <!-- Event Form Fields -->
                        <div>
                            <label for="eventDescription" class="block text-gray-700">Event Description*</label>
                            <input id="eventDescription" v-model="eventForm.description"
                                class="w-full p-2 border rounded bg-white text-gray-900" type="text" required />
                        </div>
                        
                        <div>
                            <label for="venue" class="block text-gray-700">Venue Name*</label>
                            <input id="venue" v-model="eventForm.venue"
                                class="w-full p-2 border rounded bg-white text-gray-900" type="text" required />
                        </div>

                        <div>
                            <label for="startTime" class="block text-gray-700">Start Time*</label>
                            <input id="startTime" v-model="eventForm.startTime"
                                class="w-full p-2 border rounded bg-white text-gray-900" type="datetime-local" required />
                        </div>

                        <div>
                            <label for="endTime" class="block text-gray-700">End Time*</label>
                            <input id="endTime" v-model="eventForm.endTime"
                                class="w-full p-2 border rounded bg-white text-gray-900" type="datetime-local" required />
                        </div>

                        <div>
                            <label for="address" class="block text-gray-700">Address*</label>
                            <input id="address" v-model="eventForm.address"
                                class="w-full p-2 border rounded bg-white text-gray-900" type="text" required />
                        </div>

                        <div>
                            <label for="money" class="block text-gray-700">Cost ($)</label>
                            <input id="money" v-model="eventForm.money"
                                class="w-full p-2 border rounded bg-white text-gray-900" 
                                type="number" step="0.01" min="0" />
                        </div>
                        <div>
                            <label for="shifts" class="block text-gray-700">Number of Employees</label>
                            <input id="shifts" v-model="eventForm.numberofemps"
                                class="w-half p-2 border rounded bg-white text-gray-900" 
                                type="number" step="1" min="0" />
                        </div>

                        <div>
                            <label class="block text-gray-700">Status</label>
                            <div class="mt-2">
                                <label class="inline-flex items-center mr-4">
                                    <input type="radio" v-model="eventForm.status" value="PENDING"
                                        class="form-radio" />
                                    <span class="ml-2 text-black">Pending</span>
                                </label>
                                <label class="inline-flex items-center mr-4">
                                    <input type="radio" v-model="eventForm.status" value="CONFIRMED"
                                        class="form-radio" />
                                    <span class="ml-2 text-black">Confirmed</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" v-model="eventForm.status" value="CANCELLED"
                                        class="form-radio" />
                                    <span class="ml-2 text-black">Cancelled</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label for="person" class="block text-gray-700">Contact Person</label>
                            <div class="grid grid-cols-3 gap-2">
                                <input placeholder="FirstName" v-model="eventForm.person.firstName"
                                    class="p-2 border rounded bg-white text-gray-900" type="text" />
                                <input placeholder="LastName" v-model="eventForm.person.lastName"
                                    class="p-2 border rounded bg-white text-gray-900" type="text" />
                                <input placeholder="Email" v-model="eventForm.person.email"
                                    class="p-2 border rounded bg-white text-gray-900" type="tel" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label for="note" class="block text-gray-700">Additional Notes</label>
                        <textarea id="note" v-model="eventForm.note"
                            class="w-full p-2 border rounded bg-white text-gray-900" rows="4"></textarea>
                    </div>

                    <div class="flex justify-end space-x-4">
                        <button @click="closeModal" type="button"
                            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            {{ isEdit ? 'Update Event' : 'Add Event' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>


        <!-- Shifts Management Modal -->
        <div v-if="showShiftsModal" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-20">
            <div class="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl text-violet-700 font-bold">Manage Event Shifts</h3>
                    <button @click="closeShiftsModal" class="text-gray-500 hover:text-gray-700">
                        <span class="text-2xl">&times;</span>
                    </button>
                </div>

                <div class="mb-4">
                    <button @click="addNewShift" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Add Shift
                    </button>
                </div>

                <table class="w-full border-collapse">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-2 text-black text-left border">Start Time</th>
                            <th class="px-4 py-2 text-black text-left border">End Time</th>
                            <th class="px-4 py-2 text-black text-left border">Employee</th>
                            <th class="px-4 py-2 text-black text-left border">Type</th>
                            <th class="px-4 py-2 text-black text-left border">Status</th>
                            <th class="px-4 py-2 text-black text-left border">Clock In/Out</th>
                            <th class="px-4 py-2 text-black text-left border">Hours</th>
                            <th class="px-4 py-2 text-black text-left border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="shift in eventShifts" :key="shift.id">
                            <td class="px-4 py-2 border">{{ formatDateTime(shift.startTime) }}</td>
                            <td class="px-4 py-2 border">{{ formatDateTime(shift.endTime) }}</td>
                            <td class="px-4 py-2 border">{{ shift.employeeName }}</td>
                            <td class="px-4 py-2 border">{{ shift.shiftType }}</td>
                            <td class="px-4 py-2 border">
                                <span :class="getShiftStatusClass(shift.status)">
                                    {{ shift.status }}
                                </span>
                            </td>
                            <td class="px-4 py-2 border">
                                <div>In: {{ shift.clockInTime ? formatDateTime(shift.clockInTime) : 'Not clocked in' }}</div>
                                <div>Out: {{ shift.clockOutTime ? formatDateTime(shift.clockOutTime) : 'Not clocked out' }}</div>
                            </td>
                            <td class="px-4 py-2 border">{{ shift.shiftHours.toFixed(2) }}</td>
                            <td class="px-4 py-2 border">
                                <button @click="editShift(shift)" 
                                    class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2">
                                    Edit
                                </button>
                                <button @click="deleteShift(shift.id)"
                                    class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Shift Edit Modal -->
        <div v-if="showShiftEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-30">
            <div class="bg-white p-6 rounded-lg w-1/2">
                <h3 class="text-xl text-violet-700 font-bold mb-4">
                    {{ isEditingShift ? 'Edit Shift' : 'Add Shift' }}
                </h3>
                <form @submit.prevent="handleShiftSubmit">
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-gray-700">Start Time</label>
                            <input v-model="shiftForm.startTime" type="datetime-local"
                                class="w-full p-2 border rounded" required />
                        </div>
                        <div>
                            <label class="block text-gray-700">End Time</label>
                            <input v-model="shiftForm.endTime" type="datetime-local"
                                class="w-full p-2 border rounded" required />
                        </div>
                        <div>
                            <label class="block text-gray-700">Employee</label>
                            <select v-model="shiftForm.employeeId"
                                class="w-full p-2 border rounded" required>
                                <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                                    {{ employee.name }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700">Shift Type</label>
                            <select v-model="shiftForm.shiftType"
                                class="w-full p-2 border rounded" required>
                                <option value="NORMAL">Normal</option>
                                <option value="STANDBY">Standby</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700">Status</label>
                            <select v-model="shiftForm.status"
                                class="w-full p-2 border rounded" required>
                                <option value="UNCONFIRMED">Unconfirmed</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button type="button" @click="closeShiftEditModal"
                            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                        <button type="submit"
                            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            {{ isEditingShift ? 'Update Shift' : 'Add Shift' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>


<script>
import axios from "axios";

export default {
    name: "ManageEvents",
    data() {
        return {
            events: [],
            showModal: false,
            isEdit: false,
            searchEvent: "",
            eventForm: {
                id: "",
                startTime: "",
                endTime: "",
                address: "",
                venue: "",
                description: "",
                money: 0,
                status: "PENDING",
                person: {
                    name: "",
                    email: ""
                },
                note: ""
            },
            showShiftsModal: false,
            showShiftEditModal: false,
            isEditingShift: false,
            eventShifts: [],
            employees: [],
            currentEventId: null,
            shiftForm: {
                id: null,
                startTime: "",
                endTime: "",
                employeeId: "",
                shiftType: "NORMAL",
                status: "UNCONFIRMED",
                clockInTime: null,
                clockOutTime: null,
                shiftHours: 0
            }
        };
    },
    computed: {
        filteredEvents() {
            const searchLower = this.searchEvent.toLowerCase();
            return this.events.filter(event =>
                event.description.toLowerCase().includes(searchLower) ||
                event.venue.toLowerCase().includes(searchLower) ||
                event.person.name.toLowerCase().includes(searchLower)
            );
        }
    },
    methods: {
        async loadEventShifts(eventId) {
            try {
                const shiftIds = this.events.find(e => e.id === eventId)?.shiftIds || [];
                const shiftPromises = shiftIds.map(id => 
                    axios.get(`${import.meta.env.VITE_APP_API_URL}/shifts/${id}`)
                );
                const responses = await Promise.all(shiftPromises);
                this.eventShifts = responses.map(r => r.data);
                await this.loadEmployees();
            } catch (error) {
                console.error("Error loading shifts:", error);
                alert("Failed to load shifts");
            }
        },

        async loadEmployees() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_GATEWAY}/employees`);
                this.employees = response.data;
            } catch (error) {
                console.error("Error loading employees:", error);
            }
        },

        openShiftsModal(eventId) {
            this.currentEventId = eventId;
            this.showShiftsModal = true;
            this.loadEventShifts(eventId);
        },

        closeShiftsModal() {
            this.showShiftsModal = false;
            this.currentEventId = null;
            this.eventShifts = [];
        },

        addNewShift() {
            this.isEditingShift = false;
            this.shiftForm = {
                id: null,
                startTime: "",
                endTime: "",
                employeeId: "",
                shiftType: "REGULAR",
                status: "SCHEDULED",
                clockInTime: null,
                clockOutTime: null,
                shiftHours: 0
            };
            this.showShiftEditModal = true;
        },

        editShift(shift) {
            this.isEditingShift = true;
            this.shiftForm = {
                ...shift,
                startTime: new Date(shift.startTime).toISOString().slice(0, 16),
                endTime: new Date(shift.endTime).toISOString().slice(0, 16)
            };
            this.showShiftEditModal = true;
        },

        closeShiftEditModal() {
            this.showShiftEditModal = false;
            this.isEditingShift = false;
        },

        async handleShiftSubmit() {
            try {
                const shiftData = {
                    ...this.shiftForm,
                    eventId: this.currentEventId
                };

                if (this.isEditingShift) {
                    await axios.put(`${import.meta.env.VITE_APP_API_GATEWAY}/shifts/${this.shiftForm.id}`, shiftData);
                } else {
                    await axios.post(`${import.meta.env.VITE_APP_API_GATEWAY}/shifts`, shiftData);
                }

                await this.loadEventShifts(this.currentEventId);
                this.closeShiftEditModal();
            } catch (error) {
                console.error("Error saving shift:", error);
                alert("Failed to save shift");
            }
        },

        async deleteShift(shiftId) {
            if (confirm("Are you sure you want to delete this shift?")) {
                try {
                    await axios.delete(`${import.meta.env.VITE_APP_API_GATEWAY}/shifts/${shiftId}`);
                    await this.loadEventShifts(this.currentEventId);
                } catch (error) {
                    console.error("Error deleting shift:", error);
                    alert("Failed to delete shift");
                }
            }
        },

        getShiftStatusClass(status) {
            const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
            const statusClasses = {
                'CONFIRMED': 'bg-blue-100 text-blue-800',
                'UNCOMFIRMED': 'bg-yellow-100 text-yellow-800',
                'CANCELLED': 'bg-red-100 text-red-800'
            }; 
            return `${baseClasses} ${statusClasses[status]}`;
        },

        formatDateTime(dateTime) {
            const date = new Date(dateTime);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        },

        getStatusClass(status) {
            const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
            const statusClasses = {
                'PENDING': 'bg-yellow-100 text-yellow-800',
                'CONFIRMED': 'bg-green-100 text-green-800',
                'CANCELLED': 'bg-red-100 text-red-800'
            };
            return `${baseClasses} ${statusClasses[status]}`;
        },

        async fetchEvents() {
            try {
                const response = await axios.get(import.meta.env.VITE_APP_API_GATEWAY + "/events");

                console.log('API response:', response);

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

        clearForm() {
            this.eventForm = {
                id: "",
                startTime: "",
                endTime: "",
                address: "",
                venue: "",
                description: "",
                money: 0,
                status: "PENDING",
                person: {
                    name: "",
                    email: ""
                },
                note: ""
            };
        },

        closeModal() {
            this.showModal = false;
            this.clearForm();
        },

        openModal(action, event = null) {
            this.isEdit = action === "edit";
            if (event) {
                const startTime = new Date(event.startTime);
                const endTime = new Date(event.endTime);
                this.eventForm = {
                    ...event,
                    startTime: startTime.toISOString().slice(0, 16),
                    endTime: endTime.toISOString().slice(0, 16)
                };
            } else {
                this.clearForm();
            }
            this.showModal = true;
        },

        async addEvent() {
            try {
                const newEvent = {
                    PartitionKey: "Event",
                    RowKey: null, // Let the server generate this if needed
                    StartTime: this.eventForm.startTime,
                    EndTime: this.eventForm.endTime,
                    Address: this.eventForm.address,
                    Venue: this.eventForm.venue,
                    Description: this.eventForm.description,
                    Money: this.eventForm.money,
                    Status: this.eventForm.status,
                    Person: {
                        firstName: this.eventForm.person.name.split(" ")[0] || "",
                        lastName: this.eventForm.person.name.split(" ")[1] || "",
                        email: this.eventForm.person.email || ""
                    },
                    Note: this.eventForm.note
                };

                await axios.post(import.meta.env.VITE_APP_API_GATEWAY + "/events", newEvent);
                await this.fetchEvents();
                this.closeModal();
                alert("Event added successfully!");
            } catch (error) {
                console.error("Error adding event:", error);
                alert("Failed to add the event.");
            }
        },

        async updateEvent() {
            try {
                const updateUrl = `${import.meta.env.VITE_APP_API_GATEWAY}/events/event-group-winter/${this.eventForm.id}`;

                const formatAsISO = (date) => {
                    const parsedDate = new Date(date);
                    return parsedDate.toISOString(); 
                };

                const updatedEvent = {
                    address: this.eventForm.address,
                    venue: this.eventForm.venue,
                    description: this.eventForm.description,
                    startTime: formatAsISO(this.eventForm.startTime),
                    endTime: formatAsISO(this.eventForm.endTime),
                    money: this.eventForm.money,
                    status: this.eventForm.status,
                    person: {
                        firstName: this.eventForm.person.firstName,
                        lastName: this.eventForm.person.lastName,
                        email: this.eventForm.person.email
                    },
                    note: this.eventForm.note,
                    shiftIDs: this.eventForm.shiftIDs
                };
                await axios.put(updateUrl, updatedEvent);
                await this.fetchEvents();
                this.closeModal();
                alert("Event updated successfully!");
            } catch (error) {
                console.error("Error updating event:", error);
                alert("Failed to update the event.");
            }
        },

        async deleteEvent(event) {
            if (confirm("Are you sure you want to delete this event?")) {
                try {
                    const deleteUrl = `${import.meta.env.VITE_APP_API_GATEWAY}/events/event-group-winter/${event.id}`;
                    await axios.delete(deleteUrl);
                    this.events = this.events.filter(e => e.id !== event.id);
                    alert("Event deleted successfully!");
                } catch (error) {
                    console.error("Error deleting event:", error);
                    alert("Failed to delete the event.");
                }
            }
        },

        handleSubmit() {
            if (this.isEdit) {
                this.updateEvent();
            } else {
                this.addEvent();
            }
        }
    },
    mounted() {
        this.fetchEvents();
    }
};
</script>