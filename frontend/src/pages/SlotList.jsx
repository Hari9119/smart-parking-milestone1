import React, { useEffect, useState } from "react";
import SlotGrid from "../components/SlotGrid";

const API = "http://localhost:5000/api/slots/all";

export default function SlotList() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>🚗 Parking Slot Dashboard</h1>
      <p>Green = Available | Red = Booked</p>
      {loading ? <p>Loading…</p> : <SlotGrid slots={slots} />}
    </div>
  );
}
