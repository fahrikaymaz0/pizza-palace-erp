'use client';

import { useState, useEffect } from 'react';

interface ColumnDefinition {
  name: string;
  type: 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB' | 'BOOLEAN' | 'DATE';
  nullable?: boolean;
  primaryKey?: boolean;
  autoIncrement?: boolean;
}

interface DataManagementProps {
  clientId: string;
  tableName: string;
}

export default function DataManagement({ clientId, tableName }: DataManagementProps) {
  const [data, setData] = useState<any[]>([]);
  const [schema, setSchema] = useState<ColumnDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Verileri ve şemayı yükle
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Şemayı yükle
      const schemaResponse = await fetch(`/api/clients/${clientId}/tables/${tableName}`);
      const schemaResult = await schemaResponse.json();
      
      if (schemaResult.success) {
        setSchema(schemaResult.data.columns);
      }

      // Verileri yükle
      const dataResponse = await fetch(`/api/clients/${clientId}/tables/${tableName}/data`);
      const dataResult = await dataResponse.json();
      
      if (dataResult.success) {
        setData(dataResult.data);
      }
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [clientId, tableName]);

  const handleAddData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/clients/${clientId}/tables/${tableName}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Veri başarıyla eklendi!' });
        setShowAddForm(false);
        setFormData({});
        loadData();
      } else {
        setMessage({ type: 'error', text: result.error || 'Bir hata oluştu' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bağlantı hatası' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteData = async (id: any) => {
    if (!confirm('Bu veriyi silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/clients/${clientId}/tables/${tableName}/data?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Veri başarıyla silindi!' });
        loadData();
      } else {
        setMessage({ type: 'error', text: result.error || 'Bir hata oluştu' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bağlantı hatası' });
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getInputType = (column: ColumnDefinition) => {
    switch (column.type) {
      case 'INTEGER':
      case 'REAL':
        return 'number';
      case 'BOOLEAN':
        return 'checkbox';
      case 'DATE':
        return 'date';
      default:
        return 'text';
    }
  };

  const formatValue = (value: any, column: ColumnDefinition) => {
    if (value === null || value === undefined) return '-';
    
    switch (column.type) {
      case 'BOOLEAN':
        return value ? 'Evet' : 'Hayır';
      case 'DATE':
        return new Date(value).toLocaleDateString('tr-TR');
      default:
        return String(value);
    }
  };

  if (loading && data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Veriler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Başlık ve Butonlar */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {tableName} Tablosu
          </h3>
          <p className="text-sm text-gray-600">
            {data.length} kayıt bulundu
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
        >
          {showAddForm ? 'İptal' : 'Yeni Veri Ekle'}
        </button>
      </div>

      {/* Veri Ekleme Formu */}
      {showAddForm && (
        <div className="card p-6 mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Yeni Veri Ekle</h4>
          
          <form onSubmit={handleAddData} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schema
                .filter(col => !col.autoIncrement) // Auto-increment alanları gizle
                .map((column) => (
                  <div key={column.name}>
                    <label htmlFor={column.name} className="block text-sm font-medium text-gray-700 mb-1">
                      {column.name} {!column.nullable && '*'}
                    </label>
                    
                    {column.type === 'BOOLEAN' ? (
                      <input
                        type="checkbox"
                        id={column.name}
                        checked={formData[column.name] || false}
                        onChange={(e) => handleFormChange(column.name, e.target.checked)}
                        className="mr-2"
                      />
                    ) : (
                      <input
                        type={getInputType(column)}
                        id={column.name}
                        value={formData[column.name] || ''}
                        onChange={(e) => handleFormChange(column.name, e.target.value)}
                        required={!column.nullable}
                        className="input-field"
                        placeholder={`${column.name} girin`}
                      />
                    )}
                  </div>
                ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Ekleniyor...' : 'Veri Ekle'}
            </button>
          </form>
        </div>
      )}

      {/* Veri Tablosu */}
      {data.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                {schema.map((column) => (
                  <th key={column.name}>
                    {column.name}
                    {column.primaryKey && ' 🔑'}
                  </th>
                ))}
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {data.map((row, index) => (
                <tr key={index} className="table-row">
                  {schema.map((column) => (
                    <td key={column.name} className="table-cell">
                      {formatValue(row[column.name], column)}
                    </td>
                  ))}
                  <td className="table-cell">
                    <button
                      onClick={() => handleDeleteData(row.id || row[schema.find(col => col.primaryKey)?.name || 'id'])}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">Henüz veri bulunmuyor.</p>
        </div>
      )}

      {/* Mesajlar */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
} 