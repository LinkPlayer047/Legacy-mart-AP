import StatusBadge from "./StatusBadges";

export default function UserRow({ user, refresh }) {
  const updateUser = async (payload) => {
    const token = document.cookie
      .split("; ")
      .find(r => r.startsWith("adminToken="))
      ?.split("=")[1];

    await fetch(`https://legacy-mart.vercel.app/api/users/${user._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    refresh();
  };

  return (
    <tr className="border-b">
      <td className="p-3">{user.name}</td>
      <td className="p-3">{user.email}</td>
      <td className="p-3">{user.role}</td>
      <td className="p-3">
        <StatusBadge status={user.status} />
      </td>
      <td className="p-3 text-center">
        <button
          onClick={() =>
            updateUser({
              status: user.status === "active" ? "blocked" : "active",
            })
          }
          className="text-blue-600"
        >
          {user.status === "active" ? "Block" : "Unblock"}
        </button>
      </td>
    </tr>
  );
}
