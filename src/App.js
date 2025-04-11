
import { useState } from "react";
import { Header } from "./components/Header";
import { Modal } from "./components/Modal";
import { FriendList } from "./components/FriendList";
import { FormAddFriend } from "./components/FormAddFriend";
import { SplitBill } from "./components/SplitBill";
import { Button } from "./Button";


const initialFriends = [
  {
    id: 118836,
    name: "დათა",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7, // Negative balance indicates the user owes money to this friend.
  },
  {
    id: 933372,
    name: "ნანა",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20, // Positive balance indicates the friend owes money to the user.
  },
  {
    id: 499476,
    name: "განა",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0, // Zero balance indicates neither owes money.
  },
];

// Main App component which acts as the entry point of the application.
export default function App() {
  // State variable to track whether the "Add Friend" form should be visible.
  // Initially set to false (hidden).
  const [showAddFriend, setShowAddFriend] = useState(false);

  // State variable to store the list of friends.
  // It is initialized using the initialFriends array defined above.
  const [friends, setFriends] = useState(initialFriends);

  // State variable to keep track of the friend that is currently selected.
  // When a friend is selected, the SplitBill component is displayed.
  const [selectedFriend, setSelectedFriend] = useState(null);

  // State variable to manage the modal open/close state for confirming friend deletion.
  const [isModalOpen, setModalOpen] = useState(false);

  // State variable to temporarily hold the friend object that is about to be deleted.
  // This friend object is passed to the Modal component for confirmation.
  const [friendToDelete, setFriendToDelete] = useState(null);

  // Function to toggle the visibility of the "Add Friend" form.
  // It flips the current boolean state for showAddFriend.
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  // Function to add a new friend.
  // It accepts a friend object as argument and adds it to the friends state array.
  // Also, once a new friend is added, the Add Friend form is hidden.
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  // Function to handle the selection and deselection of a friend.
  // If the friend clicked is already selected, it is deselected (set to null).
  // Otherwise, it sets the friend as the selected friend.
  function handleSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
  }

  // Function to handle splitting the bill with the currently selected friend.
  // This function takes the split bill value (either positive or negative) and updates the friend's balance.
  // After updating, it resets the selectedFriend to null so that the SplitBill component will hide.
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

  // Function to initiate the deletion process for a friend.
  // It sets the friend that is to be deleted in state and opens the confirmation modal.
  function handleDeleteFriend(friend) {
    setFriendToDelete(friend);
    setModalOpen(true);
  }

  // Function that handles the confirmation of friend deletion.
  // It updates the friends array, removing the friend with the specified id.
  // Also, it checks whether the friend being deleted is currently selected and, if so, deselects them.
  // Finally, it resets the friendToDelete state and closes the modal.
  function handleConfirmDeleteFriend() {
    setFriends((friends) =>
      friends.filter((friend) => friend.id !== friendToDelete.id)
    );
    if (selectedFriend?.id === friendToDelete.id) {
      setSelectedFriend(null);
    }
    setFriendToDelete(null);
    setModalOpen(false);
  }

  // Function to cancel the deletion process.
  // It clears the friendToDelete state and closes the confirmation modal.
  function handleCancelDelete() {
    setFriendToDelete(null);
    setModalOpen(false);
  }

  // The return statement renders the component's UI.
  return (
    <div className="app">
      {/* Render the header of the app using the Header component */}
      <Header />

      {/* Conditionally render the Modal component if isModalOpen is true.
          The Modal receives:
            - friendToDelete: the friend object to be deleted,
            - onConfirmDelete: the callback function to confirm deletion,
            - onCancelDelete: the callback function to cancel deletion.
      */}
      {isModalOpen && (
        <Modal
          friendToDelete={friendToDelete}
          onConfirmDelete={handleConfirmDeleteFriend}
          onCancelDelete={handleCancelDelete}
        />
      )}

      {/* Sidebar section containing the friend list and adding friend UI */}
      <div className="sidebar">
        {/* Render the FriendList component.
            It receives:
              - friends: the current list of friends,
              - onSelectedFriend: function to manage friend selection/deselection,
              - selectedFriend: currently selected friend,
              - onDeleteFriend: function to trigger deletion of a friend.
        */}
        <FriendList
          friends={friends}
          onSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
          onDeleteFriend={handleDeleteFriend}
        />

        {/* Render a Button component to toggle the display of the "Add Friend" form.
            The text on the button changes depending on whether the form is open or closed.
        */}
        <Button className="close" onClick={handleShowAddFriend}>
          {showAddFriend ? "X" : "დაამატე მეგობარი"}
        </Button>

        {/* Conditionally render the FormAddFriend component if showAddFriend is true.
            The form's onAddFriend handler is passed to update the friends list.
        */}
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
      </div>

      {/* Conditionally render the SplitBill component if a friend is currently selected.
          It receives:
            - selectedFriend: the friend involved in bill splitting.
            - onSplitBill: the function that updates the bill balance after splitting.
      */}
      {selectedFriend && (
        <SplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}
