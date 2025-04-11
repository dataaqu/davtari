// Importing the useState hook from React to manage state in the functional component
import { useState } from "react";
import { Header } from "./components/Header";

// Initial data for friends list with id, name, image URL and balance details
const initialFriends = [
  {
    id: 118836,
    name: "დათა",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7, // negative balance means you owe money to this friend
  },
  {
    id: 933372,
    name: "ნანა",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20, // positive balance means this friend owes you money
  },
  {
    id: 499476,
    name: "მანა",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0, // zero balance means nothing is owed either way
  },
];

// A reusable Button component which renders a button element
// It takes "children" (to display inside the button) and an "onClick" handler as props.
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

// Main App component that holds the state and renders the main UI
export default function App() {
  // State to toggle the "Add Friend" form visibility
  const [showAddFriend, setShowAddFriend] = useState(false);
  // State holding the list of friends, initialized with the initialFriends array
  const [friends, setFriends] = useState(initialFriends);
  // State for the currently selected friend for splitting the bill
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Function to toggle the display of the "Add Friend" form
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  // Function to add a new friend to the friends state array and hide the form
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  // Function to set or deselect a friend when clicked.
  // If the same friend is clicked, it deselects them.
  function handleSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
  }

  // Function to update a friend's balance after splitting the bill,
  // then resets the selected friend
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  function handleDeleteFriend(friendToDelete) {
    const confirmDelete = window.confirm(
      `ნამდვილად გსურს ${friendToDelete.name}-ის წაშლა?`
    );
    if (!confirmDelete) return;

    setFriends((friends) =>
      friends.filter((friend) => friend.id !== friendToDelete.id)
    );
    if (selectedFriend?.id === friendToDelete.id) {
      setSelectedFriend(null);
    }
  }

  return (
    <div className="app">
      {/* Render the header of the app */}
      <Header />

      <div className="sidebar">
        {/* Render a list of friends and pass down relevant props */}
        <FriendList
          friends={friends}
          onSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
          onDeleteFriend={handleDeleteFriend}
        />

        {/* Button to toggle the "Add Friend" form */}
        <Button className="close" onClick={handleShowAddFriend}>
          {showAddFriend ? "X" : "დაამატე მეგობარი"}
        </Button>

        {/* Conditionally render the Add Friend form when showAddFriend is true */}
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
      </div>

      {/* Conditionally render the SplitBill component only when a friend is selected */}
      {selectedFriend && (
        <SplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

// Component to display the list of friends
function FriendList({
  friends,
  selectedFriend,
  onSelectedFriend,
  onDeleteFriend,
}) {
  return (
    <ul>
      {/* Loop over each friend and render a Friend component */}
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectedFriend={onSelectedFriend}
          selectedFriend={selectedFriend}
          onDeleteFriend={onDeleteFriend}
        />
      ))}
    </ul>
  );
}

// Component to display an individual friend item in the list
function Friend({ friend, selectedFriend, onSelectedFriend, onDeleteFriend }) {
  // Check if the current friend is selected by comparing the IDs
  const isSelected = selectedFriend?.id === friend.id;

  return (
    // Apply "selected" class if the friend is selected, for CSS styling
    <li className={isSelected ? "selected" : ""}>
      {/* Display friend's image and name */}
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {/* Display message if you owe money (negative balance) */}
      {friend.balance < 0 && (
        <p className="red">
          შენ გაქ {friend.name}-ს ვალი {Math.abs(friend.balance)}₾
        </p>
      )}

      {/* Display message if the friend owes you money (positive balance) */}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name}-ს აქვს შენი ვალი {Math.abs(friend.balance)}₾
        </p>
      )}

      {/* Display message if balance is zero */}
      {friend.balance === 0 && <p>{friend.name}-ს და შენ არ გაქვთ ვალი</p>}

      {/* Button to select/deselect the friend for splitting the bill */}

      <Button onClick={() => onSelectedFriend(friend)}>
        {isSelected ? "მოხსენი" : "აირჩიე"}
      </Button>

      <Button onClick={() => onDeleteFriend(friend)}>წაშალე</Button>
    </li>
  );
}

// Component for the "Add Friend" form allowing user to add a new friend
function FormAddFriend({ onAddFriend }) {
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

// Component for splitting the bill between you and a selected friend
function SplitBill({ selectedFriend, onSplitBill }) {
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
