'use client';

import { useState, useEffect } from 'react';

interface ColumnDefinition {
  name: string;
  type: 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB' | 'BOOLEAN' | 'DATE';
  nullable?: boolean;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  unique?: boolean;
  defaultValue?: any;
}

interface TableSchema {
  name: string;
  columns: ColumnDefinition[];
}

interface TableManagementProps {
  clientId: string;
  onTableSelected: (tableName: string) => void;
  currentTable: string | null;
}

export default function TableManagement({ clientId, onTableSelected, currentTable }: TableManagementProps) {
  const [tables, setTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<TableSchema>({
    name: '',
    columns: [{ name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true }]
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Tabloları yükle
  const loadTables = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/clients/${clientId}/tables`);
      const result = await response.json();
      
      if (result.success) {
        setTables(result.data);
      }
    } catch (error) {
      console.error('Tablolar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, [clientId]);

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/clients/${clientId}/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Tablo başarıyla oluşturuldu!' });
        setShowCreateForm(false);
        setFormData({
          name: '',
          columns: [{ name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true }]
        });
        loadTables();
      } else {
        setMessage({ type: 'error', text: result.error || 'Bir hata oluştu' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bağlantı hatası' });
    } finally {
      setLoading(false);
    }
  };

  const addColumn = () => {
    setFormData(prev => ({
      ...prev,
      columns: [...prev.columns, { name: '', type: 'TEXT' }]
    }));
  };

  const removeColumn = (index: number) => {
    setFormData(prev => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index)
    }));
  };

  const updateColumn = (index: number, field: keyof ColumnDefinition, value: any) => {
    setFormData(prev => ({
      ...prev,
      columns: prev.columns.map((col, i) => 
        i === index ? { ...col, [field]: value } : col
      )
    }));
  };

  const getTypeOptions = () => [
    { value: 'TEXT', label: 'Metin' },
    { value: 'INTEGER', label: 'Sayı' },
    { value: 'REAL', label: 'Ondalık' },
    { value: 'BOOLEAN', label: 'Evet/Hayır' },
    { value: 'DATE', label: 'Tarih' }
  ];

  return (
    <div>
      {/* Mevcut Tablolar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Mevcut Tablolar ({tables.length})
          </h3>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            {showCreateForm ? 'İptal' : 'Yeni Tablo'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : tables.length === 0 ? (
          <p className="text-gray-600 text-center py-4">Henüz tablo bulunmuyor.</p>
        ) : (
          <div className="grid gap-2">
            {tables.map((tableName) => (
              <div
                key={tableName}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  currentTable === tableName
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
                onClick={() => onTableSelected(tableName)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{tableName}</span>
                  {currentTable === tableName && (
                    <span className="text-primary-600 text-sm">Seçili</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tablo Oluşturma Formu */}
      {showCreateForm && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Yeni Tablo Oluştur</h3>
          
          <form onSubmit={handleCreateTable} className="space-y-4">
            <div>
              <label htmlFor="tableName" className="block text-sm font-medium text-gray-700 mb-1">
                Tablo Adı *
              </label>
              <input
                type="text"
                id="tableName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="input-field"
                placeholder="Örn: products, orders, customers"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Sütunlar *
                </label>
                <button
                  type="button"
                  onClick={addColumn}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Sütun Ekle
                </button>
              </div>

              <div className="space-y-3">
                {formData.columns.map((column, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={column.name}
                      onChange={(e) => updateColumn(index, 'name', e.target.value)}
                      placeholder="Sütun adı"
                      className="input-field flex-1"
                      required
                    />
                    <select
                      value={column.type}
                      onChange={(e) => updateColumn(index, 'type', e.target.value)}
                      className="input-field w-32"
                    >
                      {getTypeOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={column.primaryKey || false}
                        onChange={(e) => updateColumn(index, 'primaryKey', e.target.checked)}
                        className="mr-1"
                      />
                      <span className="text-xs">PK</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={column.autoIncrement || false}
                        onChange={(e) => updateColumn(index, 'autoIncrement', e.target.checked)}
                        className="mr-1"
                      />
                      <span className="text-xs">AI</span>
                    </label>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeColumn(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Oluşturuluyor...' : 'Tablo Oluştur'}
            </button>
          </form>
        </div>
      )}

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