import { Friend } from "./Friend";

export function FriendList({
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
