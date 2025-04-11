import { useState } from "react";
import { Button } from "../Button";

// Component for splitting the bill between you and a selected friend
export function SplitBill({ selectedFriend, onSplitBill }) {
  // Local state to hold the total bill amount entered by the user
  const [bill, setBill] = useState("");
  // Local state to hold the amount that the user pays
  const [myBill, setMyBill] = useState("");
  // Local state to choose who is paying: "user" means you pay the friend's share, "friend" means the friend pays your share
  const [payer, setPayer] = useState("user");

  // Calculate the friend's share by subtracting the user's share from the total bill
  // If bill is falsy (like an empty string), friendsBill will be an empty string.
  const friendsBill = bill ? bill - myBill : "";

  // Handle the form submission to split the bill
  function handleSubmit(e) {
    e.preventDefault();

    // Basic validation: both bill and user's share must be provided
    if (!bill || !myBill) return;

    // If the current user is paying, calculate friend's balance update accordingly,
    // Otherwise (if friend is paying), update with the negative value of user's share.
    onSplitBill(payer === "user" ? friendsBill : -myBill);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>
        გაიყავი ჭამა-სმისას ფული <span>{selectedFriend.name}</span> ს - თან{" "}
      </h2>{" "}
      <br />
      {/* Header showing which friend is splitting the bill */}
      {/* Input for the total bill amount */}
      <div></div>
      <label>ანგარიში</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      {/* Input for the amount you paid */}
      <label>შენი ხარჯი</label>
      <input
        type="text"
        value={myBill}
        onChange={(e) =>
          // Ensure the value you input does not exceed the total bill; if it does, keep the previous value.
          setMyBill(
            Number(e.target.value) > bill ? myBill : Number(e.target.value)
          )
        }
      />
      {/* Display the calculated amount for the friend (disabled since it's auto-calculated) */}
      <label>მეგობრის ხარჯი</label>
      <input type="text" disabled value={friendsBill} />
      {/* Dropdown selector to choose who is paying */}
      <label>ვინ იხდის ?</label>
      <select value={payer} onChange={(e) => setPayer(e.target.value)}>
        <option value="user">შენ</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>გაიყავით</Button>
    </form>
  );
}
