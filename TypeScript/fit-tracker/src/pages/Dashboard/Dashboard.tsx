import { JSX, useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "../../static/Sidebar";
import Main from "../../components/Main/Main";

export default function Dashboard(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />
      <Main className="flex items-center justify-center bg-gray-900">
        <Outlet />
      </Main>
    </div>
  );
}
