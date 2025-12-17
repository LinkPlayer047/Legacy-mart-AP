import UserRow from "./UserRow";

export default function UsersTable({ users, refresh }) {
  return (
    <div className="overflow-x-auto bg-white shadow rounded">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <UserRow key={user._id} user={user} refresh={refresh} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
