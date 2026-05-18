import { redirect } from "next/navigation";

// QubitScan is the explorer. Root sends to the explorer surface; every
// internal link already uses /explorer/* paths.
export default function Index() {
  redirect("/explorer");
}
