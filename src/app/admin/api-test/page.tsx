'use client';

import { useEffect, useState } from 'react';
import {
  getBaseUrl,
  getAuthHeaders,
  saveApiConfig,
  loadApiConfig,
} from '@/lib/apiConfig';
import { useRouter } from 'next/navigation';

interface ApiTest {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  status: 'success' | 'error' | 'pending';
  responseTime: number;
  lastTested: string;
}

export default function ApiTestPage() {
  const router = useRouter();
  const [tests, setTests] = useState<ApiTest[]>([
    {
      id: '1',
      name: 'User Login',
      method: 'POST',
      path: '/api/auth/test-login',
      status: 'success',
      responseTime: 45,
      lastTested: '2024-01-15 14:30',
    },
    {
      id: '2',
      name: 'Get Users',
      method: 'GET',
      path: '/api/users',
      status: 'success',
      responseTime: 32,
      lastTested: '2024-01-15 14:25',
    },
    {
      id: '3',
      name: 'Create Project',
      method: 'POST',
      path: '/api/projects',
      status: 'error',
      responseTime: 120,
      lastTested: '2024-01-15 14:20',
    },
    {
      id: '4',
      name: 'Update Project',
      method: 'PUT',
      path: '/api/projects/:id',
      status: 'pending',
      responseTime: 0,
      lastTested: '2024-01-15 14:15',
    },
  ]);

  const [runningTest, setRunningTest] = useState<string | null>(null);
  const [newTest, setNewTest] = useState<{
    name: string;
    method: ApiTest['method'];
    path: string;
  }>({ name: '', method: 'GET', path: '' });

  // Persist tests to localStorage for portability
  useEffect(() => {
    try {
      const raw = localStorage.getItem('api_tests_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTests(parsed);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('api_tests_v1', JSON.stringify(tests));
    } catch {}
  }, [tests]);

  const runTest = async (testId: string) => {
    setRunningTest(testId);
    try {
      const cfg = loadApiConfig();
      const test = tests.find(t => t.id === testId);
      if (!test) return;
      const url = `${getBaseUrl()}${test.path}`;
      const start = Date.now();
      const res = await fetch(url, {
        method: test.method,
        headers: getAuthHeaders(),
      });
      const ms = Date.now() - start;
      setTests(prev =>
        prev.map(t =>
          t.id === testId
            ? {
                ...t,
                status: res.ok ? 'success' : 'error',
                responseTime: ms,
                lastTested: new Date().toLocaleString('tr-TR'),
              }
            : t
        )
      );
    } catch (e) {
      const ms = 0;
      setTests(prev =>
        prev.map(t =>
          t.id === testId
            ? {
                ...t,
                status: 'error',
                responseTime: ms,
                lastTested: new Date().toLocaleString('tr-TR'),
              }
            : t
        )
      );
    } finally {
      setRunningTest(null);
    }
  };

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800';
      case 'POST':
        return 'bg-blue-100 text-blue-800';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              <i className="fas fa-arrow-left text-xl"></i>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">API Test</h1>
              <p className="text-gray-600">
                API endpoint&apos;lerini test edin
              </p>
            </div>
          </div>
          <button
            onClick={runAllTests}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            <i className="fas fa-play mr-2"></i>
            Tümünü Test Et
          </button>
        </div>

        {/* API Base & Token Config */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              API Bağlantı Yapılandırması
            </h2>
            <p className="text-gray-600 mt-1">
              Her projede farklı backend’e kolayca bağlanın
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Base URL
              </label>
              <input
                defaultValue={loadApiConfig().baseUrl}
                onBlur={e =>
                  saveApiConfig({ ...loadApiConfig(), baseUrl: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="https://api.musteri.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Auth Token (opsiyonel)
              </label>
              <input
                defaultValue={loadApiConfig().authToken || ''}
                onBlur={e =>
                  saveApiConfig({
                    ...loadApiConfig(),
                    authToken: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="Bearer ..."
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setTests([...tests])}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded"
              >
                Yapılandırmayı Uygula
              </button>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Test Sonuçları
            </h2>
            <p className="text-gray-600 mt-1">
              API endpoint&apos;lerinin durumu ve performansı
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 border-b">API</th>
                  <th className="text-left p-4 border-b">Method</th>
                  <th className="text-left p-4 border-b">Path</th>
                  <th className="text-left p-4 border-b">Status</th>
                  <th className="text-left p-4 border-b">Response Time</th>
                  <th className="text-left p-4 border-b">Last Tested</th>
                  <th className="text-left p-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map(test => (
                  <tr
                    key={test.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {test.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodColor(test.method)}`}
                      >
                        {test.method}
                      </span>
                    </td>
                    <td className="p-4">
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {test.path}
                      </code>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}
                      >
                        {test.status === 'success'
                          ? '✅ Başarılı'
                          : test.status === 'error'
                            ? '❌ Hata'
                            : '⏳ Bekliyor'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-900">
                        {test.responseTime > 0 ? `${test.responseTime}ms` : '-'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600">
                        {test.lastTested}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => runTest(test.id)}
                        disabled={runningTest === test.id}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        {runningTest === test.id ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-1"></i>
                            Test...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-play mr-1"></i>
                            Test Et
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Test Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <i className="fas fa-check text-green-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Başarılı</p>
                <p className="text-lg font-semibold text-gray-900">
                  {tests.filter(t => t.status === 'success').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <i className="fas fa-times text-red-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Hata</p>
                <p className="text-lg font-semibold text-gray-900">
                  {tests.filter(t => t.status === 'error').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <i className="fas fa-clock text-yellow-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Bekliyor</p>
                <p className="text-lg font-semibold text-gray-900">
                  {tests.filter(t => t.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <i className="fas fa-tachometer-alt text-blue-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Ortalama Süre</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.round(
                    tests
                      .filter(t => t.responseTime > 0)
                      .reduce((acc, t) => acc + t.responseTime, 0) /
                      (tests.filter(t => t.responseTime > 0).length || 1)
                  )}
                  ms
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Test */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Yeni API Testi Ekle
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              value={newTest.name}
              onChange={e => setNewTest({ ...newTest, name: e.target.value })}
              className="border rounded px-3 py-2"
              placeholder="İsim"
            />
            <select
              value={newTest.method}
              onChange={e =>
                setNewTest({
                  ...newTest,
                  method: e.target.value as ApiTest['method'],
                })
              }
              className="border rounded px-3 py-2"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
              <option>PATCH</option>
            </select>
            <input
              value={newTest.path}
              onChange={e => setNewTest({ ...newTest, path: e.target.value })}
              className="border rounded px-3 py-2"
              placeholder="/api/..."
            />
            <button
              onClick={() => {
                if (!newTest.name || !newTest.path) return;
                const id = Date.now().toString();
                setTests(prev => [
                  ...prev,
                  {
                    id,
                    name: newTest.name,
                    method: newTest.method,
                    path: newTest.path,
                    status: 'pending',
                    responseTime: 0,
                    lastTested: '-',
                  },
                ]);
                setNewTest({ name: '', method: 'GET', path: '' });
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
