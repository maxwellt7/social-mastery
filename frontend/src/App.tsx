import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './routes/Dashboard'
import OfferSetup from './routes/OfferSetup'
import IGDiscovery from './routes/IGDiscovery'
import Templates from './routes/Templates'
import Campaigns from './routes/Campaigns'
import Analytics from './routes/Analytics'
import Settings from './routes/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="offers" element={<OfferSetup />} />
          <Route path="discovery" element={<IGDiscovery />} />
          <Route path="templates" element={<Templates />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
