import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white">
      <nav>
        <ul>
          <li>
            <Link href="/dashboard/entrepreneur">Overview</Link>
          </li>
          <li>
            <Link href="/dashboard/entrepreneur/pitches">Pitches</Link>
          </li>
          <li>
            <Link href="/dashboard/entrepreneur/feedback">Feedback</Link>
          </li>
          <li>
            <Link href="/dashboard/entrepreneur/notifications">
              Notifications
            </Link>
          </li>
          <li>
            <Link href="/dashboard/entrepreneur/events">Upcoming Events</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
