import { useAuth } from "../context/AuthContext";
const UserProfilePage = () => {
  const { user, profile } = useAuth();
  console.log("user", user, "profile", profile);

  return <div className="container">logged in as user:</div>;
};
export default UserProfilePage;
