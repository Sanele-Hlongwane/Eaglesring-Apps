import { Investment, Feedback, Interest, Notification } from '@prisma/client';

interface InvestmentOverviewProps {
  investments: Investment[];
  feedbacks: Feedback[];
  interests: Interest[];
  notifications: Notification[];
}

const InvestmentOverview: React.FC<InvestmentOverviewProps> = ({ investments, feedbacks, interests, notifications }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Investment Overview</h2>

      <section className="mb-6">
        <h3 className="text-lg font-semibold">My Investments</h3>
        <ul>
          {investments.map((investment) => (
            <li key={investment.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-medium">{investment.title}</span>
                <span>${investment.amount.toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold">My Feedbacks</h3>
        <ul>
          {feedbacks.map((feedback) => (
            <li key={feedback.id} className="mb-2">
              <div className="flex flex-col">
                <p className="font-medium">Pitch ID: {feedback.pitchId}</p>
                <p>{feedback.content}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold">My Interests</h3>
        <ul>
          {interests.map((interest) => (
            <li key={interest.id} className="mb-2">
              <div className="flex flex-col">
                <p className="font-medium">Pitch ID: {interest.pitchId}</p>
                <p>Interested since: {new Date(interest.createdAt).toLocaleDateString()}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Notifications</h3>
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className="mb-2">
              <div className="flex flex-col">
                <p className="font-medium">Content: {notification.content}</p>
                <p className="text-sm text-gray-500">Created at: {new Date(notification.createdAt).toLocaleDateString()}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default InvestmentOverview;
