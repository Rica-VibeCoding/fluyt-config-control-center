
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Save, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StoreConfiguration {
  storeId: string;
  storeName: string;
  deflatorCost: number;
  discountLimitVendor: number;
  discountLimitManager: number;
  discountLimitAdminMaster: number;
  defaultMeasurementValue: number;
  freightPercentage: number;
  initialNumber: number;
  numberFormat: string;
  numberPrefix: string;
  updatedAt: string;
}

export const StoreConfig = () => {
  const { toast } = useToast();
  const [selectedStore, setSelectedStore] = useState('1');
  const [config, setConfig] = useState<StoreConfiguration>({
    storeId: '1',
    storeName: 'Loja Centro',
    deflatorCost: 15.5,
    discountLimitVendor: 10,
    discountLimitManager: 20,
    discountLimitAdminMaster: 50,
    defaultMeasurementValue: 120,
    freightPercentage: 8.5,
    initialNumber: 1001,
    numberFormat: 'YYYY-NNNNNN',
    numberPrefix: 'ORC',
    updatedAt: '2024-06-01'
  });

  const stores = [
    { id: '1', name: 'Loja Centro' },
    { id: '2', name: 'Loja Shopping Norte' },
    { id: '3', name: 'Loja Sul' }
  ];

  const handleStoreChange = (storeId: string) => {
    setSelectedStore(storeId);
    const store = stores.find(s => s.id === storeId);
    setConfig(prev => ({
      ...prev,
      storeId,
      storeName: store?.name || ''
    }));
  };

  const handleSave = () => {
    if (config.deflatorCost < 0 || config.deflatorCost > 100) {
      toast({
        title: "Deflator inválido",
        description: "O deflator deve estar entre 0% e 100%.",
        variant: "destructive"
      });
      return;
    }

    if (config.discountLimitVendor > config.discountLimitManager) {
      toast({
        title: "Limites inconsistentes",
        description: "O limite do vendedor não pode ser maior que o do gerente.",
        variant: "destructive"
      });
      return;
    }

    const snapshot = {
      ...config,
      updatedAt: new Date().toISOString().split('T')[0],
      snapshotId: Date.now().toString()
    };

    console.log('Creating configuration snapshot:', snapshot);

    toast({
      title: "Configurações salvas",
      description: "As configurações da loja foram atualizadas e um snapshot histórico foi criado."
    });
  };

  const calculateMarginImpact = (deflator: number) => {
    const exampleCost = 1000;
    const withoutDeflator = exampleCost;
    const withDeflator = exampleCost * (1 - deflator / 100);
    const difference = withoutDeflator - withDeflator;
    return { withoutDeflator, withDeflator, difference };
  };

  const marginImpact = calculateMarginImpact(config.deflatorCost);

  return (
    <div className="productivity-section">
      {/* Header */}
      <div className="productivity-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="productivity-icon-container">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h2 className="productivity-heading-lg">Configurações da Loja</h2>
            <p className="productivity-description">
              Configure parâmetros críticos que impactam cálculos e operações
            </p>
          </div>
        </div>

        <Alert className="border-warning/20 bg-warning/5">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="productivity-text-body">
            <strong>Configuração Crítica:</strong> Estas configurações impactam diretamente o cálculo de margens, 
            numeração de orçamentos e limites de desconto. Alterações geram snapshots históricos.
          </AlertDescription>
        </Alert>
      </div>

      {/* Seleção de loja */}
      <div className="productivity-card p-6">
        <div className="productivity-form-group max-w-xs">
          <Label htmlFor="store" className="productivity-label">Loja</Label>
          <Select value={selectedStore} onValueChange={handleStoreChange}>
            <SelectTrigger className="productivity-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Configurações */}
      <div className="productivity-grid productivity-grid-cols-2">
        {/* Configurações Financeiras */}
        <div className="productivity-card p-6">
          <h3 className="productivity-heading-md mb-6 pb-3 border-b border-border">
            Configurações Financeiras
          </h3>
          <div className="productivity-section">
            <div className="productivity-form-group">
              <Label htmlFor="deflatorCost" className="productivity-label">
                Deflator Custo Fábrica (%)
              </Label>
              <Input
                id="deflatorCost"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={config.deflatorCost}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  deflatorCost: Number(e.target.value) 
                }))}
                className="productivity-input"
              />
              <div className="productivity-description">
                Impacto na margem: R$ {marginImpact.difference.toFixed(2)} por R$ 1.000
              </div>
            </div>

            <div className="productivity-form-group">
              <Label htmlFor="freightPercentage" className="productivity-label">
                Percentual de Frete (%)
              </Label>
              <Input
                id="freightPercentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={config.freightPercentage}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  freightPercentage: Number(e.target.value) 
                }))}
                className="productivity-input"
              />
            </div>

            <div className="productivity-form-group">
              <Label htmlFor="defaultMeasurementValue" className="productivity-label">
                Valor Padrão Medição (R$)
              </Label>
              <Input
                id="defaultMeasurementValue"
                type="number"
                min="0"
                step="0.01"
                value={config.defaultMeasurementValue}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  defaultMeasurementValue: Number(e.target.value) 
                }))}
                className="productivity-input"
              />
            </div>
          </div>
        </div>

        {/* Limites de Desconto */}
        <div className="productivity-card p-6">
          <h3 className="productivity-heading-md mb-6 pb-3 border-b border-border">
            Limites de Desconto por Perfil
          </h3>
          <div className="productivity-section">
            <div className="productivity-form-group">
              <Label htmlFor="discountLimitVendor" className="productivity-label">
                Limite Vendedor (%)
              </Label>
              <Input
                id="discountLimitVendor"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={config.discountLimitVendor}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  discountLimitVendor: Number(e.target.value) 
                }))}
                className="productivity-input"
              />
            </div>

            <div className="productivity-form-group">
              <Label htmlFor="discountLimitManager" className="productivity-label">
                Limite Gerente (%)
              </Label>
              <Input
                id="discountLimitManager"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={config.discountLimitManager}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  discountLimitManager: Number(e.target.value) 
                }))}
                className="productivity-input"
              />
            </div>

            <div className="productivity-form-group">
              <Label htmlFor="discountLimitAdminMaster" className="productivity-label">
                Limite Admin Master (%)
              </Label>
              <Input
                id="discountLimitAdminMaster"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={config.discountLimitAdminMaster}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  discountLimitAdminMaster: Number(e.target.value) 
                }))}
                className="productivity-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Configuração de Numeração */}
      <div className="productivity-card p-6">
        <h3 className="productivity-heading-md mb-6 pb-3 border-b border-border">
          Configuração de Numeração
        </h3>
        <div className="productivity-grid productivity-grid-cols-3">
          <div className="productivity-form-group">
            <Label htmlFor="numberPrefix" className="productivity-label">Prefixo</Label>
            <Input
              id="numberPrefix"
              value={config.numberPrefix}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                numberPrefix: e.target.value.toUpperCase() 
              }))}
              placeholder="ORC"
              className="productivity-input"
            />
          </div>

          <div className="productivity-form-group">
            <Label htmlFor="numberFormat" className="productivity-label">Formato</Label>
            <Select
              value={config.numberFormat}
              onValueChange={(value) => setConfig(prev => ({ 
                ...prev, 
                numberFormat: value 
              }))}
            >
              <SelectTrigger className="productivity-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YYYY-NNNNNN">YYYY-NNNNNN</SelectItem>
                <SelectItem value="NNNNNN">NNNNNN</SelectItem>
                <SelectItem value="MM-YYYY-NNNN">MM-YYYY-NNNN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="productivity-form-group">
            <Label htmlFor="initialNumber" className="productivity-label">Número Inicial</Label>
            <Input
              id="initialNumber"
              type="number"
              min="1"
              value={config.initialNumber}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                initialNumber: Number(e.target.value) 
              }))}
              className="productivity-input"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="productivity-label mb-2">Exemplo de numeração:</div>
          <div className="text-lg font-mono text-foreground">
            {config.numberPrefix}-{config.numberFormat.replace('YYYY', '2024').replace('MM', '06').replace(/N+/g, config.initialNumber.toString().padStart(6, '0'))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="productivity-card p-6">
        <div className="flex items-center justify-between">
          <div className="productivity-description">
            Última atualização: {new Date(config.updatedAt).toLocaleDateString('pt-BR')}
          </div>
          <Button onClick={handleSave} className="productivity-button-primary">
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};
