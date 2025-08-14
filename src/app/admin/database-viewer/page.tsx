'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DatabaseStats {
  users: number;
  reviews: number;
  products: number;
  orders: number;
  verificationCodes: number;
}

interface TableInfo {
  name: string;
  count: number;
}

interface DatabaseInfo {
  size: number;
  sizeFormatted: string;
  tables: number;
  stats: DatabaseStats;
}

export default function DatabaseViewer() {
  const router = useRouter();
  const [databaseInfo, setDatabaseInfo] = useState<DatabaseInfo | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchDatabaseInfo();
  }, []);

  const fetchDatabaseInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/database-viewer');
      
      if (!response.ok) {
        throw new Error('Veritabanı bilgileri alınamadı');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setDatabaseInfo(data.database);
        setTables(data.tables);
      } else {
        setError(data.error || 'Bilinmeyen hata');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async (tableName: string, page: number = 1) => {
    try {
      setLoading(true);
      const offset = (page - 1) * itemsPerPage;
      
      const response = await fetch(
        `/api/admin/database-viewer?table=${tableName}&limit=${itemsPerPage}&offset=${offset}`
      );
      
      if (!response.ok) {
        throw new Error('Tablo verileri alınamadı');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTableData(data.data);
        setTotalCount(data.totalCount);
        setCurrentPage(page);
      } else {
        setError(data.error || 'Bilinmeyen hata');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    setCurrentPage(1);
    fetchTableData(tableName, 1);
  };

  const handlePageChange = (page: number) => {
    fetchTableData(selectedTable, page);
  };

  const maskSensitiveData = (key: string, value: any) => {
    if (key.toLowerCase().includes('password') || key.toLowerCase().includes('hash')) {
      return '********';
    }
    if (key.toLowerCase().includes('code') && typeof value === 'string' && value.length > 2) {
      return value.substring(0, 2) + '****';
    }
    if (key.toLowerCase().includes('email') && typeof value === 'string') {
      const [local, domain] = value.split('@');
      if (local && domain) {
        return local.substring(0, 2) + '***@' + domain;
      }
    }
    return value;
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (loading && !databaseInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Veritabanı bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Hata</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/admin')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Admin Paneline Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🔒 Güvenli Veritabanı Görüntüleyici</h1>
              <p className="text-gray-600">Sadece görüntüleme - Değişiklik yapılamaz</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              ← Admin Paneline Dön
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Database Overview */}
        {databaseInfo && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Veritabanı Genel Bakış</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{databaseInfo.sizeFormatted}</div>
                <div className="text-sm text-gray-600">Veritabanı Boyutu</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{databaseInfo.tables}</div>
                <div className="text-sm text-gray-600">Toplam Tablo</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{databaseInfo.stats.users}</div>
                <div className="text-sm text-gray-600">Kullanıcı</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{databaseInfo.stats.products}</div>
                <div className="text-sm text-gray-600">Ürün</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tables List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">📋 Tablolar</h3>
              </div>
              <div className="p-4">
                {tables.map((table) => (
                  <button
                    key={table.name}
                    onClick={() => handleTableSelect(table.name)}
                    className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                      selectedTable === table.name
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{table.name}</span>
                      <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                        {table.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Data */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedTable ? `📄 ${selectedTable} Tablosu` : '📄 Tablo Seçin'}
                </h3>
                {selectedTable && (
                  <p className="text-sm text-gray-600 mt-1">
                    Toplam {totalCount} kayıt • Sayfa {currentPage} / {totalPages}
                  </p>
                )}
              </div>
              
              {selectedTable && (
                <div className="p-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Veriler yükleniyor...</p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {tableData.length > 0 &&
                                Object.keys(tableData[0]).map((key) => (
                                  <th
                                    key={key}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    {key}
                                  </th>
                                ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {tableData.map((row, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                {Object.entries(row).map(([key, value]) => (
                                  <td
                                    key={key}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                  >
                                    <span className="font-mono text-xs">
                                      {maskSensitiveData(key, value)}
                                    </span>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="mt-4 flex justify-between items-center">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                          >
                            ← Önceki
                          </button>
                          
                          <span className="text-sm text-gray-600">
                            Sayfa {currentPage} / {totalPages}
                          </span>
                          
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                          >
                            Sonraki →
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              
              {!selectedTable && (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-4">📋</div>
                  <p>Görüntülemek için sol taraftan bir tablo seçin</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="text-yellow-400 text-xl">🔒</div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Güvenlik Uyarısı</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Bu panel sadece veri görüntüleme amaçlıdır. Hassas veriler (şifreler, kodlar) 
                  otomatik olarak maskelenir. Veri değişikliği yapılamaz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
