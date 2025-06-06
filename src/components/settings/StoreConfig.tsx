
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store, AlertTriangle, Save } from 'lucide-react';
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
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Configuração Crítica:</strong> Estas configurações impactam diretamente o cálculo de margens, 
          numeração de orçamentos e limites de desconto. Alterações geram snapshots históricos.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Configurações da Loja
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="store">Loja *</Label>
            <Select value={selectedStore} onValueChange={handleStoreChange}>
              <SelectTrigger>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Financial Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações Financeiras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="deflatorCost">Deflator Custo Fábrica (%) *</Label>
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
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    Impacto na margem: R$ {marginImpact.difference.toFixed(2)} por R$ 1.000
                  </div>
                </div>

                <div>
                  <Label htmlFor="freightPercentage">Percentual de Frete (%)</Label>
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
                  />
                </div>

                <div>
                  <Label htmlFor="defaultMeasurementValue">Valor Padrão Medição (R$)</Label>
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
                  />
                </div>
              </CardContent>
            </Card>

            {/* Discount Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Limites de Desconto por Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="discountLimitVendor">Limite Vendedor (%)</Label>
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
                  />
                </div>

                <div>
                  <Label htmlFor="discountLimitManager">Limite Gerente (%)</Label>
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
                  />
                </div>

                <div>
                  <Label htmlFor="discountLimitAdminMaster">Limite Admin Master (%)</Label>
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
                  />
                </div>
              </CardContent>
            </Card>

            {/* Numbering Configuration */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Configuração de Numeração</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="numberPrefix">Prefixo</Label>
                    <Input
                      id="numberPrefix"
                      value={config.numberPrefix}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        numberPrefix: e.target.value.toUpperCase() 
                      }))}
                      placeholder="ORC"
                    />
                  </div>

                  <div>
                    <Label htmlFor="numberFormat">Formato</Label>
                    <Select
                      value={config.numberFormat}
                      onValueChange={(value) => setConfig(prev => ({ 
                        ...prev, 
                        numberFormat: value 
                      }))}
                    >
                      <SelectTrigger>
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
                    <Label htmlFor="initialNumber">Número Inicial</Label>
                    <Input
                      id="initialNumber"
                      type="number"
                      min="1"
                      value={config.initialNumber}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        initialNumber: Number(e.target.value) 
                      }))}
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Exemplo de numeração:</div>
                  <div className="text-lg font-mono">
                    {config.numberPrefix}-{config.numberFormat.replace('YYYY', '2024').replace('MM', '06').replace(/N+/g, config.initialNumber.toString().padStart(6, '0'))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Salvar Configurações
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Última atualização: {new Date(config.updatedAt).toLocaleDateString('pt-BR')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
