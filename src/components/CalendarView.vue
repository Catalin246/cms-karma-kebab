<template>
    <div class="calendar-view space-y-6">
      <h2 class="text-2xl font-bold text-black">Schedule Overview</h2>
      <div class="bg-white rounded-lg shadow border p-6">
        <!-- Navigation for Months -->
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
        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
            :key="day"
            class="text-center font-bold p-2 text-black"
          >
            {{ day }}
          </div>
          <div
            v-for="date in calendarDates"
            :key="date.date"
            class="border p-2 min-h-24 relative">
            <div class="font-bold text-black">{{ date.dayOfMonth }}</div>
            <div
                v-for="event in date.events"
                :key="event.id"
                class="bg-blue-100 p-1 mb-1 rounded text-sm text-black"
            >
                {{ event.description }}
            </div>
        </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc";
  import isBetween from "dayjs/plugin/isBetween";
  dayjs.extend(utc);
  dayjs.extend(isBetween);

  
  export default {
    data() {
      return {
        currentDate: dayjs(),
        events: [],
        loading: false,
        error: null,
      };
    },
    computed: {
      currentMonthYear() {
        return this.currentDate.format("MMMM YYYY");
      },
      calendarDates() {
        const startOfMonth = this.currentDate.startOf("month");
        const endOfMonth = this.currentDate.endOf("month");

        const startDate = startOfMonth.startOf("week");
        const endDate = endOfMonth.endOf("week");

        const dates = [];
        let current = startDate;

        while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
            const dayOfMonth = current.date();

            // Filter events based on whether the current date falls within the event's start and end date range
            const events = this.events.filter(event => {
                const eventStart = dayjs(event.startTime);
                const eventEnd = dayjs(event.endTime);

                return current.isBetween(eventStart, eventEnd, "day", "[]"); // Inclusive range
            });

            dates.push({
                date: current.format("YYYY-MM-DD"),
                dayOfMonth,
                events,
            });

            current = current.add(1, "day");
        }

        return dates;
    },

    },
    methods: {
      async fetchEvents() {
      try {
          const response = await httpClient.get('/events', {
              params: { 
                  month: this.currentDate.format("YYYY-MM") 
              }
          });

          // Ensure startTime and endTime are parsed with UTC
          this.events = response.data.data.map(event => ({
              id: event.rowKey,
              description: event.description || "No description",
              startTime: dayjs.utc(event.startTime),  // Use utc() to handle UTC dates
              endTime: dayjs.utc(event.endTime),      // Same for endTime
              address: event.address,
          }));
      } catch (err) {
          console.error("Failed to fetch events:", err);
      }
  },
      previousMonth() {
        this.currentDate = this.currentDate.subtract(1, "month");
        this.fetchEvents();
      },
      nextMonth() {
        this.currentDate = this.currentDate.add(1, "month");
        this.fetchEvents();
      },
    },
    mounted() {
      this.fetchEvents();
    },
  };
  </script>
  