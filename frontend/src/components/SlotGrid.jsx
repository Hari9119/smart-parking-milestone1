import React from "react";
import "./SlotGrid.css";

const SlotGrid = ({ slots = [] }) => {
  return (
    <div className="slot-grid">
      {slots.map((slot) => {
        // mentor used: slot.status === "available"
        // your API returns: slot.isAvailable (true/false)
        const isAvailable =
          typeof slot.isAvailable === "boolean"
            ? slot.isAvailable
            : slot.status === "available";

        return (
          <div
            key={slot._id || slot.slotNumber}
            className={`slot-box ${isAvailable ? "available" : "booked"}`}
          >
            {slot.slotNumber}
          </div>
        );
      })}
    </div>
  );
};

export default SlotGrid;
