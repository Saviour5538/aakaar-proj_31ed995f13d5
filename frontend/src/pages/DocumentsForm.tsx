import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDocuments, uploadDocument } from '../api/client';

interface DocumentFormValues {
  filename: string;
  status: string;
  chunk_count: number;
}

const DocumentsForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [formValues, setFormValues] = useState<DocumentFormValues>({
    filename: '',
    status: '',
    chunk_count: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchDocument = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getDocuments();
      const document = response.find((doc) => doc.id === parseInt(id));
      if (document) {
        setFormValues({
          filename: document.filename,
          status: document.status,
          chunk_count: document.chunk_count,
        });
      }
    } catch (err) {
      setError('Failed to fetch document.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await uploadDocument(formValues);
      navigate('/documents');
    } catch (err) {
      setError('Failed to save document.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'chunk_count' ? parseInt(value) : value,
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Document' : 'Add Document'}</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="filename">
            Filename
          </label>
          <input
            type="text"
            id="filename"
            name="filename"
            value={formValues.filename}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formValues.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Status</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="chunk_count">
            Chunk Count
          </label>
          <input
            type="number"
            id="chunk_count"
            name="chunk_count"
            value={formValues.chunk_count}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentsForm;