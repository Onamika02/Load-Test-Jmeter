import { appointment_booking } from "./appointment_booking.js";

export const options = {
  // scenarios: {
  //   appointment_booking: {
  //     executor: "ramping-vus",
  //     startVUs: 1,
  //     exec: "appointment_booking_func",
  //     stages: [
  //       { duration: "30s", target: 50 }, 
  //       { duration: "2m", target: 100 },
  //       { duration: "30s", target: 1 },
  //     ],
  //   },
  // },
  scenarios:{
    appointment_booking :{
      executor: 'constant-arrival-rate',
      rate: 10,
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 30,
      maxVUs: 100,
    },

  },
  // iterations: 1,
  // vus: 100,
  // duration: "3m",
  cloud: {
    projectID: "3715327",
    name: "K6 Session",
  },
};

export default function appointment_booking_func() {
  appointment_booking();
}

