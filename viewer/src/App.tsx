import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { DocsPage } from './pages/DocsPage'
import { SpecsPage } from './pages/SpecsPage'
import { BacklogPage } from './pages/BacklogPage'
import { SkillsPage } from './pages/SkillsPage'
import { EnvironmentsPage } from './pages/EnvironmentsPage'
import { DesignSystemPage } from './pages/DesignSystemPage'
import { SprintPage } from './pages/SprintPage'
import { SprintsListPage } from './pages/SprintsListPage'
import { BenchmarkOverviewPage } from './pages/BenchmarkOverviewPage'
import { BenchmarkResultsPage } from './pages/BenchmarkResultsPage'

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/docs/:section/:slug" element={<DocsPage />} />
          <Route path="/specs/:slug" element={<SpecsPage />} />
          <Route path="/backlog" element={<BacklogPage />} />
          <Route path="/sprints" element={<SprintsListPage />} />
          <Route path="/sprint/:id" element={<SprintPage />} />
          <Route path="/skills/:slug" element={<SkillsPage />} />
          <Route path="/environments" element={<EnvironmentsPage />} />
          <Route path="/benchmark" element={<BenchmarkOverviewPage />} />
          <Route path="/benchmark/results" element={<BenchmarkResultsPage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
