import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import api from "../api";

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [liveFeed, setLiveFeed] = useState([]);

  useEffect(() => {
    api.get("/attendance/report").then((res) => setLogs(res.data));

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe("/topic/attendance", (msg) => {
          const data = JSON.parse(msg.body);
          setLiveFeed((prev) => [data, ...prev].slice(0, 10));
        });
      },
    });
    client.activate();

    return () => client.deactivate();
  }, []);

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>

      <h3>Live Feed</h3>
      <ul>
        {liveFeed.map((item, i) => (
          <li key={i}>{item.user} checked in at {item.time}</li>
        ))}
      </ul>

      <h3>Attendance Report</h3>
      <table>
        <thead>
          <tr><th>User</th><th>Check-in</th><th>Check-out</th><th>Status</th></tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.user?.name}</td>
              <td>{log.checkInTime}</td>
              <td>{log.checkOutTime || "-"}</td>
              <td>{log.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
