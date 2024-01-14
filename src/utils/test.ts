import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

// Practitioner's time zone
const practitionerTimeZone = 'Africa/Lagos'; // for example

// Patient's time zone
const patientTimeZone = 'America/New_York'; // for example

// Practitioner sets availability (in their local time)
let availability = '2024-01-01 10:00:00';

// Convert to UTC before storing in database
let availabilityUTC = zonedTimeToUtc(availability, practitionerTimeZone);

// When displaying to patient, convert to patient's local time
let availabilityLocal = utcToZonedTime(availabilityUTC, patientTimeZone);

// Patient schedules appointment, convert back to UTC
let appointmentUTC = zonedTimeToUtc(availabilityLocal, patientTimeZone);

// When displaying to practitioner, convert back to practitioner's local time
let appointmentLocal = utcToZonedTime(appointmentUTC, practitionerTimeZone);
