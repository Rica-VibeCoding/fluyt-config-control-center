
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Save } from 'lucide-react';
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
    // Here would load the configuration for the selected store
    const store = stores.find(s => s.id === storeId);
    setConfig(prev => ({
      ...prev,
      storeId,
      storeName: store?.name || ''
    }));
  };

  const handleSave = () => {
    // Validation
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

    // Create snapshot for history
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
    // Example calculation showing deflator impact
    const exampleCost = 1000;
    const withoutDeflator = exampleCost;
    const withDeflator = exampleCost * (1 - deflator / 100);
    const difference = withoutDeflator - withDeflator;
    return { withoutDeflator, withDeflator, difference };
  };

  const marginImpact = calculateMarginImpact(config.deflatorCost);

  return (
    <div className="space-y-4">
      {/* Header com alerta simplificado */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-semibold text-foreground mb-3">Configurações da Loja</h2>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Configuração Crítica:</strong> Estas configurações impactam diretamente o cálculo de margens, 
            numeração de orçamentos e limites de desconto. Alterações geram snapshots históricos.
          </AlertDescription>
        </Alert>
      </div>

      {/* Seleção de loja sempre visível */}
      <div className="bg-muted/30 border border-border rounded-md p-4">
        <Label htmlFor="store" className="text-sm font-medium mb-2 block">Loja</Label>
        <Select value={selectedStore} onValueChange={handleStoreChange}>
          <SelectTrigger className="w-full max-w-xs">
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

      {/* Configurações em layout mais compacto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Configurações Financeiras */}
        <div className="border border-border rounded-md p-4 bg-background">
          <h3 className="font-semibold text-foreground mb-4 border-b border-border pb-2">Configurações Financeiras</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="deflatorCost" className="text-sm font-medium">Deflator Custo Fábrica (%)</Label>
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
                className="mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Impacto na margem: R$ {marginImpact.difference.toFixed(2)} por R$ 1.000
              </div>
            </div>

            <div>
              <Label htmlFor="freightPercentage" className="text-sm font-medium">Percentual de Frete (%)</Label>
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
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="defaultMeasurementValue" className="text-sm font-medium">Valor Padrão Medição (R$)</Label>
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
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Limites de Desconto */}
        <div className="border border-border rounded-md p-4 bg-background">
          <h3 className="font-semibold text-foreground mb-4 border-b border-border pb-2">Limites de Desconto por Perfil</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="discountLimitVendor" className="text-sm font-medium">Limite Vendedor (%)</Label>
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
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="discountLimitManager" className="text-sm font-medium">Limite Gerente (%)</Label>
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
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="discountLimitAdminMaster" className="text-sm font-medium">Limite Admin Master (%)</Label>
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
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Configuração de Numeração */}
        <div className="lg:col-span-2 border border-border rounded-md p-4 bg-background">
          <h3 className="font-semibold text-foreground mb-4 border-b border-border pb-2">Configuração de Numeração</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="numberPrefix" className="text-sm font-medium">Prefixo</Label>
              <Input
                id="numberPrefix"
                value={config.numberPrefix}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  numberPrefix: e.target.value.toUpperCase() 
                }))}
                placeholder="ORC"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="numberFormat" className="text-sm font-medium">Formato</Label>
              <Select
                value={config.numberFormat}
                onValueChange={(value) => setConfig(prev => ({ 
                  ...prev, 
                  numberFormat: value 
                }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YYYY-NNNNNN">YYYY-NNNNNN</SelectItem>
                  <SelectItem value="NNNNNN">NNNNNN</SelectItem>
                  <SelectItem value="MM-YYYY-NNNN">MM-YYYY-NNNN</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="initialNumber" className="text-sm font-medium">Número Inicial</Label>
              <Input
                id="initialNumber"
                type="number"
                min="1"
                value={config.initialNumber}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  initialNumber: Number(e.target.value) 
                }))}
                className="mt-1"
              />
            </div>
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded border border-border">
            <div className="text-sm font-medium text-foreground">Exemplo de numeração:</div>
            <div className="text-lg font-mono text-foreground">
              {config.numberPrefix}-{config.numberFormat.replace('YYYY', '2024').replace('MM', '06').replace(/N+/g, config.initialNumber.toString().padStart(6, '0'))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer com ações */}
      <div className="border-t border-border pt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Última atualização: {new Date(config.updatedAt).toLocaleDateString('pt-BR')}
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};
