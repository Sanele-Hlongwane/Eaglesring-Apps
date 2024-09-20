"use client";

import { useEffect, useState } from 'react';

function FriendsList() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetch("/api/users/friends")
      .then((res) => res.json())
      .then((data) => setFriends(data));
  }, []);

  return (
    <div>
      {friends.map((friend) => (
        <div key={friend.id}>
          <p>{friend.name}</p>
          <img src={friend.imageUrl} alt={`${friend.name}'s avatar`} />
        </div>
      ))}
    </div>
  );
}

export default FriendsList;
