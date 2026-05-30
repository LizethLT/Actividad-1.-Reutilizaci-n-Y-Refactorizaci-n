
import { useState } from 'react';
import AppLayout      from './layout/AppLayout.jsx';
import InventarioPage  from './pages/InventarioPage.jsx';
import VentasPage      from './pages/VentasPage.jsx';
import FacturacionPage from './pages/FacturacionPage.jsx';

export default function App() {
  const [tab, setTab] = useState('inventario');

  return (
    <AppLayout tab={tab} onCambiarTab={setTab}>
      {tab === 'inventario'  && <InventarioPage />}
      {tab === 'ventas'      && <VentasPage />}
      {tab === 'facturacion' && <FacturacionPage />}
    </AppLayout>
  );
}