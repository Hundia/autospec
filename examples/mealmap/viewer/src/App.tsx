import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { BacklogPage } from './pages/BacklogPage'
import { SpecsPage } from './pages/SpecsPage'
import { DocsPage } from './pages/DocsPage'
import { DesignSystemPage } from './pages/DesignSystemPage'
import { ArchitecturePage } from './pages/ArchitecturePage'
import { AboutPage } from './pages/AboutPage'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/backlog" element={<BacklogPage />} />
          <Route path="/specs" element={<SpecsPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
