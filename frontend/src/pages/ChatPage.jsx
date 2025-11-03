import { useAuth } from "../contexts/AuthContext";

const ChatPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎓 AI Math Tutor
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Welcome, {user?.displayName || user?.email}!
          </p>
          <p className="text-gray-600 mb-8">
            The chat interface is coming in Task 1.3
          </p>
          <div className="inline-block bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-left">
            <h2 className="font-semibold text-indigo-900 mb-2">
              ✅ Authentication Complete!
            </h2>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>✓ Email/Password signup & login</li>
              <li>✓ Google sign-in</li>
              <li>✓ User profile in Firestore</li>
              <li>✓ Protected routes</li>
              <li>✓ Auth state persistence</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
