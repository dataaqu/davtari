import { Button } from "../Button";

export function Friend({
  friend,
  selectedFriend,
  onSelectedFriend,
  onDeleteFriend,
}) {
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
