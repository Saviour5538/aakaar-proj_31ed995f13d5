import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDocuments, deleteDocument } from '../api/client';

interface Document {
  id: number;
  user_id: number;
  filename: string;
  status: string;
  chunk_count: number;
  created_at: string;
}

const DocumentsList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDocuments();
      setDocuments(response);
    } catch (err) {
      setError('Failed to fetch documents.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDocument(id);
      fetchDocuments();
    } catch (err) {
      setError('Failed to delete document.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Documents</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate('/documents/new')}
        >
          Add New
        </button>
      </div>
      <input
        type="text"
        placeholder="Search by filename"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {!loading && !error && (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Filename</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Chunk Count</th>
              <th className="border border-gray-300 px-4 py-2">Created At</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc) => (
              <tr key={doc.id}>
                <td className="border border-gray-300 px-4 py-2">{doc.id}</td>
                <td className="border border-gray-300 px-4 py-2">{doc.filename}</td>
                <td className="border border-gray-300 px-4 py-2">{doc.status}</td>
                <td className="border border-gray-300 px-4 py-2">{doc.chunk_count}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(doc.created_at).toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mr-2"
                    onClick={() => handleDelete(doc.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DocumentsList;