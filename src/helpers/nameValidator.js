import { getDatabase, ref, get, child } from 'firebase/database';

export async function nameValidator(name) {
  if (!name) return "Please fill in this field.";

  // Check if the username already exists in the database
  const db = getDatabase();
  const allUsersRef = ref(db, 'users');

  try {
    const snapshot = await get(allUsersRef);
    if (snapshot.exists()) {
      const allUsers = snapshot.val();
      const userExists = Object.values(allUsers).some(user => user.name === name);

      if (userExists) {
        return "Username already taken.";
      }
    }
  } catch (error) {
    console.error("Error checking username: ", error);
    return "Error checking username.";
  }

  return '';
}
