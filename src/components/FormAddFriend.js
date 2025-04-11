import { useState } from "react";
import { Button } from "../Button";

// Component for the "Add Friend" form allowing user to add a new friend
export function FormAddFriend({ onAddFriend }) {
  // Local state to hold the new friend's name and image URL input values
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  // Handles the form submission
  function handleSubmit(e) {
    // Prevent page reload on form submission
    e.preventDefault();

    // Return if either name or image input is empty (basic validation)
    if (!name || !image) return;

    // Generate a unique ID for the new friend using the browser's crypto API
    const id = crypto.randomUUID();

    // Create a new friend object with default balance of 0
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`, // Appending unique query param to ensure unique image URL
      balance: 0,
    };

    // Pass new friend object to the parent component handler
    onAddFriend(newFriend);
    // Reset form inputs to initial state after submission
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      {/* Label and input for friend's name */}
      <label>მეგობრის სახელი</label>
      <input
        type="text"
        value={name}
        placeholder="ჩაწერე მეგობრის სახელი"
        onChange={(e) => setName(e.target.value)}
      />

      {/* Label and input for friend's image URL */}
      <label>სურათის Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      {/* Submit button to save the new friend */}
      <Button>შეინახე</Button>
    </form>
  );
}
