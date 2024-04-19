import React, { useState, useEffect } from "react";
import * as client from "./client";
import axios from "axios";
import { User } from "./client";
import { BsFillCheckCircleFill, BsPencil,
  BsTrash3Fill, BsPlusCircleFill } from "react-icons/bs";
axios.defaults.withCredentials = true;

export default function UserTable() {
  const [error, setError] = useState("");
  const [complete, setComplete] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>({
    _id: "", username: "", password: "", firstName: "", lastName: "", email: "", role: "", dob: new Date() });
  
  const createUser = async () => {
    try {
      const newUser = await client.createUser(user);
      setUsers([newUser, ...users]);
      setComplete("Successfully created user.");
      setError("");
    } catch (err: any) {
      setComplete("");
      setError(err.response.data);
      console.log(err);
    }
  };

  const deleteUser = async (user: User) => {
    try {
      await client.deleteUser(user);
      setUsers(users.filter((u) => u._id !== user._id));
      setComplete("Successfully deleted user.");
      setError("");
    } catch (err) {
      setComplete("");
      setError(error);
      console.log(err);
    }
  };

  const selectUser = async (user: User) => {
    try {
      const u = await client.findUserById(user._id);
      setUser(u);
      setComplete("");
    } catch (err) {
      setComplete("");
      setError(error);
      console.log(err);
    }
  };

  const updateUser = async () => {
    try {
      if (!user._id) {
        throw new Error("select an user to update first")
      }
      const status = await client.updateUser(user._id, user);
      setUsers(users.map((u) =>
        (u._id === user._id ? user : u)));
      setComplete("Successfully updated user.");
      setError("");
    } catch (err: any) {
      setComplete("");
      if (err.response && err.response.data.message) {

        setError(err.response.data.message);
      } else {
        setError(err.message);
      }
      console.log(err);
    }
  };

  const [role, setRole] = useState("USER");
  const fetchUsersByRole = async (role: string) => {
    const users = await client.findUsersByRole(role);
    setRole(role);
    setUsers(users);
  };

  const fetchUsers = async () => {
    const users = await client.findAllUsers();
    setUsers(users);
  };
  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="container-fluid">
      <select
        onChange={(e) => fetchUsersByRole(e.target.value)}
        value={role || "USER"}
        className="form-select w-25 float-end mt-2">
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>

      <h1>User Table</h1>
      {error && <div className="alert alert-danger my-1">{error}</div>}
      {complete && <div className="alert alert-success my-1">{complete}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>&nbsp;</th>

          </tr>
          <tr>
            <td>
              <input value={user.username} className="me-2" onChange={(e) =>
                setUser({ ...user, username: e.target.value })} placeholder="username"/>
              <input value={user.password} type="password" onChange={(e) =>
                setUser({ ...user, password: e.target.value })} placeholder="password"/>
            </td>
            <td>
              <input value={user.firstName} onChange={(e) =>
                setUser({ ...user, firstName: e.target.value })}/>
            </td>
            <td>
              <input value={user.lastName} onChange={(e) =>
                setUser({ ...user, lastName: e.target.value })}/>
            </td>
            <td>
              <select className="me-2" value={user.role} onChange={(e) =>
                setUser({ ...user, role: e.target.value })}>
                <option value="USER">User</option>
                <option value="PREMIUM_USER">Premium User</option>
                <option value="ADMIN">Admin</option>
              </select>   
            </td>
            <td>
              <BsFillCheckCircleFill
                onClick={updateUser} className="me-2 text-success fs-1 text"/>
              <BsPlusCircleFill className="fs-1 text-success" onClick={createUser}/>
            </td>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.role}</td>
              <td>
                <button className="btn btn-danger me-2" onClick={() => deleteUser(user)}>
                  <BsTrash3Fill />
                </button>
                <button className="btn btn-warning me-2">
                  <BsPencil onClick={() => selectUser(user)} />
                </button>
              </td>
            </tr>))}
        </tbody>
      </table>
    </div>
  );
}
