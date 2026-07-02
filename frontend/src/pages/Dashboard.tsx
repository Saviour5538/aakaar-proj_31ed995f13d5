import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDocuments, fetchConversations } from '../api/client';
import { Document, Conversation } from '../types';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const [documentCount, setDocumentCount] = useState<number>(0);
  const [conversationCount, setConversationCount] = useState<number>(0);
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const documentsResponse = await fetchDocuments();
        const conversationsResponse = await fetchConversations();

        setDocumentCount(documentsResponse.length);
        setConversationCount(conversationsResponse.length);

        setRecentDocuments(documentsResponse.slice(0, 5));
        setRecentConversations(conversationsResponse.slice(0, 5));
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        toast.error('Error fetching dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuickAction = (action: string) => {
    if (action === 'upload') {
      navigate('/upload');
    } else if (action === 'chat') {
      navigate('/chat');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold">Documents</h2>
              <p className="text-2xl font-bold">{documentCount}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold">Conversations</h2>
              <p className="text-2xl font-bold">{conversationCount}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
            <div className="bg-white shadow rounded-lg p-4">
              {recentDocuments.length > 0 ? (
                <ul>
                  {recentDocuments.map((doc) => (
                    <li key={doc.id} className="border-b last:border-none py-2">
                      {doc.filename} - {doc.status}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No recent documents.</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Recent Conversations</h2>
            <div className="bg-white shadow rounded-lg p-4">
              {recentConversations.length > 0 ? (
                <ul>
                  {recentConversations.map((conv) => (
                    <li key={conv.id} className="border-b last:border-none py-2">
                      {conv.title} - {new Date(conv.created_at).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No recent conversations.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleQuickAction('upload')}
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
              >
                Upload Document
              </button>
              <button
                onClick={() => handleQuickAction('chat')}
                className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
              >
                Start Chat
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;