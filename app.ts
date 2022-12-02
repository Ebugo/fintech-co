import { readFileSync } from "fs";
import Gis from "./gis.helper";
import Publisher from "./publisher.helper";

const readCustomerRecords = readFileSync("customers.txt").toString();
const parsedCustomerRecords = readCustomerRecords.split("\n");
const eventLocation = [52.493256, 13.446082];
const range = 100; //! KM;
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
let invitees: string[] = [];

for (let index = 0; index < parsedCustomerRecords.length; index++) {
  const record = parsedCustomerRecords[index];
  let [id, latStr, longStr] = record.split(",");

  id = id.split(":")[1].trim();
  const lat = parseFloat(latStr.split(":")[1].trim());
  const long = parseFloat(longStr.split(":")[1].trim());
  const point = [lat, long];

  const distance = Gis.calculateDistance(eventLocation, point);

  if (!uuidRegex.test(id)) {
    console.log(`${id} is an invalid uuid!`);
    continue;
  }

  if (!lat || !long) {
    console.log(`Invalid location detected!`);
    continue;
  }

  if (distance <= range) {
    invitees.push(id);
  }
}

invitees.sort();
console.log();
console.log(parsedCustomerRecords.length, "records,", invitees.length, "invitees.");
Publisher.publish(invitees);
