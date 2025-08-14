'use client';

interface Client {
  id: string;
  name: string;
  email: string;
  industry: string;
  createdAt: Date;
}

interface ClientSelectionProps {
  clients: Client[];
  currentClient: Client | null;
  onClientSelected: (client: Client) => void;
  onRefresh: () => void;
  loading: boolean;
}

export default function ClientSelection({ 
  clients, 
  currentClient, 
  onClientSelected, 
  onRefresh, 
  loading 
}: ClientSelectionProps) {
  
  const getIndustryLabel = (industry: string) => {
    const labels: Record<string, string> = {
      restaurant: 'Restoran / Yemek',
      retail: 'Perakende / Mağaza',
      service: 'Hizmet',
      manufacturing: 'Üretim',
      healthcare: 'Sağlık',
      education: 'Eğitim',
      technology: 'Teknoloji',
      other: 'Diğer'
    };
    return labels[industry] || industry;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Müşteriler yükleniyor...</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Henüz müşteri bulunmuyor.</p>
        <button
          onClick={onRefresh}
          className="btn-secondary"
        >
          Yenile
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Mevcut Müşteriler ({clients.length})
        </h3>
        <button
          onClick={onRefresh}
          className="btn-secondary text-sm"
        >
          Yenile
        </button>
      </div>

      <div className="grid gap-3">
        {clients.map((client) => (
          <div
            key={client.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              currentClient?.id === client.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}
            onClick={() => onClientSelected(client)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{client.name}</h4>
                <p className="text-sm text-gray-600">{client.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getIndustryLabel(client.industry)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(client.createdAt)}
                  </span>
                </div>
              </div>
              {currentClient?.id === client.id && (
                <div className="text-primary-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {currentClient && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Seçili Müşteri:</strong> {currentClient.name} ({currentClient.email})
          </p>
        </div>
      )}
    </div>
  );
} 