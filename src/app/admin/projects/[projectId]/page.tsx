'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  name: string;
  type: 'web' | 'mobile' | 'backend' | 'ai' | 'blockchain';
  status: 'planning' | 'developing' | 'testing' | 'deployed' | 'maintenance';
  progress: number;
  startDate: string;
  endDate: string;
  team: any[];
  description: string;
  technologies: string[];
  budget: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export default function ProjectDetails({ params }: { params: { projectId: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedProject, setEditedProject] = useState<Project | null>(null);

  useEffect(() => {
    // Simulated project data - in real app, fetch from API
    const mockProject: Project = {
      id: params.projectId,
      name: 'Pizza Palace Mobile App',
      type: 'mobile',
      status: 'developing',
      progress: 75,
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      team: [
        { id: '1', name: 'Fahri Kaymaz', role: 'Lead Developer', status: 'online' },
        { id: '2', name: 'Fahri Kaymaz', role: 'UI/UX Designer', status: 'online' },
        { id: '3', name: 'Fahri Kaymaz', role: 'Backend Developer', status: 'busy' }
      ],
      description: 'Modern pizza ordering mobile application with real-time tracking and payment integration.',
      technologies: ['React Native', 'Node.js', 'MongoDB', 'Firebase', 'Stripe'],
      budget: 50000,
      priority: 'high'
    };

    setProject(mockProject);
    setEditedProject(mockProject);
    setLoading(false);
  }, [params.projectId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update project with edited data
    if (editedProject) {
      setProject(editedProject);
    }
    
    setIsEditing(false);
    setSaving(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProject(project);
  };

  const handleInputChange = (field: keyof Project, value: any) => {
    if (editedProject) {
      setEditedProject({
        ...editedProject,
        [field]: value
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Proje detayları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Proje Bulunamadı</h2>
          <button 
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600">Proje Detayları</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <button 
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <i className="fas fa-edit mr-2"></i>
                Düzenle
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {saving ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Kaydet
                    </>
                  )}
                </button>
                <button 
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="fas fa-times mr-2"></i>
                  İptal
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Proje Bilgileri</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Proje Adı</h3>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProject?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                    />
                  ) : (
                    <p className="text-gray-900 mt-1">{project.name}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Açıklama</h3>
                  {isEditing ? (
                    <textarea
                      value={editedProject?.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                    />
                  ) : (
                    <p className="text-gray-900 mt-1">{project.description}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Proje Tipi</h3>
                    {isEditing ? (
                      <select
                        value={editedProject?.type || ''}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                      >
                        <option value="web">Web</option>
                        <option value="mobile">Mobile</option>
                        <option value="backend">Backend</option>
                        <option value="ai">AI</option>
                        <option value="blockchain">Blockchain</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 mt-1 capitalize">{project.type}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Durum</h3>
                    {isEditing ? (
                      <select
                        value={editedProject?.status || ''}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                      >
                        <option value="planning">Planlama</option>
                        <option value="developing">Geliştirme</option>
                        <option value="testing">Test</option>
                        <option value="deployed">Yayında</option>
                        <option value="maintenance">Bakım</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 mt-1 capitalize">{project.status}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Başlangıç Tarihi</h3>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedProject?.startDate || ''}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{project.startDate}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Bitiş Tarihi</h3>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedProject?.endDate || ''}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{project.endDate}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Bütçe ($)</h3>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedProject?.budget || 0}
                        onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">${project.budget.toLocaleString()}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">İlerleme (%)</h3>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editedProject?.progress || 0}
                        onChange={(e) => handleInputChange('progress', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Teknolojiler</h2>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editedProject?.technologies.join(', ') || ''}
                    onChange={(e) => handleInputChange('technologies', e.target.value.split(', ').filter(t => t.trim()))}
                    placeholder="React, Node.js, MongoDB..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Teknolojileri virgülle ayırın</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Team */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ekip</h2>
              <div className="space-y-3">
                {project.team.map((member, index) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-800">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{member.name}</h4>
                        <p className="text-xs text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        member.status === 'online' ? 'bg-green-500' :
                        member.status === 'busy' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}></div>
                      <span className="text-xs text-gray-600 capitalize">{member.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <i className="fas fa-tasks mr-2"></i>
                  Görev Ekle
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <i className="fas fa-users mr-2"></i>
                  Ekip Ekle
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <i className="fas fa-chart-bar mr-2"></i>
                  Rapor Oluştur
                </button>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <i className="fas fa-download mr-2"></i>
                  Dışa Aktar
                </button>
              </div>
            </div>

            {/* Project Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">İstatistikler</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tamamlanan Görevler</span>
                  <span className="text-sm font-semibold text-gray-900">24/32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Kalan Süre</span>
                  <span className="text-sm font-semibold text-gray-900">45 gün</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bütçe Kullanımı</span>
                  <span className="text-sm font-semibold text-gray-900">$37,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Aktif Ekip</span>
                  <span className="text-sm font-semibold text-gray-900">{project.team.length} kişi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 