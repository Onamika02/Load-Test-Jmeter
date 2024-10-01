import https from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";
import papaparse from "/D:/Session/Session/PapaParse-5.0.2/papaparse.js";

const csvData = new SharedArray("loginCredentials", function () {
  return papaparse.parse(
    open("/D:/Session/Session/Login Credential - Sheet1.csv"),
    { header: true }
  ).data;
});

export function appointment_booking() {
  const headers1 = {
    "Content-Type": "application/json",
    Connection: "keep-alive",
  };

  //patient login

  let userIndex = (__VU - 1) % csvData.length;
  let user = csvData[userIndex];

  let mobile = user.mobile;
  let password = user.password;

  let url1 = "https://api-stage.shukhee.com/patient/login";
  let payload = JSON.stringify({ mobile: mobile, password: password });
  let res1 = https.post(url1, payload, { headers: headers1 });

  check(res1, {
    "Patient- Login successful": (r) => r.status === 201,
  });

  let accessToken = res1.json("accessToken");

  //sleep(10);

  //get current appointments

  let url2 =
    "https://api-stage.shukhee.com/appointment/current?app_id=shukhee&app_secret=shukhee";

  const headers2 = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    Connection: "keep-alive",
  };

  let res2 = https.get(url2, { headers: headers2 });

  check(res2, {
    "Patient-Appointment fetched successfully": (r) => r.status === 200,
  });

  //sleep(10);

  //Get Slider

  let url3 =
    "https://api-stage.shukhee.com/slider/all?app_id=shukhee&app_secret=shukhee";

  let res3 = https.get(url3, { headers: headers2 });

  check(res3, {
    "Patient-Slider fetched successfully": (r) => r.status === 200,
  });
  //sleep(10);

  //get Specialities

  let url4 =
    "https://api-stage.shukhee.com/doctor/specialties?app_id=shukhee&app_secret=shukhee";

  let res4 = https.get(url4, { headers: headers2 });

  check(res4, {
    "Patient-Specialities fetched successfully": (r) => r.status === 200,
  });
  //sleep(10);


  //Search Available Docvtors

  let url5 =
    "https://api-stage.shukhee.com/doctor/available-doctors?app_id=shukhee&app_secret=shukhee";
  let res5 = https.get(url5, { headers: headers2 });

  check(res5, {
    "Patient-Successfully search available doctors": (r) => r.status === 200,
  });

 // sleep(10);

  //get available Doctors

  const params1 = {
    size: "10",
  };
  const queryString1 = Object.keys(params1)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params1[key])}`
    )
    .join("&");

  let url6 = `https://api-stage.shukhee.com/doctor/available-doctors?app_id=shukhee&app_secret=shukhee&${queryString1}`;
  let res6 = https.get(url6, { headers: headers2 });

  check(res6, {
    "Patient-Successfully fetched available doctors": (r) => r.status === 200,
  });
  //sleep(10);

  //Get Doctor Schedules
  let id = 1; //doctor id

  const params2 = {
    date: "2024-07-10",
  };
  const queryString2 = Object.keys(params2)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params2[key])}`
    )
    .join("&");

  let url7 = `https://api-stage.shukhee.com/appointment/doctor/${id}/schedule?app_id=shukhee&app_secret=shukhee&${queryString2}`;
  let res7 = https.get(url7, { headers: headers2 });

  check(res7, {
    "Patient-Successfully fetched doctor schedules": (r) => r.status === 200,
  });
 
  //sleep(10);

  //checkout

  let headers3 = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    Connection: "keep-alive",
  };

  let scheduleStart = new Date("2024-08-25T21:05:00Z").toISOString();
  let scheduleEnd = new Date("2024-08-25T21:15:00Z").toISOString();

  let patientDetails = {
    fullName: "Malek Mia",
    age: 36,
    gender: "Male",
    problems: "Stomach Pain",
    mobile: mobile,
    weight: 96,
  };

  const params3 = {
    doctorId: parseInt(id, 10), // Ensure doctorId is an integer
    scheduleStart: scheduleStart,
    scheduleEnd: scheduleEnd,
    patientDetails: patientDetails,
  };

  let url8 = `https://api-stage.shukhee.com/appointment/checkout?app_id=shukhee&app_secret=shukhee`;
  let res8 = https.post(url8, JSON.stringify(params3), { headers: headers3 });

  check(res8, {
    "Patient-Successfully Appointment Created": (r) => r.status === 201,
  });

  //sleep(100);

}
